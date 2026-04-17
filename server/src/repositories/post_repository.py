from typing import List

from fastapi import Depends
from sqlalchemy import insert, select, update, delete
from src.models.post import Post, PostCreate
from src.models.meme import Meme
from src.services.database import get_db


class PostRepository:
    async def create_post(self, post_create: PostCreate, database) -> int:
        stmt = insert(Post).values(**post_create.model_dump()).returning(Post.id)
        post_id = await database.scalar(stmt)
        await database.commit()
        return post_id

    async def get_post_by_id(self, post_id, database):
        stmt = select(Post).where(Post.id == post_id)
        return await database.scalar(stmt)

    async def get_posts_by_creator_id(self, creator_id, database):
        stmt = select(Post).where(Post.creator_id == creator_id)
        return await database.scalar(stmt)

    async def get_posts_by_meme_id(self, meme_id, database):
        stmt = select(Post).where(Post.meme_id == meme_id)
        return await database.scalar(stmt)

    async def delete_post_by_id(self, post_id, database):
        stmt = delete(Post).where(Post.id == post_id)
        await database.execute(stmt)
        await database.commit()

    async def delete_posts_by_creator_id(self, creator_id, database):
        stmt = delete(Post).where(Post.creator_id == creator_id)
        await database.execute(stmt)
        await database.commit()

    async def delete_posts_by_meme_id(self, meme_id, database):
        stmt = delete(Post).where(Post.meme_id == meme_id)
        await database.execute(stmt)
        await database.commit()

    async def get_posts(self, database) -> List[Post]:
        result = await database.execute(select(Post))
        return result.scalars().all()

    async def get_all_posts_with_memes(self, database):
        stmt = select(Post, Meme).join(Meme, Post.meme_id == Meme.id)
        result = await database.execute(stmt)
        rows = result.all()
        return [
            {
                "post_id": post.id,
                "meme_id": meme.id,
                "creator_id": post.creator_id,
                "like_count": post.like_count,
                "date_of_creation": post.date_of_creation,
                "caption": post.caption,
                "meme_url": f"http://localhost:8000/resources/{meme.image_resource_filename}",
                "meme_top_text": meme.top_text,
                "meme_bottom_text": meme.bottom_text,
            }
            for post, meme in rows
        ]
