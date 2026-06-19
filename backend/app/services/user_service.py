from sqlalchemy.orm import Session
from app.models.models import User


def create_google_user(db: Session, email: str, provider_user_id: str) -> User:
    new_user = User(
        email=email,
        auth_provider="google",
        provider_user_id=provider_user_id,
        role="user",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()
