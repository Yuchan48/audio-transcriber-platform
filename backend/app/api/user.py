from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
import os

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User
from app.schemas.user import UserOut

from app.core.jwt import decode_access_token

from dotenv import load_dotenv
load_dotenv()

router = APIRouter(prefix="/user", tags=["user"])

# Get current user from cookie
def get_current_user(request: Request, db: Session = Depends(get_db)):
  token = request.cookies.get("access_token")
  if not token:
    raise HTTPException(status_code=401, detail="Not authenticated")
  payload = decode_access_token(token)
  if not payload:
    raise HTTPException(status_code=401, detail="Invalid token")
  user = db.query(User).filter(User.id == payload.get("sub")).first()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return user


# GET current user details
@router.get("/me", response_model=UserOut)
def get_current_user_detail(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    return user

# Delete user - admin can delete any user, regular users can only delete their own account
@router.delete("/")
def delete_user_account(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)

    # If admin, can delete any user by providing user_id query parameter
    if user.role == "admin": # type: ignore
        target_user_id = request.query_params.get("user_id")
        if not target_user_id:
            raise HTTPException(status_code=400, detail="user_id query parameter is required for admin")
        target_user_id = int(target_user_id)
        # admin cannot delete themselves
        if target_user_id == user.id:
            raise HTTPException(status_code=400, detail="Admin cannot delete their own account")
    else:
        # demo user cannot delete their account
        if user.email == os.getenv("DEMO_EMAIL"): # type: ignore
            raise HTTPException(status_code=403, detail="Demo user account cannot be deleted")
        # Regular users can only delete their own account
        target_user_id = user.id

    db_user = db.query(User).filter(User.id == target_user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        db.delete(db_user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

    return {"message": "User deleted successfully"}


# Admin endpoint to get all users
@router.get("/all", response_model=list[UserOut])
def get_all_users(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    if user.role != "admin": # type: ignore
        raise HTTPException(status_code=403, detail="Admin access required")
    users = db.query(User).all()
    return users
