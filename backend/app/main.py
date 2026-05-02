from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import connect_db, close_db
from app.routes import users, products, admin, upload

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(title=settings.APP_NAME, version="1.0.0", lifespan=lifespan)

# ── Handle CORS preflight FIRST before middleware ──
@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "https://trilliondollarclub.vercel.app",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Allow-Credentials": "true",
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])

@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}