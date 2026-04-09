from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.db.session import get_db
from app.models.models import User, AudioFile
from app.core.jwt import decode_access_token

router = APIRouter(prefix="/admin", tags=["admin"])

# check if the user is an admin
def get_current_admin(request: Request, db: Session = Depends(get_db)):
  token = request.cookies.get("access_token")
  if not token:
    raise HTTPException(status_code=401, detail="Not authenticated")
  payload = decode_access_token(token)
  if not payload or payload.get("role") != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  user = db.query(User).filter(User.id == payload.get("sub")).first()
  if not user or user.role != "admin":
    raise HTTPException(status_code=404, detail="Not authorized")
  return user


# get all users (admin only)
@router.get("/users")
def get_all_users(request: Request, db: Session = Depends(get_db)):
    admin = get_current_admin(request, db)
    users = db.query(User).all()
    return [{"id": user.id, "email": user.email, "role": user.role} for user in users]

# get all audio files (admin only)
@router.get("/audio")
def get_all_audio(request: Request, db: Session = Depends(get_db)):
    admin = get_current_admin(request, db)
    audio_files = db.query(AudioFile).options(joinedload(AudioFile.user)).all()
    return [{"id": f.id, "filename": f.filename, "status": f.status, "user_id": f.user_id, "user_email": f.user.email if f.user else None} for f in audio_files]
