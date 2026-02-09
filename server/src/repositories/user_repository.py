from fastapi import Depends
from sqlalchemy import insert, select, update, delete
from src.models.user import User, UserCreate, UserUpdate
from src.services.database import get_db


class UserRepository:
    
    async def create_user(self, user_create: UserCreate, database):
        stmt = insert(User).values(**user_create.model_dump())
        await database.execute(stmt)
        await database.commit()
    
    async def get_user_by_id(self, user_id, database):
        stmt = select(User).where(User.id == user_id)
        user = await database.scalar(stmt)
        return user
    
    async def update_user_by_id(self, user_id, user_update: UserUpdate, database):
        stmt = update(User).where(User.id == user_id).values(**user_update.model_dump(exclude_unset=True)).returning(User)
        user = await database.scalar(stmt)
        await database.commit()
        return user
    
    async def delete_user_by_id(self, user_id, database):
        stmt = delete(User).where(User.id == user_id)
        await database.execute(stmt)
        await database.commit()
    