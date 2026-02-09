from sqlalchemy import Column, Enum, ForeignKey, Integer, String
from src.services.database import Base
from pydantic import BaseModel
from typing import Literal, Optional

class Meme(Base):
    __tablename__ = "memes" 
    id = Column(Integer, primary_key=True)
    image_url = Column(String, unique=True, nullable=False)
    top_text = Column(String, nullable=True)
    bottom_text = Column(String, nullable=True)
    creator_id = Column(Integer, nullable=False, foreign_key=ForeignKey("users.id"))
    status = Column(Enum("draft", "published", name="meme_status"), nullable=False)
    
class MemeCreate(BaseModel):
    creator_id: int
    image_url: str
    top_text: Optional[str] = None
    bottom_text: Optional[str] = None
    status: Literal["draft", "published"] = "draft"
