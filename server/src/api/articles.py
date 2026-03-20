from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from src.repositories.article_repository import ArticleRepository
from src.services.database import get_db
from src.models.article import ArticleCreate, ArticleUpdate, ArticleResponse
import shutil
from typing import List

router = APIRouter()
article_repository = ArticleRepository()

@router.post("/articles")
async def create_article(article_create: ArticleCreate, database=Depends(get_db)):
    return await article_repository.create_article(article_create, database=database)
    
@router.get("/articles/{article_id}", response_model=ArticleResponse)
async def get_article_by_id(article_id: int, database=Depends(get_db)):
    article = await article_repository.get_article_by_id(article_id=article_id, database=database)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
    
@router.get("/articles", response_model=List[ArticleResponse])
async def get_articles(database=Depends(get_db)):
        return await article_repository.get_articles(database)
    
@router.delete("/articles/{article_id}")
async def delete_article_by_id(article_id: int, database=Depends(get_db)):
    await article_repository.delete_article_by_id(article_id=article_id, database=database)
    
@router.put("/articles/{article_id}/upload-thumbnail-image")
async def upload_thumbnail_image(article_id: int, file: UploadFile = File(...), database=Depends(get_db)):
    file_extension = file.filename.split(".")[-1]
    filename = f"article_thumbnail_{article_id}.{file_extension}"
    filepath = f"./resources/{filename}" 
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    article_update = ArticleUpdate()
    article_update.thumbnail_resource_filename = filename
    await article_repository.update_article_by_id(article_id=article_id, article_update=article_update, database=database)
    return {"filename": filename}



