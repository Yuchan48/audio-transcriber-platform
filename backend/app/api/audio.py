from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Depends,  BackgroundTasks, Request
import os

from sqlalchemy.orm import joinedload
from app.models.models import AudioFile, Transcription
from app.db.session import get_db
from app.services.transcription import transcribe_audio
from app.utils.file_validation import validate_file_count, validate_file_size

from sqlalchemy.orm import Session
from app.core.jwt import decode_access_token

router = APIRouter(prefix="/audio", tags=["audio"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Get current user from cookie
def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    # return user id and role from the token payload
    user_id = int(payload.get("sub")) # type: ignore
    role = payload.get("role")
    return user_id, role

# List all audio files for the current user
@router.get("/")
def list_audio_files(user: tuple[int, str] = Depends(get_current_user), db: Session = Depends(get_db), skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    user_id, _ = user
    # fetch audio files for the current user with pagination
    # Default limit 20, max 100
    audio_files = db.query(AudioFile).filter(AudioFile.user_id == user_id).offset(skip).limit(limit).all()
    return [{"id": f.id, "filename": f.filename, "status": f.status} for f in audio_files]

# Upload an audio file and trigger transcription
@router.post("/upload")
def upload_audio(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    user: tuple[int, str] = Depends(get_current_user),
):
    user_id, _ = user

    try:
        # Validate file count
        validate_file_count(db, user_id)

        # Validate file size
        contents = validate_file_size(file)

        # Save file locally
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(contents)

        # Save DB record
        audio_file = AudioFile(user_id=user_id, filename=file.filename, file_path=file_path, status="uploaded")
        db.add(audio_file)
        db.commit()
        db.refresh(audio_file)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

    # Trigger background task to transcribe the audio
    background_tasks.add_task(transcribe_audio, audio_file.id)

    return {"message": "File uploaded successfully", "audio_file_id": audio_file.id}

# Delete an audio file and its transcription - admin can delete any audio file, regular users can only delete their own audio files
@router.delete("/{audio_id}")
def delete_audio(audio_id: int, request: Request, db: Session = Depends(get_db)):
    user_id, role = get_current_user(request, db)
    # fetch audio file
    audio_file = db.query(AudioFile).filter(AudioFile.id == audio_id).first()
    if not audio_file:
        raise HTTPException(status_code=404, detail="Audio file not found")

    # Check if the audio file belongs to the current user or if the user is an admin
    if audio_file.user_id != user_id and role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this audio file")

    # Delete the audio file from the filesystem
    if os.path.exists(audio_file.file_path):
        os.remove(audio_file.file_path)

    # delete the transcription if exists
    db.query(Transcription).filter(Transcription.audio_file_id == audio_id).delete()

    # Delete audio file record from the database
    db.delete(audio_file)
    db.commit()

    return {"message": "Audio file and its transcriptions deleted successfully"}

# Admin endpoint to get all audio files with user info
@router.get("/all")
def get_all_audio(request: Request, db: Session = Depends(get_db)):
    _, role = get_current_user(request, db)
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    audio_files = db.query(AudioFile).options(joinedload(AudioFile.user)).all()
    return [{"id": f.id, "filename": f.filename, "status": f.status, "user_id": f.user_id, "user_email": f.user.email if f.user else None} for f in audio_files]
