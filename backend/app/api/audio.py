from fastapi import APIRouter, HTTPException, UploadFile, File, Depends,  BackgroundTasks, Request
import os

from app.models.models import AudioFile
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
def list_audio_files(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    audio_files = db.query(AudioFile).filter(AudioFile.user_id == user_id).all()
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

    # Save file locally
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # Save DB record
    audio_file = AudioFile(user_id=user_id, filename=file.filename, file_path=file_path, status="uploaded")
    db.add(audio_file)
    db.commit()
    db.refresh(audio_file)

    # Trigger background task to transcribe the audio
    background_tasks.add_task(transcribe_audio, audio_file.id)

    return {"message": "File uploaded successfully", "audio_file_id": audio_file.id}
