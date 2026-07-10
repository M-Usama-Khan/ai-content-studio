from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.services.auth_service import verify_token, get_user_by_email
from app.models.models import CalendarPost, ContentCalendar
from app.services.groq_ai import generate_content_ideas
import uuid
import traceback

router = APIRouter(prefix="/calendar", tags=["Calendar"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class GenerateCalendarRequest(BaseModel):
    niche: str
    platform: str
    language: str = "English"


# ── Generate new calendar ────────────────────────
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
        ideas = generate_content_ideas(
            platform=request.platform,
            niche=request.niche,
            language=request.language,
            count=30
        )

        # Create a new calendar group
        calendar_name = f"{request.niche} — {request.platform}"
        db_calendar = ContentCalendar(
            id=str(uuid.uuid4()),
            user_id=user.id,
            name=calendar_name,
            platform=request.platform,
            niche=request.niche,
            language=request.language,
        )
        db.add(db_calendar)

        posts = []
        today = datetime.now()

        for i, idea in enumerate(ideas):
            post_date = today + timedelta(days=i)
            db_post = CalendarPost(
                id=str(uuid.uuid4()),
                calendar_id=db_calendar.id,
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

        return {
            "success": True,
            "calendar_id": db_calendar.id,
            "name": calendar_name,
            "total": len(posts),
            "calendar": posts
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── List all calendars for user ───────────────────
@router.get("/list")
def list_calendars(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    calendars = db.query(ContentCalendar).filter(
        ContentCalendar.user_id == user.id
    ).order_by(ContentCalendar.created_at.desc()).all()

    result = []
    for cal in calendars:
        posts = db.query(CalendarPost).filter(
            CalendarPost.calendar_id == cal.id
        ).all()
        done_count = sum(1 for p in posts if p.status == "done")
        result.append({
            "id": cal.id,
            "name": cal.name,
            "platform": cal.platform,
            "niche": cal.niche,
            "language": cal.language,
            "total_posts": len(posts),
            "done_count": done_count,
            "created_at": cal.created_at.isoformat() if cal.created_at else None,
        })

    return {"calendars": result, "total": len(result)}


# ── Get posts for a specific calendar ─────────────
@router.get("/{calendar_id}")
def get_calendar(
    calendar_id: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    cal = db.query(ContentCalendar).filter(ContentCalendar.id == calendar_id).first()
    if not cal:
        raise HTTPException(status_code=404, detail="Calendar not found")

    posts = db.query(CalendarPost).filter(
        CalendarPost.calendar_id == calendar_id
    ).order_by(CalendarPost.post_date).all()

    return {
        "id": cal.id,
        "name": cal.name,
        "platform": cal.platform,
        "niche": cal.niche,
        "language": cal.language,
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


# ── Update post status ───────────────────────────
@router.patch("/post/{post_id}")
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


# ── Delete a calendar ─────────────────────────────
@router.delete("/{calendar_id}")
def delete_calendar(
    calendar_id: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    cal = db.query(ContentCalendar).filter(ContentCalendar.id == calendar_id).first()
    if not cal:
        raise HTTPException(status_code=404, detail="Calendar not found")

    db.delete(cal)
    db.commit()
    return {"success": True, "message": "Calendar deleted"}