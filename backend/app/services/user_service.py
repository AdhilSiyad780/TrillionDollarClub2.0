from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from fastapi import HTTPException
from app.db.database import get_db
from app.schemas.user import UserResponse, UserUpdateRequest


def _serialize(doc: dict) -> UserResponse:
    doc["id"] = str(doc["_id"])
    return UserResponse(**doc)


async def get_or_create_user(supabase_user_id: str, email: str) -> UserResponse:
    db = get_db()
    user = await db.users.find_one({"supabase_user_id": supabase_user_id})
    if not user:
        now = datetime.utcnow()
        doc = {
            "supabase_user_id": supabase_user_id,
            "email": email,
            "name": None,
            "avatar": None,
            "is_admin": False,
            "created_at": now,
            "updated_at": now,
        }
        result = await db.users.insert_one(doc)
        doc["_id"] = result.inserted_id
        return _serialize(doc)
    return _serialize(user)


async def get_user_by_supabase_id(supabase_user_id: str) -> Optional[UserResponse]:
    db = get_db()
    user = await db.users.find_one({"supabase_user_id": supabase_user_id})
    return _serialize(user) if user else None


async def update_user(supabase_user_id: str, updates: UserUpdateRequest) -> UserResponse:
    db = get_db()
    data = {k: v for k, v in updates.model_dump().items() if v is not None}
    data["updated_at"] = datetime.utcnow()
    result = await db.users.find_one_and_update(
        {"supabase_user_id": supabase_user_id},
        {"$set": data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return _serialize(result)


async def get_all_users(skip: int = 0, limit: int = 20) -> List[UserResponse]:
    db = get_db()
    cursor = db.users.find().skip(skip).limit(limit).sort("created_at", -1)
    users = await cursor.to_list(length=limit)
    return [_serialize(u) for u in users]


async def admin_update_user(user_id: str, updates: dict) -> UserResponse:
    db = get_db()
    updates["updated_at"] = datetime.utcnow()
    result = await db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return _serialize(result)


async def delete_user(user_id: str) -> bool:
    db = get_db()
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return True


async def require_admin(supabase_user_id: str) -> UserResponse:
    user = await get_user_by_supabase_id(supabase_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user