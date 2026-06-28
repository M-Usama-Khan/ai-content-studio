from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.services.auth_service import verify_token, get_user_by_email
from app.services.groq_ai import generate_content_ideas
from app.models.models import Idea
import uuid

router = APIRouter(prefix="/ideas", tags=["Ideas"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class IdeaRequest(BaseModel):
    platform: str
    niche: str
    language: str = "English"
    count: int = 10

@router.post("/generate")
def generate_ideas(
    request: IdeaRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Verify user
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Generate ideas with AI
        ideas = generate_content_ideas(
            platform=request.platform,
            niche=request.niche,
            language=request.language,
            count=request.count
        )
        
        # Save to database
        db_idea = Idea(
            id=str(uuid.uuid4()),
            user_id=user.id,
            platform=request.platform,
            niche=request.niche,
            language=request.language,
            generated_ideas=ideas
        )
        db.add(db_idea)
        db.commit()
        
        return {
            "success": True,
            "platform": request.platform,
            "niche": request.niche,
            "language": request.language,
            "ideas": ideas,
            "total": len(ideas)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_ideas_history(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = get_user_by_email(db, email)
    ideas = db.query(Idea).filter(Idea.user_id == user.id).order_by(Idea.created_at.desc()).all()
    
    return {"ideas": ideas, "total": len(ideas)}