from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.models.models import AudioFile

import os
from dotenv import load_dotenv
load_dotenv()

MAX_FILES_PER_USER = int(os.getenv("MAX_FILES_PER_USER", 20))
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 5 * 1024 * 1024))  # Default to 5 MB

def validate_file_count(db: Session, user_id: int):
    file_count = db.query(AudioFile).filter(AudioFile.user_id == user_id).count()
    if file_count >= MAX_FILES_PER_USER:
        raise HTTPException(status_code=400, detail=f"File upload limit reached. Max {MAX_FILES_PER_USER} files allowed per user.")

def validate_file_size(file: UploadFile) -> bytes:
    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File size exceeds the limit of {MAX_FILE_SIZE // (1024 * 1024)} MB.")
    file.file.seek(0)  # Reset file pointer after reading
    return contents
