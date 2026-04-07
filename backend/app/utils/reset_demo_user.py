import os
from sqlalchemy.orm import Session

from app.models.models import Transcription, AudioFile

def reset_demo_user(db: Session, user_id: int):
    # Delete all audio files and transcriptions for the demo user
    files = db.query(AudioFile).filter(AudioFile.user_id == user_id).all()
    for f in files:
        try:
            # Delete the audio file from local storage
            if os.path.exists(f.file_path):
                os.remove(f.file_path)
        except Exception as e:
            print(f"Failed to delete file {f.file_path}: {e}")
    db.query(AudioFile).filter(AudioFile.user_id == user_id).delete()
    db.commit()
