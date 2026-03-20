from sqlalchemy import Column, Enum, ForeignKey, Integer, String
from src.services.database import Base
from pydantic import BaseModel
from typing import Literal, Optional
from sqlalchemy.orm import validates

class Meme(Base):
    __tablename__ = "memes" 
    id = Column(Integer, primary_key=True)
    image_resource_filename = Column(String, unique=True, nullable=False)
    top_text = Column(String, nullable=True)
    bottom_text = Column(String, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum("draft", "published", name="meme_status"), nullable=False)
    repost_count = Column(Integer)
    key_words = Column(String, nullable=True)
    
    @validates("repost_count")
    def clamp_negatives(self, key, value):
        return max(0, value)
    
class MemeCreate(BaseModel):
    creator_id: int
    image_resource_filename: str
    top_text: Optional[str] = None
    bottom_text: Optional[str] = None
    status: Literal["draft", "published"] = "draft"
    repost_count: int
    
    
class MemeUpdate(BaseModel):
    status: Optional[Literal["draft", "published"]]
    repost_count: int
