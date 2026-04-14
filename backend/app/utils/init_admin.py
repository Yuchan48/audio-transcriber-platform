from sqlalchemy.exc import ProgrammingError
from app.models.models import User
from app.core.security import hash_password
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

def init_admin_if_not_exists(db: Session):

    try:
        existing_admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()

    except ProgrammingError as e:
        print(f"Tables not ready yet, skipping admin init: {str(e)}")
        return
    try:
        # Create the admin user
        admin_user = User(
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print(f"Admin user created with email: {ADMIN_EMAIL}")
    except Exception as e:
        db.rollback()
        print(f"Failed to create admin user: {str(e)}")
        return
