
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import validates
from src.services.database import Base
from pydantic import BaseModel
from typing import Optional

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    text = Column(Text, nullable=True)
    meme_id = Column(Integer, ForeignKey("memes.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    like_count = Column(Integer, default=0) 
    date_of_creation = Column(Integer)
    thumbnail_resource_filename = Column(String, nullable=True, default="default_article_thumbnail.png")
    banner_resource_filename = Column(String, nullable=True, default="default_article_banner.png")
    
    @validates("like_count")
    def clamp_negatives(self, key, value):
        return max(0, value)

class ArticleCreate(BaseModel):
    creator_id: int                                                          
    meme_id: int
    title: str
    text: str | None = None
    
    
class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    thumbnail_resource_filename: Optional[str] = None
    banner_resource_filename: Optional[str] = None
    like_count: Optional[int] = None


class ArticleResponse(BaseModel):
    id: int
    title: str
    text: Optional[str] = None
    banner_resource_filename: Optional[str] = None
    thumbnail_resource_filename: Optional[str] = None
    like_count: int = 0
    
    class Config:
        from_attributes = True

