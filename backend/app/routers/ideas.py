from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import Optional
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
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        ideas = generate_content_ideas(
            platform=request.platform,
            niche=request.niche,
            language=request.language,
            count=request.count
        )

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
    db: Session = Depends(get_db),
    platform: Optional[str] = Query(None),
    niche: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    query = db.query(Idea).filter(Idea.user_id == user.id)

    # Filters
    if platform:
        query = query.filter(Idea.platform == platform)
    if niche:
        query = query.filter(Idea.niche == niche)
    if language:
        query = query.filter(Idea.language == language)

    ideas = query.order_by(Idea.created_at.desc()).all()

    # Search filter
    if search:
        search_lower = search.lower()
        ideas = [
            idea for idea in ideas
            if search_lower in idea.niche.lower()
            or search_lower in idea.platform.lower()
            or any(
                search_lower in i.get('title', '').lower()
                for i in (idea.generated_ideas or [])
            )
        ]

    return {"ideas": ideas, "total": len(ideas)}