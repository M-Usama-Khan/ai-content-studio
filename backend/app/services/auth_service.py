from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.models.models import User
from app.schemas.schemas import UserRegister
import bcrypt
import os
import uuid

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        os.getenv("SECRET_KEY", "fallback-secret"),
        algorithm=os.getenv("ALGORITHM", "HS256")
    )

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_data: UserRegister):
    hashed_pw = hash_password(user_data.password)
    db_user = User(
        id=str(uuid.uuid4()),
        name=user_data.name,
        email=user_data.email,
        password=hashed_pw,
        preferred_language=user_data.preferred_language or "English"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            os.getenv("SECRET_KEY", "fallback-secret"),
            algorithms=[os.getenv("ALGORITHM", "HS256")]
        )
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None