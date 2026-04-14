from typing import List


from fastapi import Depends
from sqlalchemy import insert, select, update, delete
from src.models.meme import Meme, MemeCreate
from src.services.database import get_db


class MemeRepository:
    
    async def create_meme(self, meme_create: MemeCreate, database) -> int:
        stmt = insert(Meme).values(**meme_create.model_dump()).returning(Meme.id)
        meme_id = await database.scalar(stmt)
        await database.commit()
        return meme_id
    
    async def get_meme_by_id(self, meme_id, database):
        stmt = select(Meme).where(Meme.id == meme_id)
        meme = await database.scalar(stmt)
        return meme
    
    async def get_memes_by_creator_id(self, creator_id, database):
        stmt =  select(Meme).where(Meme.creator_id == creator_id)
        meme = await database.scalar(stmt)
        return meme
    
    async def delete_meme_by_id(self, meme_id, database):
        stmt = delete(Meme).where(Meme.id == meme_id)
        await database.execute(stmt)
        await database.commit()
    
    async def delete_meme_by_creator_id(self, creator_id, database):
        stmt = delete(Meme).where(Meme.creator_id == creator_id)
        await database.execute(stmt)
        await database.commit()
        
    async def get_memes(self, database) -> List[Meme]:
        result = await database.execute(select(Meme))
        return result.scalars().all()