from fastapi import APIRouter, Depends
from src.repositories.user_repository import UserRepository
from src.models.user import UserCreate, UserUpdate
from src.services.database import get_db
from src.repositories.meme_repository import MemeRepository
from src.repositories.post_repository import PostRepository


router = APIRouter()
user_repository = UserRepository()
meme_repository = MemeRepository()
post_repository = PostRepository()

@router.post("/users")
async def create_user(user_create: UserCreate, database=Depends(get_db)):
    await user_repository.create_user(user_create, database=database)

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

