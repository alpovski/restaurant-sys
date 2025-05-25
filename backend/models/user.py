from beanie import Document
from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    WAITER = "waiter"
    KITCHEN = "kitchen"
    CUSTOMER = "customer"

class User(Document):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    is_active: bool = True

    class Settings:
        name = "users"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool 