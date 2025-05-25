from beanie import Document
from pydantic import BaseModel
from typing import Optional
from enum import Enum

class Category(str, Enum):
    APPETIZER = "appetizer"
    MAIN_COURSE = "main_course"
    DESSERT = "dessert"
    BEVERAGE = "beverage"

class MenuItem(Document):
    name: str
    description: str
    price: float
    category: Category
    image_url: Optional[str] = None
    is_available: bool = True
    preparation_time: int

    class Settings:
        name = "menu_items"

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: float
    category: Category
    image_url: Optional[str] = None
    preparation_time: int

class MenuItemResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: Category
    image_url: Optional[str]
    is_available: bool
    preparation_time: int 