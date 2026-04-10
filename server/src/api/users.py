from hashlib import sha256

from fastapi import APIRouter, Depends, Header
from src.services.auth import create_access_token, decode_access_token
from src.models.user_credentials import UserCredentialsCreate
from src.repositories.user_credentials_repository import UserCredentialsRepository
from src.repositories.user_repository import UserRepository
from src.models.user import UserCreate, UserLogin, UserRegister, UserUpdate
from src.services.database import get_db
from src.repositories.meme_repository import MemeRepository
from src.repositories.post_repository import PostRepository


router = APIRouter()
user_repository = UserRepository()
meme_repository = MemeRepository()
post_repository = PostRepository()
user_credentials_repository = UserCredentialsRepository()

@router.post("/users/auth/login")
async def login_user(user_login: UserLogin, database=Depends(get_db)):
    user = await user_repository.get_user_by_username(username=user_login.username, database=database)
    if not user:
        return {"error": "Invalid username or password"}
    
    user_credentials = await user_credentials_repository.get_user_credentials_by_user_id(user_id=user.id, database=database)
    if not user_credentials:
        return {"error": "Invalid username or password"}
    
    password = user_login.password
    hash_object = sha256(password.encode())
    password_hash = hash_object.hexdigest()  # макс ферстаппен
    
    if password_hash != user_credentials.password_hash:
        return {"error": "Invalid username or password"}
    
    access_token = await create_access_token(data={"sub": str(user.id)})
    
    return {"message": "Login successful", "access_token": access_token}


@router.post("/users")
async def create_user(user_create: UserCreate, database=Depends(get_db)):
    await user_repository.create_user(user_create, database=database)

    
    
@router.get("/users/me")
async def get_current_user(authorization: str = Header(), database=Depends(get_db)):
    print(f'Authorization header: {authorization}')
    if not authorization.startswith("Bearer "):
        return {"error": "Invalid authorization header"}
    
    token = authorization[len("Bearer "):]
    decoded_token = await decode_access_token(token)
    print(f'Decoded token: {decoded_token}')
    if not decoded_token:
        return {"error": "Invalid token"}
    
    user_id = decoded_token.get("sub")
    user_id = int(user_id) if user_id else None
    
    print(f'User ID from token: {user_id}')
    if not user_id:
        return {"error": "Invalid token"}
    user = await user_repository.get_user_by_id(user_id=user_id, database=database)
    return user

@router.get("/users/{user_id}")
async def get_user_by_id(user_id: int, database=Depends(get_db)):
    return await user_repository.get_user_by_id(user_id, database=database)

@router.patch("/users/{user_id}")
async def update_user_by_id(user_id: int, user_update: UserUpdate, database=Depends(get_db)):
    return await user_repository.update_user_by_id(user_id=user_id, user_update=user_update, database=database)

@router.delete("/users/{user_id}")
async def delete_user_by_id(user_id: int, database=Depends(get_db)):
    await user_repository.delete_user_by_id(user_id=user_id, database=database)
    
@router.delete("/users/{user_id}/memes")
async def delete_meme_by_creator_id(user_id: int, database=Depends(get_db)):
    await meme_repository.delete_meme_by_creator_id(creator_id=user_id, database=database)
    
@router.get("/users/{user_id}/memes")
async def get_memes_by_creator_id(user_id: int, database=Depends(get_db)):
    return await meme_repository.get_memes_by_creator_id(creator_id=user_id, database=database)

@router.get("/users/{user_id}/posts")
async def get_posts_by_creator_id(user_id: int, database=Depends(get_db)):
    return await post_repository.get_posts_by_creator_id(creator_id=user_id, database=database)

@router.delete("/users/{user_id}/posts")
async def delete_posts_by_creator_id(user_id: int, database=Depends(get_db)):
    await post_repository.delete_posts_by_creator_id(creator_id=user_id, database=database)
    

@router.post("/users/register")
async def register_user(user_register: UserRegister):
    await user_repository.register_user(user_register=user_register)
    
    
    


@router.get("/users/username/{username}")
async def get_user_by_username(username: str, database=Depends(get_db)):
    return await user_repository.get_user_by_username(username=username, database=database)