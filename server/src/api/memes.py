from fastapi import APIRouter, Depends
from src.repositories.meme_repository import MemeRepository
from src.repositories.post_repository import PostRepository
from src.services.database import get_db
from src.models.meme import MemeCreate 

router = APIRouter()
meme_repository = MemeRepository()
post_repository = PostRepository()

@router.post("/memes")
async def create_meme(meme_create: MemeCreate, database=Depends(get_db)):
    await meme_repository.create_meme(meme_create, database=database)

@router.get("/memes/{meme_id}")
async def get_meme_by_id(meme_id: int, database=Depends(get_db)):
    return await meme_repository.get_meme_by_id(meme_id, database=database)

@router.delete("/memes/{meme_id}")
async def delete_meme_by_id(meme_id: int, database=Depends(get_db)):
    await meme_repository.delete_meme_by_id(meme_id=meme_id, database=database)
    
@router.get("/memes/{meme_id}/posts")
async def get_posts_by_meme_id(meme_id: int, database=Depends(get_db)):
    await post_repository.get_posts_by_meme_id(meme_id=meme_id, database=database)
    
@router.delete("/memes/{meme_id}/posts")
async def delete_posts_by_meme_id(meme_id: int, database=Depends(get_db)):
    await post_repository.delete_post_by_meme_id(meme_id=meme_id, database=database)