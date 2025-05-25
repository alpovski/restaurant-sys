from beanie import Document
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import datetime

class OrderStatus(str, Enum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItem(BaseModel):
    menu_item_id: str
    quantity: int
    notes: Optional[str] = None

class Order(Document):
    table_id: str
    items: List[OrderItem]
    status: OrderStatus = OrderStatus.PENDING
    total_amount: float
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    waiter_id: Optional[str] = None
    customer_id: Optional[str] = None

    class Settings:
        name = "orders"

class OrderCreate(BaseModel):
    table_id: str
    items: List[OrderItem]
    waiter_id: Optional[str] = None
    customer_id: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    table_id: str
    items: List[OrderItem]
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    waiter_id: Optional[str]
    customer_id: Optional[str] 