from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.services.auth_service import verify_token, get_user_by_email, hash_password
from app.models.models import User, Idea, Script

router = APIRouter(prefix="/profile", tags=["Profile"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    preferred_language: Optional[str] = None

class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.get("/")
def get_profile(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Stats
    total_ideas = db.query(Idea).filter(Idea.user_id == user.id).count()
    total_scripts = db.query(Script).filter(Script.user_id == user.id).count()

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "preferred_language": user.preferred_language,
        "created_at": user.created_at,
        "stats": {
            "total_ideas": total_ideas,
            "total_scripts": total_scripts,
        }
    }

@router.patch("/update")
def update_profile(
    request: UpdateProfileRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.name:
        user.name = request.name
    if request.preferred_language:
        user.preferred_language = request.preferred_language

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Profile updated!",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "preferred_language": user.preferred_language,
        }
    }