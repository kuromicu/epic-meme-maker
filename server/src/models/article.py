import html
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import validates
from src.services.database import Base
from pydantic import BaseModel
from typing import Optional

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    text = Column(Text)
    article_id = Column(Integer, nullable=False, foreign_key=ForeignKey("memes.id"))
    creator_id = Column(Integer, nullable=False, foreign_key=ForeignKey("users.id"))
    like_count = Column(Integer, default=0) 
    date_of_creation = Column(Integer)
    
    @validates("like_count")
    def clamp_negatives(self, key, value):
        return max(0, value)

class ArticleCreate(BaseModel):
    creator_id: int                                                          
    meme_id: int
    title: str
    text: str | None = None
