from hashlib import sha256
from typing import List


from sqlalchemy import insert, select, update, delete
from src.models.user_credentials import UserCredentials, UserCredentialsCreate
from src.repositories.user_credentials_repository import UserCredentialsRepository
from src.models.user import User, UserCreate, UserRegister, UserUpdate
from src.services.database import engine
from sqlalchemy.ext.asyncio import AsyncSession


class UserRepository:
    
    async def create_user(self, user_create: UserCreate, database):
        stmt = insert(User).values(**user_create.model_dump()).returning(User)
        user = await database.scalar(stmt)
        await database.commit()
        return user
    
    async def get_user_by_id(self, user_id, database):
        stmt = select(User).where(User.id == user_id)
        user = await database.scalar(stmt)
        return user
    
    
    async def get_user_by_username(self, username, database):
        stmt = select(User).where(User.username == username)
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
        
    async def get_users(self, database) -> List[User]:
        result = await database.execute(select(User))
        return result.scalars().all()        
    
    async def register_user(self, user_register: UserRegister):
        async with AsyncSession(engine) as session:
            async with session.begin() as connection:
                user_create = UserCreate(username=user_register.username, email=user_register.email)
                
                stmt = insert(User).values(**user_create.model_dump()).returning(User)
                result = await session.execute(stmt)
                user = result.scalar_one()
                
                user_credentials_create = UserCredentialsCreate(password=user_register.password)
                
                password = user_credentials_create.password
                hash_object = sha256(password.encode())
                password_hash = hash_object.hexdigest()  # макс ферстаппен
                
                
                user_credentials_create.password = password_hash
                stmt = insert(UserCredentials).values({
                    "user_id": user.id,
                    "password_hash": password_hash
                })
                await session.execute(stmt)   
        