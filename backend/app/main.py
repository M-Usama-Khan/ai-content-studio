from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.models import models
from app.routers import auth, ideas, scripts

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Content Studio",
    description="IBM Competition Project - AI Powered Content Creator",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(ideas.router)
app.include_router(scripts.router)

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