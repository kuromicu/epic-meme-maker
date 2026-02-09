from fastapi import Depends
from sqlalchemy import insert, select, update, delete
from src.models.post import Post, PostCreate
from src.services.database import get_db


class PostRepository:
    async def create_post(self, post_create: PostCreate, database):
        stmt = insert(Post).values(**post_create.model_dump())
        await database.execute(stmt)
        await database.commit()
    
    async def get_post_by_id(self, post_id, database):
        stmt = select(Post).where(Post.id == post_id)
        return await database.scalar(stmt)
    
    async def get_posts_by_creator_id(self, creator_id, database):
        stmt = select(Post).where(Post.creator_id == creator_id)
        return await database.scalar(stmt)
    
    async def get_posts_by_meme_id(self, meme_id, database):
        stmt = select(Post).where(Post.meme_id == meme_id)
        return await database.scalar(stmt)
    
    async def delete_post_by_id(self, post_id, database):
        stmt = delete(Post).where(Post.id == post_id)
        await database.execute(stmt)
        await database.commit()
    
    async def delete_posts_by_creator_id(self, creator_id, database):
        stmt = delete(Post).where(Post.creator_id == creator_id)
        await database.execute(stmt)
        await database.commit()
    
    async def delete_posts_by_meme_id(self, meme_id, database):
        stmt = delete(Post).where(Post.meme_id == meme_id)
        await database.execute(stmt)
        await database.commit()
    
