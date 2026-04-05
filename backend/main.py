from fastapi import FastAPI
from app.db.session import Base, engine

from app.api import auth, audio

app = FastAPI(title="Audio Transcriber Platform")

# Create the database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Welcome to the Audio Transcriber Platform API!"}

# Include the authentication router
app.include_router(auth.router)
# Include the audio router
app.include_router(audio.router)
