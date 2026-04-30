from fastapi import APIRouter, Depends, UploadFile, File
from typing import List
from app.core.security import get_current_supabase_id
from app.services.cloudinary_service import upload_image, upload_multiple_images

router = APIRouter()

@router.post("/image")
async def upload_single(file: UploadFile = File(...), _: str = Depends(get_current_supabase_id)):
    url = await upload_image(file)
    return {"url": url}

@router.post("/images")
async def upload_many(files: List[UploadFile] = File(...), _: str = Depends(get_current_supabase_id)):
    urls = await upload_multiple_images(files)
    return {"urls": urls}