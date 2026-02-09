from sqlalchemy import Column, Integer, String
from src.services.database import Base
from pydantic import BaseModel
from typing import Optional

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    avatar_url = Column(String)
    
class UserCreate(BaseModel):
    username: str
    email: str
    avatar_url: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None