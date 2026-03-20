from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import validates
from src.services.database import Base
from pydantic import BaseModel
from typing import Optional
from pydantic import Field

class UserCredentials(Base):
    __tablename__ = "user_credentials"
    
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    password_hash = Column(String, nullable=False)
    
    
class UserCredentialsCreate(BaseModel):
    password: str = Field(..., min_length=8, max_length=38, pattern=r"^[a-zА-Яа-яA-Z0-9_-]+$")