from fastapi import FastAPI
from app.routers import ws
from app.db.session import Base, engine

from app.api import auth, audio, admin

app = FastAPI(title="Audio Transcriber Platform")

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allow frontend origin
    allow_credentials=True,      # important for http-only cookie auth
    allow_methods=["*"],         # OPTIONS, GET, POST, etc.
    allow_headers=["*"],         # Content-Type, etc.
)

@app.get("/")
def root():
    return {"message": "Welcome to the Audio Transcriber Platform API!"}

# Include the authentication router
app.include_router(auth.router)
# Include the audio router
app.include_router(audio.router)
# Include the admin router
app.include_router(admin.router)
# Include the WebSocket router
app.include_router(ws.router)
