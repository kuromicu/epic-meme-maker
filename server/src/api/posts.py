from fastapi import APIRouter, Depends, Header
from src.repositories.post_repository import PostRepository
from src.services.database import get_db
from src.services.auth import get_user_id_from_authorization
from src.models.post import PostCreate

router = APIRouter()
post_repository = PostRepository()

@router.get("/posts")
async def get_posts(authorization: str | None = Header(default=None), database=Depends(get_db)):
    current_user_id = await get_user_id_from_authorization(authorization)
    return await post_repository.get_all_posts_with_memes(database=database, current_user_id=current_user_id)

@router.post("/posts")
async def post_create(post_create: PostCreate, database=Depends(get_db)):
    post_id = await post_repository.create_post(post_create, database=database)
    return {"post_id": post_id}

@router.get("/posts/{post_id}")
async def get_post_by_id(post_id: int, authorization: str | None = Header(default=None), database=Depends(get_db)):
    current_user_id = await get_user_id_from_authorization(authorization)
    return await post_repository.get_post_by_id(post_id=post_id, database=database, current_user_id=current_user_id)

@router.delete("/posts/{post_id}")
async def delete_post_by_id(post_id: int, database=Depends(get_db)):
    await post_repository.delete_post_by_id(post_id=post_id, database=database)

@router.post("/posts/{post_id}/like")
async def toggle_like(post_id: int, authorization: str | None = Header(default=None), database=Depends(get_db)):
    current_user_id = await get_user_id_from_authorization(authorization)
    if not current_user_id:
        return {"error": "Unauthorized"}
    return await post_repository.toggle_like(user_id=current_user_id, post_id=post_id, database=database)