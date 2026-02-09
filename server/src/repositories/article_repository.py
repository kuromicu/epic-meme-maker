from fastapi import Depends
from sqlalchemy import insert, select, update, delete
from src.models.article import Article, ArticleCreate
from src.services.database import get_db


class ArticleRepository:
    async def create_article(self, article_create: ArticleCreate, database):
        stmt = insert(Article).values(**article_create.model_dump())
        await database.execute(stmt)
        await database.commit()
    
    async def get_article_by_id(self, article_id, database):
        stmt = select(Article).where(Article.id == article_id)
        return await database.scalar(stmt)
    
    async def get_articles_by_creator_id(self, creator_id, database):
        stmt = select(Article).where(Article.creator_id == creator_id)
        return await database.scalar(stmt)
    
    async def get_articles_by_meme_id(self, meme_id, database):
        stmt = select(Article).where(Article.meme_id == meme_id)
        return await database.scalar(stmt)
    
    async def delete_article_by_id(self, article_id, database):
        stmt = delete(Article).where(Article.id == article_id)
        await database.execute(stmt)
        await database.commit()
    
    async def delete_articles_by_creator_id(self, creator_id, database):
        stmt = delete(Article).where(Article.creator_id == creator_id)
        await database.execute(stmt)
        await database.commit()
    
    async def delete_articles_by_meme_id(self, meme_id, database):
        stmt = delete(Article).where(Article.meme_id == meme_id)
        await database.execute(stmt)
        await database.commit()
    
