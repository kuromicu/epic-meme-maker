from sqlalchemy import Column, ForeignKey, Integer
from src.services.database import Base


class UserLike(Base):
    __tablename__ = "user_likes"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
