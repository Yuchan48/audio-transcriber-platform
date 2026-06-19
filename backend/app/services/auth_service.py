from fastapi import Response
from sqlalchemy.orm import Session
from app.core.jwt import create_access_token
from app.models.models import User
from app.services.google_auth import verify_google_token
from app.services.user_service import create_google_user, get_user_by_email

from app.core.config import COOKIE_SETTINGS


def login_user(response: Response, user: User) -> None:
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    response.set_cookie(
        key="access_token",
        value=access_token,
        **COOKIE_SETTINGS,
    )


def authenticate_google_user(db: Session, credential: str) -> User:
    try:
        google_data = verify_google_token(credential)
    except ValueError:
        raise ValueError("Invalid Google token")

    email = google_data["email"]
    provider_user_id = google_data["sub"]

    user = get_user_by_email(db, email)

    if not user:
        user = create_google_user(db, email=email, provider_user_id=provider_user_id)

    if user.provider_user_id and user.provider_user_id != provider_user_id:
        raise ValueError("Google account mismatch")

    # If the user exists but doesn't have a provider_user_id (e.g., they registered with email/password), link their account to the Google sub
    if not user.provider_user_id:
        user.provider_user_id = provider_user_id
        db.commit()
        db.refresh(user)

    return user
