from sqlalchemy import Column, Integer, String, Enum
from src.services.database import Base
from pydantic import BaseModel
from typing import Optional, Literal

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    avatar_resource_filename = Column(String)
    status = Column(Enum("regular", "moderator", name="user_status"), nullable=False, default="regular")
    subscribers_count = Column(Integer, default=0)
    subscriptions_count = Column(Integer, default=0)
    
class UserCreate(BaseModel):
    username: str
    email: str
    avatar_resource_filename: Optional[str] = None


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    avatar_resource_filename: Optional[str] = None
    status: Optional[Literal["regular", "moderator"]] 
    subscriptions_count: Optional[int] = None
    subscribers_count: Optional[int] = None
    
    
class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    
    
class UserLogin(BaseModel):
    username: str
    password: str