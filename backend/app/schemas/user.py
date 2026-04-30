from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserResponse(BaseModel):
    id: str
    supabase_user_id: str
    email: EmailStr
    name: Optional[str] = None
    avatar: Optional[str] = None
    is_admin: bool = False
    created_at: datetime
    updated_at: datetime

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None

class AdminUserUpdateRequest(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    is_admin: Optional[bool] = None