from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import connect_db, close_db
from app.routes import users, products, admin, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS must be the FIRST middleware ──────────────────────────────
# Order matters: add_middleware() inserts at the TOP of the stack,
# so the last one added runs first. CORS must run before everything.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)


# ── Explicit OPTIONS handler — catches ALL paths ───────────────────
# Must be registered BEFORE routers so it takes priority.
# No auth dependency here — preflights never carry Authorization.
@app.options("/{rest_of_path:path}")
async def preflight(rest_of_path: str, request: Request):
    origin = request.headers.get("origin", "")
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "600",
        },
    )


# ── Routers — registered AFTER the OPTIONS handler ────────────────
app.include_router(users.router,    prefix="/api/users",    tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(admin.router,    prefix="/api/admin",    tags=["admin"])
app.include_router(upload.router,   prefix="/api/upload",   tags=["upload"])


@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/debug-cors")
async def debug_cors():
    return {
        "cors_origins": settings.CORS_ORIGINS,
        "type": str(type(settings.CORS_ORIGINS))
    }