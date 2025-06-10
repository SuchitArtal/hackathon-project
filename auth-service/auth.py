from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, validator
from sqlmodel import Session, select
from passlib.hash import argon2
from jose import jwt
from database import get_session
from models import User
import os
from datetime import datetime, timedelta
from mail_utils import send_welcome_email, send_password_reset_email
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your_jwt_secret")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

class Token(BaseModel):
    access_token: str
    token_type: str
    full_name: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str
    terms_accepted: bool

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('passwords do not match')
        return v

    @validator('terms_accepted')
    def terms_must_be_accepted(cls, v):
        if not v:
            raise ValueError('terms must be accepted')
        return v

class GoogleAuthRequest(BaseModel):
    id_token: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
    confirm_password: str

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('passwords do not match')
        return v

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return argon2.verify(plain_password, hashed_password)

def get_user(session: Session, email: str):
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def authenticate_user(session: Session, email: str, password: str):
    user = get_user(session, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, session: Session = Depends(get_session)):
    user = authenticate_user(session, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": user.full_name
    }

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = get_user(session, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = argon2.hash(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True,
        terms_accepted=user_data.terms_accepted
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Send welcome email
    try:
        send_welcome_email(user_data.email, user_data.full_name)
    except Exception as e:
        print(f"Failed to send welcome email: {e}")
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": new_user.full_name
    }

@router.post("/google", response_model=Token)
async def google_auth(google_data: GoogleAuthRequest, session: Session = Depends(get_session)):
    print("GOOGLE_CLIENT_ID:", os.getenv("GOOGLE_CLIENT_ID"))  # Debug print
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            google_data.id_token,
            google_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )
        email = idinfo["email"]
        full_name = idinfo.get("name", "Google User")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {e}")

    # Check if user exists, else create
    user = get_user(session, email)
    if not user:
        user = User(
            full_name=full_name,
            email=email,
            hashed_password="google_oauth",
            is_active=True,
            terms_accepted=True
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    # Issue JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": user.full_name
    }

@router.post("/forgot-password")
async def forgot_password(data: PasswordResetRequest, session: Session = Depends(get_session)):
    user = get_user(session, data.email)
    if not user:
        # For security, do not reveal if email is not registered
        return {"message": "If the email is registered, a reset link will be sent."}
    reset_token = create_access_token({"sub": user.email, "purpose": "reset"}, expires_delta=timedelta(hours=1))
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    send_password_reset_email(user.email, reset_link)
    return {"message": "If the email is registered, a reset link will be sent."}

@router.post("/reset-password")
async def reset_password(data: PasswordResetConfirm, session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(data.token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("purpose") != "reset":
            raise HTTPException(status_code=400, detail="Invalid token purpose.")
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")
    user = get_user(session, email)
    if not user:
        raise HTTPException(status_code=400, detail="User not found.")
    user.hashed_password = argon2.hash(data.new_password)
    session.add(user)
    session.commit()
    return {"message": "Password changed successfully."} 