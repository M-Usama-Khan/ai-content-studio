from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.services.auth_service import verify_token, get_user_by_email
from app.services.groq_ai import generate_script, generate_hashtags
from app.models.models import Script
import uuid
import json

router = APIRouter(prefix="/scripts", tags=["Scripts"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class ScriptRequest(BaseModel):
    title: str
    platform: str
    language: str = "English"
    duration: int = 3

class HashtagRequest(BaseModel):
    niche: str
    platform: str
    topic: str
    language: str = "English"

# ── Generate Script ───────────────────────────
@router.post("/generate")
def generate_script_api(
    request: ScriptRequest,
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
        script = generate_script(
            title=request.title,
            platform=request.platform,
            language=request.language,
            duration=request.duration
        )

        # Convert to JSON string
        script_content_str = json.dumps(script.get("main_content", []))
        caption_str = script.get("caption", "")

        db_script = Script(
            id=str(uuid.uuid4()),
            user_id=user.id,
            idea_title=request.title,
            script_content=script_content_str,
            caption=caption_str,
            hashtags=[],
            platform=request.platform
        )
        db.add(db_script)
        db.commit()

        return {
            "success": True,
            "title": request.title,
            "platform": request.platform,
            "language": request.language,
            "script": script
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Generate Hashtags ─────────────────────────
@router.post("/hashtags")
def generate_hashtags_api(
    request: HashtagRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        hashtags = generate_hashtags(
            niche=request.niche,
            platform=request.platform,
            topic=request.topic,
            language=request.language
        )

        return {
            "success": True,
            "topic": request.topic,
            "platform": request.platform,
            "hashtags": hashtags
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Get Scripts History ───────────────────────
@router.get("/history")
def get_scripts_history(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    scripts = db.query(Script).filter(
        Script.user_id == user.id
    ).order_by(Script.created_at.desc()).all()

    return {"scripts": scripts, "total": len(scripts)}