from sqlalchemy import insert, select, update, delete
from src.models.user_credentials import UserCredentials, UserCredentialsCreate
from src.services.database import get_db
from hashlib import sha256


class UserCredentialsRepository:
    
    
    async def create_user_credentials(self, user_id, user_credentials_create: UserCredentialsCreate, database):
        password = user_credentials_create.password
        hash_object = sha256(password.encode())
        password_hash = hash_object.hexdigest()  # макс ферстаппен
        
        
        user_credentials_create.password = password_hash
        stmt = insert(UserCredentials).values({
            "user_id": user_id,
            "password_hash": password_hash
        })
        await database.execute(stmt)
        await database.commit()
        