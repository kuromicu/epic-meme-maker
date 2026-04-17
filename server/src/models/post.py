from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import validates
from src.services.database import Base
from pydantic import BaseModel
from typing import Optional

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    meme_id = Column(Integer, ForeignKey("memes.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    like_count = Column(Integer, default=0)
    date_of_creation = Column(Integer)
    caption = Column(String, nullable=True)

    @validates("like_count")
    def clamp_negatives(self, key, value):
        return max(0, value)

class PostCreate(BaseModel):
    creator_id: int
    meme_id: int
    caption: Optional[str] = None
