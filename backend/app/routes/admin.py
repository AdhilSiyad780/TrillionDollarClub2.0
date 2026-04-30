from fastapi import APIRouter, Depends, Query
from typing import List
from app.core.security import get_current_supabase_id
from app.schemas.user import UserResponse, AdminUserUpdateRequest
from app.services.user_service import require_admin, get_all_users, admin_update_user, delete_user

router = APIRouter()

async def admin_guard(supabase_id: str = Depends(get_current_supabase_id)):
    return await require_admin(supabase_id)

@router.get("/users", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 20, _=Depends(admin_guard)):
    return await get_all_users(skip, limit)

@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, body: AdminUserUpdateRequest, _=Depends(admin_guard)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    return await admin_update_user(user_id, updates)

@router.delete("/users/{user_id}", status_code=204)
async def delete_user_route(user_id: str, _=Depends(admin_guard)):
    await delete_user(user_id)