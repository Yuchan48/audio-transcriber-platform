from fastapi import APIRouter, Depends, HTTPException, status, Response, Request

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User
from app.schemas.auth import UserRegister, UserLogin, UserOut
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# User Registration
@router.post("/register", response_model=UserOut)
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(email=user.email, hashed_password=hash_password(user.password))
    try:
        # add new user to the database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to register user: {str(e)}")
    return new_user

# User Login
@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    # get user from the database
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password): # type: ignore
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT token and set it as a cookie
    access_token = create_access_token({"sub": str(db_user.id), "role": db_user.role})
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax")
    return {"message": "Login successful"}

# GET current user
@router.get("/me", response_model=UserOut)
def get_current_user(request: Request, db: Session = Depends(get_db)):
    # Get token from cookies
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Decode token and get user ID
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = int(payload.get("sub")) # type: ignore

    # Get user from the database
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# User Logout
@router.post("/logout")
def logout(response: Response):
    # Clear the access token cookie
    response.delete_cookie(key="access_token")
    return {"message": "Logout successful"}
