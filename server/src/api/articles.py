from fastapi import APIRouter, Depends
from src.repositories.article_repository import ArticleRepository
from src.services.database import get_db
from src.models.article import ArticleCreate

router = APIRouter()
article_repository = ArticleRepository()

@router.post("/articles")
async def article_create(article_create: ArticleCreate, database=Depends(get_db)):
    await article_repository.create_article(article_create, database=database)
    
@router.get("/articles/{article_id}")
async def get_article_by_id(article_id: int, database=Depends(get_db)):
    await article_repository.get_article_by_id(article_id=article_id, database=database)
    
@router.delete("/article/{article_id}")
async def delete_article_by_id(article_id: int, database=Depends(get_db)):
    await article_repository.delete_article_by_id(article_id=article_id, database=database)