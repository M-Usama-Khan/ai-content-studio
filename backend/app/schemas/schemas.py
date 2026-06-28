from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ── Auth Schemas ──────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    preferred_language: Optional[str] = "English"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    preferred_language: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None