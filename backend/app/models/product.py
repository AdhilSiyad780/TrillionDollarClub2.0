from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductDB(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    images: List[str] = []
    stock: int = 0
    is_active: bool = True
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    