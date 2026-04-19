import uuid
import os
from fastapi import APIRouter, Depends, File, Form, UploadFile
from PIL import Image, ImageDraw, ImageFont
from src.repositories.meme_repository import MemeRepository
from src.repositories.post_repository import PostRepository
from src.services.database import get_db
from src.models.meme import MemeCreate, MemeGenerateResponse

router = APIRouter()
meme_repository = MemeRepository()
post_repository = PostRepository()

RESOURCES_DIR = "./resources"

FONT_PATHS: dict[str, list[str]] = {
    "Impact":     ["C:/Windows/Fonts/impact.ttf",  "/usr/share/fonts/truetype/msttcorefonts/Impact.ttf"],
    "Arial":      ["C:/Windows/Fonts/arial.ttf",   "/usr/share/fonts/truetype/msttcorefonts/Arial.ttf", "arial.ttf"],
    "Comic Sans": ["C:/Windows/Fonts/comic.ttf",   "/usr/share/fonts/truetype/msttcorefonts/Comic_Sans_MS.ttf"],
}

def _load_font(font_name: str, font_size: int) -> ImageFont.FreeTypeFont:
    paths = FONT_PATHS.get(font_name, []) + FONT_PATHS["Impact"] + FONT_PATHS["Arial"]
    for path in paths:
        try:
            return ImageFont.truetype(path, font_size)
        except OSError:
            continue
    return ImageFont.load_default(size=font_size)

def _draw_meme_text(
    img: Image.Image,
    top_text: str,
    bottom_text: str,
    font_name: str = "Impact",
    font_size: int = 48,
    text_color: str = "white",
) -> Image.Image:
    draw = ImageDraw.Draw(img)
    width, height = img.size
    font = _load_font(font_name, font_size)
    outline_color = "white" if text_color == "black" else "black"

    def draw_outlined_text(text: str, y: int):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        for dx in [-2, 0, 2]:
            for dy in [-2, 0, 2]:
                if dx != 0 or dy != 0:
                    draw.text((x + dx, y + dy), text, font=font, fill=outline_color)
        draw.text((x, y), text, font=font, fill=text_color)

    if top_text:
        draw_outlined_text(top_text.upper(), 10)
    if bottom_text:
        bbox = draw.textbbox((0, 0), bottom_text.upper(), font=font)
        text_height = bbox[3] - bbox[1]
        draw_outlined_text(bottom_text.upper(), height - text_height - 20)

    return img


@router.post("/memes/generate", response_model=MemeGenerateResponse)
async def generate_meme(
    image: UploadFile = File(...),
    top_text: str = Form(default=""),
    bottom_text: str = Form(default=""),
    creator_id: int = Form(...),
    font_name: str = Form(default="Impact"),
    font_size: int = Form(default=48),
    text_color: str = Form(default="white"),
    status: str = Form(default="published"),
    database=Depends(get_db),
):
    img = Image.open(image.file).convert("RGB")
    img = _draw_meme_text(img, top_text, bottom_text, font_name, font_size, text_color)

    filename = f"meme_{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(RESOURCES_DIR, filename)
    img.save(filepath, "JPEG", quality=90)

    safe_status = status if status in ("draft", "published") else "published"
    meme_create = MemeCreate(
        creator_id=creator_id,
        image_resource_filename=filename,
        top_text=top_text or None,
        bottom_text=bottom_text or None,
        status=safe_status,
        repost_count=0,
    )
    meme_id = await meme_repository.create_meme(meme_create, database=database)

    return MemeGenerateResponse(
        meme_id=meme_id,
        filename=filename,
        url=f"http://localhost:8000/resources/{filename}",
    )


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
    
    
@router.get("/memes")
async def get_memes(database=Depends(get_db)):
    return await meme_repository.get_all_memes(database)

@router.get("/published/memes")
async def get_published_memes(database=Depends(get_db)):
    return await meme_repository.get_all_published_memes(database)


@router.post("/memes/{meme_id}/repost")
async def increment_reposts_count(meme_id: int, database=Depends(get_db)):
    await meme_repository.increment_repost_count(meme_id=meme_id, database=database)