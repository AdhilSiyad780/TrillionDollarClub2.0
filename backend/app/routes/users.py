from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.core.security import get_current_user_payload, get_current_supabase_id
from app.schemas.user import UserResponse, UserUpdateRequest
from app.services.user_service import get_or_create_user, update_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_me(payload: Dict[str, Any] = Depends(get_current_user_payload)):
    return await get_or_create_user(payload.get("sub"), payload.get("email", ""))

@router.put("/me", response_model=UserResponse)
async def update_me(body: UserUpdateRequest, supabase_id: str = Depends(get_current_supabase_id)):
    return await update_user(supabase_id, body)