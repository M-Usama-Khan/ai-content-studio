from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

# Users Table
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    preferred_language = Column(String(20), default="English")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    ideas = relationship("Idea", back_populates="user", cascade="all, delete")
    scripts = relationship("Script", back_populates="user", cascade="all, delete")

# Ideas Table
class Idea(Base):
    __tablename__ = "ideas"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    niche = Column(String(100), nullable=False)
    language = Column(String(20), default="English")
    generated_ideas = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="ideas")

# Scripts Table
class Script(Base):
    __tablename__ = "scripts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    idea_title = Column(String(255), nullable=False)
    script_content = Column(Text, nullable=False)
    caption = Column(Text)
    hashtags = Column(JSON)
    platform = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="scripts")

# Calendar Table
class CalendarPost(Base):
    __tablename__ = "calendar_posts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    post_date = Column(DateTime, nullable=False)
    topic = Column(String(255), nullable=False)
    platform = Column(String(50), nullable=False)
    status = Column(String(20), default="planned")
    created_at = Column(DateTime(timezone=True), server_default=func.now())