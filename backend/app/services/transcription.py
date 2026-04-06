from app.models.models import AudioFile, Transcription
from app.db.session import SessionLocal
from app.services.deepgram_service import transcribe_file


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
        text = transcribe_file(audio_file.file_path)

        # Save the transcription to the database
        transcription = Transcription(audio_file_id=audio_file.id, text=text)
        db.add(transcription)

        # update the status
        audio_file.status = "completed"
        db.commit()
    except Exception as e:
        print(f"❌ Transcription failed for id {audio_file_id}: {str(e)}")
        audio_file.status = "failed"
        audio_file.error_message = str(e)
        db.commit()
    finally:
        db.close()
