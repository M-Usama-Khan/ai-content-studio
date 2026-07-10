from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.services.auth_service import verify_token, get_user_by_email
from app.models.models import CalendarPost
from app.services.groq_ai import generate_content_ideas
import uuid
import traceback

router = APIRouter(prefix="/calendar", tags=["Calendar"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class CalendarPostCreate(BaseModel):
    topic: str
    platform: str
    post_date: str
    status: Optional[str] = "planned"

class GenerateCalendarRequest(BaseModel):
    niche: str
    platform: str
    language: str = "English"

@router.post("/generate")
def generate_calendar(
    request: GenerateCalendarRequest,
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
        print(f"Generating calendar for: {request.platform}, {request.niche}, {request.language}")
        
        ideas = generate_content_ideas(
            platform=request.platform,
            niche=request.niche,
            language=request.language,
            count=30
        )
        
        print(f"Ideas generated: {len(ideas)}")

        db.query(CalendarPost).filter(
            CalendarPost.user_id == user.id
        ).delete()

        posts = []
        today = datetime.now()

        for i, idea in enumerate(ideas):
            post_date = today + timedelta(days=i)
            db_post = CalendarPost(
                id=str(uuid.uuid4()),
                user_id=user.id,
                post_date=post_date,
                topic=idea['title'],
                platform=request.platform,
                status="planned"
            )
            db.add(db_post)
            posts.append({
                "id": db_post.id,
                "topic": idea['title'],
                "platform": request.platform,
                "post_date": post_date.strftime("%Y-%m-%d"),
                "day": i + 1,
                "status": "planned",
                "hook": idea.get('hook', ''),
                "viral_score": idea.get('viral_score', 0)
            })

        db.commit()
        print(f"Calendar saved: {len(posts)} posts")
        
        return {
            "success": True,
            "total": len(posts),
            "calendar": posts
        }

    except Exception as e:
        print(f"ERROR: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_calendar(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    posts = db.query(CalendarPost).filter(
        CalendarPost.user_id == user.id
    ).order_by(CalendarPost.post_date).all()

    return {
        "calendar": [
            {
                "id": p.id,
                "topic": p.topic,
                "platform": p.platform,
                "post_date": p.post_date.strftime("%Y-%m-%d"),
                "status": p.status,
                "day": i + 1
            }
            for i, p in enumerate(posts)
        ],
        "total": len(posts)
    }

@router.patch("/{post_id}")
def update_post_status(
    post_id: str,
    status: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    post = db.query(CalendarPost).filter(CalendarPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.status = status
    db.commit()
    return {"success": True, "status": status}