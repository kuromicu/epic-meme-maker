from typing import List

from fastapi import Depends
from sqlalchemy import insert, select, update, delete
from src.models.article import Article, ArticleCreate, ArticleUpdate
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
    
    async def update_article_by_id(self, article_id, article_update: ArticleUpdate, database):
        stmt = update(Article).where(Article.id == article_id).values(**article_update.model_dump(exclude_unset=True)).returning(Article)
        article = await database.scalar(stmt)
        await database.commit()
        return article
    

    async def get_articles(self, database) -> List[Article]:
        result = await database.execute(select(Article))
        return result.scalars().all()