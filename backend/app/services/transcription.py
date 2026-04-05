from fastapi import BackgroundTasks
import time

from app.models.models import AudioFile, Transcription
from app.db.session import SessionLocal

# Simulate sending the audio file to Deepgram and getting a transcription
def send_to_deepgram(file_path: str) -> str:
    # Simulate sending the file to Deepgram and getting a transcription
    time.sleep(5)  # Simulate processing time
    return "This is a simulated transcription of the audio file."


# Background task to process the audio file and update the transcription
def transcribe_audio(audio_file_id: int):
    db = SessionLocal()
    try:
        audio_file = db.query(AudioFile).filter(AudioFile.id == audio_file_id).first()
        if not audio_file:
            return
        audio_file.status = "processing"
        db.commit()

        # Call deepgram API to get the transcription
        text = send_to_deepgram(audio_file.file_path)

        # Save the transcription to the database
        transcription = Transcription(audio_file_id=audio_file.id, text=text)
        db.add(transcription)

        # update the status
        audio_file.status = "completed"
        db.commit()
    except Exception as e:
        audio_file.status = "failed"
        audio_file.error_message = str(e)
        db.commit()
    finally:
        db.close()
