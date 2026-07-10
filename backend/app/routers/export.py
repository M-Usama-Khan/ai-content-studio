from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import verify_token, get_user_by_email
from app.models.models import Idea, Script
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
import io
import json

router = APIRouter(prefix="/export", tags=["Export"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.get("/ideas/pdf")
def export_ideas_pdf(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    ideas = db.query(Idea).filter(Idea.user_id == user.id).all()

    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        textColor=HexColor('#6366f1'),
        spaceAfter=10
    )
    story.append(Paragraph("AI Content Studio", title_style))
    story.append(Paragraph(f"Content Ideas Report — {user.name}", styles['Normal']))
    story.append(Spacer(1, 20))

    header_style = ParagraphStyle(
        'IdeaHeader',
        parent=styles['Heading2'],
        textColor=HexColor('#6366f1'),
        fontSize=14
    )

    for idea_record in ideas:
        # Section Header
        story.append(Paragraph(
            f"📱 {idea_record.platform} — {idea_record.niche} ({idea_record.language})",
            header_style
        ))
        story.append(Spacer(1, 8))

        ideas_list = idea_record.generated_ideas or []
        for i, idea in enumerate(ideas_list):
            story.append(Paragraph(
                f"<b>{i+1}. {idea.get('title', '')}</b>",
                styles['Normal']
            ))
            story.append(Paragraph(
                f"Type: {idea.get('content_type', '')} | Viral Score: {idea.get('viral_score', '')}/10",
                styles['Normal']
            ))
            story.append(Paragraph(
                f"Hook: {idea.get('hook', '')}",
                styles['Italic']
            ))
            story.append(Spacer(1, 8))

        story.append(Spacer(1, 16))

    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=content-ideas.pdf"}
    )


@router.get("/scripts/pdf")
def export_scripts_pdf(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    scripts = db.query(Script).filter(Script.user_id == user.id).all()

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        textColor=HexColor('#6366f1'),
    )
    story.append(Paragraph("AI Content Studio", title_style))
    story.append(Paragraph(f"Scripts Report — {user.name}", styles['Normal']))
    story.append(Spacer(1, 20))

    for script in scripts:
        story.append(Paragraph(
            f"<b>{script.idea_title}</b>",
            styles['Heading2']
        ))
        story.append(Paragraph(
            f"Platform: {script.platform}",
            styles['Normal']
        ))
        story.append(Spacer(1, 8))

        if script.caption:
            story.append(Paragraph(f"Caption: {script.caption}", styles['Italic']))

        story.append(Spacer(1, 16))

    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=scripts.pdf"}
    )