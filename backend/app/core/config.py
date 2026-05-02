from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "FullStack API"
    SUPABASE_URL: str
    SUPABASE_PROJECT_REF: str
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "fullstack_db"
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    CORS_ORIGINS: List[str] = [
     "http://localhost:5173",
     "http://localhost:3000",
     "https://trilliondollarclub.vercel.app"  # ← add this
]

    class Config:
        env_file = ".env"

settings = Settings()