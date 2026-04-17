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
        stmt = select(Meme).where(Meme.creator_id == creator_id)
        result = await database.execute(stmt)
        return result.scalars().all()
    
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
    
    async def get_all_memes(self, database):
        result = await database.execute(select(Meme).where(Meme.status == "published"))
        memes = result.scalars().all()

        return [
            {
                "meme_id": m.id,
                "url": f"http://localhost:8000/resources/{m.image_resource_filename}",
                "top_text": m.top_text,
                "bottom_text": m.bottom_text,
                "repost_count": m.repost_count,
            }
            for m in memes
        ]