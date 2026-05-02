from datetime import datetime
from typing import Optional
from bson import ObjectId
from fastapi import HTTPException
import math
from app.db.database import get_db
from app.schemas.product import (
    ProductCreateRequest, ProductUpdateRequest,
    ProductResponse, PaginatedProductsResponse,
)


def _serialize(doc: dict) -> ProductResponse:
    doc["id"] = str(doc["_id"])
    return ProductResponse(**doc)


async def create_product(data: ProductCreateRequest, created_by: str) -> ProductResponse:
    db = get_db()
    now = datetime.utcnow()
    doc = {**data.model_dump(), "created_by": created_by, "is_active": True,
           "created_at": now, "updated_at": now}
    result = await db.products.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize(doc)


async def get_products(page=1, page_size=10, search=None, category=None) -> PaginatedProductsResponse:
    db = get_db()
    query = {}
    if search:
        query["$text"] = {"$search": search}
    if category:
        query["category"] = category
    total = await db.products.count_documents(query)
    skip = (page - 1) * page_size
    cursor = db.products.find(query).skip(skip).limit(page_size).sort("created_at", -1)
    docs = await cursor.to_list(length=page_size)
    return PaginatedProductsResponse(
        items=[_serialize(d) for d in docs],
        total=total, page=page, page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 0,
    )


async def get_product_by_id(product_id: str) -> ProductResponse:
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    doc = await db.products.find_one({"_id": ObjectId(product_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return _serialize(doc)


async def update_product(product_id: str, data: ProductUpdateRequest) -> ProductResponse:
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    update_data["updated_at"] = datetime.utcnow()
    result = await db.products.find_one_and_update(
        {"_id": ObjectId(product_id)}, {"$set": update_data}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return _serialize(result)


async def delete_product(product_id: str) -> bool:
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return True