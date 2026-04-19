import time
from typing import List
from sqlalchemy.orm import aliased
from sqlalchemy import insert, select, delete, func
from src.models.post import Post, PostCreate
from src.models.meme import Meme
from src.models.user import User
from src.models.user_like import UserLike


class PostRepository:
    async def create_post(self, post_create: PostCreate, database) -> int:
        stmt = insert(Post).values(
            **post_create.model_dump(),
            date_of_creation=int(time.time()),
        ).returning(Post.id)
        post_id = await database.scalar(stmt)
        await database.commit()
        return post_id

    async def _like_counts_for_posts(self, post_ids, database) -> dict:
        if not post_ids:
            return {}
        stmt = (
            select(UserLike.post_id, func.count(UserLike.user_id))
            .where(UserLike.post_id.in_(post_ids))
            .group_by(UserLike.post_id)
        )
        result = await database.execute(stmt)
        return {post_id: count for post_id, count in result.all()}

    async def _liked_post_ids(self, post_ids, user_id, database) -> set:
        if not post_ids or not user_id:
            return set()
        stmt = select(UserLike.post_id).where(
            UserLike.post_id.in_(post_ids),
            UserLike.user_id == user_id,
        )
        result = await database.execute(stmt)
        return {pid for (pid,) in result.all()}

    async def get_post_by_id(self, post_id, database, current_user_id=None):
        stmt = (
            select(Post, Meme, User)
            .join(Meme, Post.meme_id == Meme.id)
            .join(User, Post.creator_id == User.id)
            .where(Post.id == post_id)
        )
        row = (await database.execute(stmt)).first()
        if not row:
            return None
        post, meme, user = row
        counts = await self._like_counts_for_posts([post.id], database)
        liked = await self._liked_post_ids([post.id], current_user_id, database)
        return {
            "post_id": post.id,
            "meme_id": meme.id,
            "creator_id": post.creator_id,
            "creator_username": user.username,
            "creator_avatar_filename": user.avatar_resource_filename,
            "like_count": counts.get(post.id, 0),
            "has_liked": post.id in liked,
            "date_of_creation": post.date_of_creation,
            "caption": post.caption,
            "meme_url": f"http://localhost:8000/resources/{meme.image_resource_filename}",
            "meme_top_text": meme.top_text,
            "meme_bottom_text": meme.bottom_text,
        }

    async def get_posts_by_creator_id(self, creator_id, database, current_user_id=None):
        stmt = (
            select(Post, Meme)
            .join(Meme, Post.meme_id == Meme.id)
            .where(Post.creator_id == creator_id)
        )
        result = await database.execute(stmt)
        rows = result.all()
        post_ids = [post.id for post, _ in rows]
        counts = await self._like_counts_for_posts(post_ids, database)
        liked = await self._liked_post_ids(post_ids, current_user_id, database)
        return [
            {
                "post_id": post.id,
                "meme_id": meme.id,
                "creator_id": post.creator_id,
                "like_count": counts.get(post.id, 0),
                "has_liked": post.id in liked,
                "date_of_creation": post.date_of_creation,
                "caption": post.caption,
                "meme_url": f"http://localhost:8000/resources/{meme.image_resource_filename}",
            }
            for post, meme in rows
        ]

    async def get_posts_by_meme_id(self, meme_id, database):
        stmt = select(Post).where(Post.meme_id == meme_id)
        return await database.scalar(stmt)

    async def get_all_posts_with_memes(self, database, current_user_id=None):
        MemeCreator = aliased(User)
        stmt = (
            select(Post, Meme, User, MemeCreator)
            .join(Meme, Post.meme_id == Meme.id)
            .join(User, Post.creator_id == User.id)
            .join(MemeCreator, Meme.creator_id == MemeCreator.id)
        )
        result = await database.execute(stmt)
        rows = result.all()
        post_ids = [post.id for post, _, _, _ in rows]
        counts = await self._like_counts_for_posts(post_ids, database)
        liked = await self._liked_post_ids(post_ids, current_user_id, database)
        return [
            {
                "post_id": post.id,
                "meme_id": meme.id,
                "creator_id": post.creator_id,
                "creator_username": user.username,
                "creator_avatar_filename": user.avatar_resource_filename,
                "meme_creator_id": meme_creator.id,
                "meme_creator_username": meme_creator.username,
                "meme_creator_avatar_filename": meme_creator.avatar_resource_filename,
                "like_count": counts.get(post.id, 0),
                "has_liked": post.id in liked,
                "date_of_creation": post.date_of_creation,
                "caption": post.caption,
                "meme_url": f"http://localhost:8000/resources/{meme.image_resource_filename}",
                "meme_top_text": meme.top_text,
                "meme_bottom_text": meme.bottom_text,
            }
            for post, meme, user, meme_creator in rows
        ]

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

    async def toggle_like(self, user_id: int, post_id: int, database):
        existing = await database.scalar(
            select(UserLike).where(
                UserLike.user_id == user_id,
                UserLike.post_id == post_id,
            )
        )
        if existing:
            await database.execute(
                delete(UserLike).where(
                    UserLike.user_id == user_id,
                    UserLike.post_id == post_id,
                )
            )
            has_liked = False
        else:
            await database.execute(
                insert(UserLike).values(user_id=user_id, post_id=post_id)
            )
            has_liked = True
        await database.commit()
        count = await database.scalar(
            select(func.count(UserLike.user_id)).where(UserLike.post_id == post_id)
        )
        return {"has_liked": has_liked, "like_count": count or 0}