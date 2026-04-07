from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Depends,  BackgroundTasks, Request
import os

from app.models.models import AudioFile, Transcription
from app.db.session import get_db
from app.services.transcription import transcribe_audio
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
    user_id = int(payload.get("sub"))
    return user_id

# List all audio files for the current user
@router.get("/")
def list_audio_files(user_id: int = Depends(get_current_user), db: Session = Depends(get_db), skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
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
    user_id: int = Depends(get_current_user),
):

    try:
            # Save file locally
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())

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

# Delete an audio file and its transcription
@router.delete("/{audio_id}")
def delete_audio(audio_id: int, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user(request, db)
    # fetch audio file
    audio_file = db.query(AudioFile).filter(AudioFile.id == audio_id).first()
    if not audio_file:
        raise HTTPException(status_code=404, detail="Audio file not found")

    # Check if the audio file belongs to the current user
    if audio_file.user_id != user_id:
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
