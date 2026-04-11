import anyio

from app.models.models import AudioFile, Transcription
from app.db.session import SessionLocal
from app.services.deepgram_service import transcribe_file
from app.routers.ws import active_connections
from sqlalchemy.orm import Session

def send_ws_update(user_id: int, data: dict):
    ws = active_connections.get(user_id)

    if not ws:
        print(f"No active WS connection for user {user_id}")
        return

    try:
        anyio.from_thread.run(ws.send_json, data)
    except Exception as e:
        print(f"Failed to send WS update to user {user_id}: {str(e)}")


# Background task to process the audio file and update the transcription
def transcribe_audio(audio_file_id: int):
    db = SessionLocal()
    # Fetch the audio file record from the database
    audio_file = db.query(AudioFile).filter(AudioFile.id == audio_file_id).first()
    if not audio_file:
        db.close()
        return

    user_id = audio_file.user_id

    try:
        # set status to processing
        audio_file.status = "processing"
        db.commit()

        send_ws_update(user_id, { "audio_id": audio_file_id, "status": "processing" })

        # Call deepgram API to get the transcription
        text = transcribe_file(audio_file.file_path)

        # Save the transcription to the database
        transcription = Transcription(audio_file_id=audio_file.id, text=text)
        db.add(transcription)

        # update the status
        audio_file.status = "completed"
        db.commit()

        send_ws_update(user_id, { "audio_id": audio_file_id, "status": "completed", "transcript": text})
    except Exception as e:
        db.rollback()
        print(f"Transcription failed for id {audio_file_id}: {str(e)}")

        # update status to failed
        audio_file.status = "failed"
        db.commit()
        send_ws_update(user_id, { "audio_id": audio_file_id, "status": "failed", "error": str(e) })

    finally:
        db.close()
