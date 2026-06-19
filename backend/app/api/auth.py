from fastapi import APIRouter, Depends, HTTPException, Response

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.db.session import get_db
from app.models.models import User
from app.schemas.auth import UserRegister, UserLogin, GoogleLogin
from app.schemas.user import UserOut
from app.utils.reset_demo_user import reset_demo_user

from app.core.security import hash_password, verify_password

from app.services.user_service import get_user_by_email
from app.services.auth_service import login_user, authenticate_google_user

from app.core.config import COOKIE_SETTINGS

import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])


# User Registration
@router.post("/register", response_model=UserOut)
def register(user: UserRegister, response: Response, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(email=user.email, hashed_password=hash_password(user.password))
    try:
        # add new user to the database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to register user")

    # set cookie
    login_user(response, new_user)

    return new_user


# User Login
@router.post("/login", response_model=UserOut)
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    # get user from the database
    db_user = get_user_by_email(db, user.email)

    # verify password
    if not db_user or not verify_password(user.password, db_user.hashed_password):  # type: ignore
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # If the user is the demo user, reset their data on login
    if db_user.email == os.getenv("DEMO_EMAIL"):
        reset_demo_user(db, db_user.id)

    # set cookie
    login_user(response, db_user)

    return db_user


@router.post("/google", response_model=UserOut)
async def google_login(
    payload: GoogleLogin, response: Response, db: Session = Depends(get_db)
):
    credential = payload.credential
    try:
        user = authenticate_google_user(db, credential)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    # set cookie
    login_user(response, user)

    return user


# User Logout
@router.post("/logout")
def logout(response: Response):
    # Clear the access token cookie
    response.delete_cookie(
        key="access_token",
        **COOKIE_SETTINGS,
    )
    return {"message": "Logout successful"}
