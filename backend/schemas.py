from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    WAITER = "waiter"
    KITCHEN = "kitchen"
    CUSTOMER = "customer"

class Category(str, Enum):
    APPETIZER = "appetizer"
    MAIN_COURSE = "main_course"
    DESSERT = "dessert"
    BEVERAGE = "beverage"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class TableStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "email": "admin@restaurant.com",
                "full_name": "Admin User",
                "role": "admin",
                "is_active": True
            }
        }

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_waiter(self) -> bool:
        return self.role == UserRole.WAITER

    @property
    def is_kitchen_staff(self) -> bool:
        return self.role == UserRole.KITCHEN

class User(UserResponse):
    pass

class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    category: Category
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[Category] = None
    is_available: Optional[bool] = None

class MenuItem(MenuItemBase):
    id: int

    class Config:
        from_attributes = True

class TableBase(BaseModel):
    number: int
    capacity: int
    status: TableStatus = TableStatus.AVAILABLE

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    number: Optional[int] = None
    capacity: Optional[int] = None
    status: Optional[TableStatus] = None

class Table(TableBase):
    id: int
    qr_code: Optional[str] = None

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    table_id: int
    status: OrderStatus = OrderStatus.PENDING
    total_amount: float = 0

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    total_amount: Optional[float] = None

class Order(OrderBase):
    id: int
    items: List[OrderItem]

    class Config:
        from_attributes = True 