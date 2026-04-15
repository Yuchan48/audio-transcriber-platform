import os
import asyncio
from fastapi import FastAPI

from app.routers import ws
from app.db.session import Base, engine, SessionLocal
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from app.utils.init_admin import init_admin_if_not_exists

from app.api import auth, audio, user

load_dotenv()  # Load environment variables from .env file

app = FastAPI(title="Audio Transcriber Platform")
app.router.redirect_slashes = False

from fastapi.middleware.cors import CORSMiddleware

origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    init_admin_if_not_exists(db)
    db.close()
    yield

app = FastAPI(title="Audio Transcriber Platform", lifespan=lifespan)

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
# Include the user router
app.include_router(user.router)
# Include the WebSocket router
app.include_router(ws.router)

