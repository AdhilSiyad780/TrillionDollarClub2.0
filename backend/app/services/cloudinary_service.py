import cloudinary
import cloudinary.uploader
from typing import List
from fastapi import UploadFile, HTTPException
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB



async def upload_image(file: UploadFile, folder: str = "uploads") -> str:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 5MB limit")
    result = cloudinary.uploader.upload(
        contents, folder=folder, resource_type="image",
        transformation=[{"quality": "auto", "fetch_format": "auto"}],
    )
    return result["secure_url"]


async def upload_multiple_images(files: List[UploadFile], folder: str = "uploads") -> List[str]:
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images per upload")
    return [await upload_image(f, folder) for f in files]