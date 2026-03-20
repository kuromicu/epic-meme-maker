from contextlib import asynccontextmanager
from src.services.database import engine, Base
from fastapi import FastAPI
from src.api.memes import router as memes_router 
from src.api.users import router as users_router
from src.api.posts import router as posts_router
from src.api.articles import router as article_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    await engine.dispose()

app = FastAPI(lifespan=lifespan)
app.include_router(memes_router)
app.include_router(users_router)
app.include_router(posts_router)
app.include_router(article_router)
app.mount("/resources", StaticFiles(directory="resources"), name="resources")


@app.get("/health/live")
async def health_check():
    return {"status": "healthy"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)




