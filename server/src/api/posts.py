from fastapi import APIRouter, Depends
from src.repositories.post_repository import PostRepository
from src.services.database import get_db
from src.models.post import PostCreate

router = APIRouter()
post_repository = PostRepository()

@router.post("/posts")
async def post_create(post_create: PostCreate, database=Depends(get_db)):
    await post_repository.create_post(post_create, database=database)
    
@router.get("/posts/{post_id}")
async def get_post_by_id(post_id: int, database=Depends(get_db)):
    await post_repository.get_post_by_id(post_id=post_id, database=database)
    
@router.delete("/posts/{post_id}")
async def delete_post_by_id(post_id: int, database=Depends(get_db)):
    await post_repository.delete_post_by_id(post_id=post_id, database=database)