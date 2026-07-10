from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.models import models
from app.routers import auth, ideas, scripts, calendar, export, profile
from fastapi.responses import JSONResponse
from fastapi import Request

load_dotenv()

Base.metadata.create_all(bind=engine)

# Auto-migration: add calendar_id column if missing
from sqlalchemy import text, inspect
with engine.connect() as conn:
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('calendar_posts')]
    if 'calendar_id' not in columns:
        conn.execute(text('ALTER TABLE calendar_posts ADD COLUMN calendar_id VARCHAR REFERENCES content_calendars(id)'))
        conn.commit()

app = FastAPI(
    title="AI Content Studio",
    description="IBM Competition Project - AI Powered Content Creator",
    version="1.0.0"
)

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Route not found"}
    )

@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ideas.router)
app.include_router(scripts.router)
app.include_router(calendar.router)
app.include_router(export.router)
app.include_router(profile.router)

@app.get("/")
def root():
    return {
        "message": "AI Content Studio API is running! 🚀",
        "project": "IBM Competition 2025",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}