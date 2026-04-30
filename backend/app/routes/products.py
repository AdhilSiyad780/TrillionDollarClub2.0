from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.core.security import get_current_supabase_id
from app.schemas.product import (
    ProductCreateRequest, ProductUpdateRequest,
    ProductResponse, PaginatedProductsResponse,
)
from app.services.product_service import (
    create_product, get_products, get_product_by_id,
    update_product, delete_product,
)
from app.services.user_service import require_admin

router = APIRouter()

@router.post("", response_model=ProductResponse, status_code=201)
async def create(body: ProductCreateRequest, supabase_id: str = Depends(get_current_supabase_id)):
    await require_admin(supabase_id)
    return await create_product(body, supabase_id)

@router.get("", response_model=PaginatedProductsResponse)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
):
    return await get_products(page, page_size, search, category)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_one(product_id: str):
    return await get_product_by_id(product_id)

@router.put("/{product_id}", response_model=ProductResponse)
async def update(product_id: str, body: ProductUpdateRequest, supabase_id: str = Depends(get_current_supabase_id)):
    await require_admin(supabase_id)
    return await update_product(product_id, body)

@router.delete("/{product_id}", status_code=204)
async def delete(product_id: str, supabase_id: str = Depends(get_current_supabase_id)):
    await require_admin(supabase_id)
    await delete_product(product_id)