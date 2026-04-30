from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserDB(BaseModel):
    supabase_user_id: str
    email: EmailStr
    name: Optional[str] = None
    avatar: Optional[str] = None
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)