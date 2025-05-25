from beanie import Document
from pydantic import BaseModel
from typing import Optional
from enum import Enum

class TableStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"
    CLEANING = "cleaning"

class Table(Document):
    number: int
    capacity: int
    status: TableStatus = TableStatus.AVAILABLE
    qr_code: Optional[str] = None
    current_order_id: Optional[str] = None

    class Settings:
        name = "tables"

class TableCreate(BaseModel):
    number: int
    capacity: int
    qr_code: Optional[str] = None

class TableResponse(BaseModel):
    id: str
    number: int
    capacity: int
    status: TableStatus
    qr_code: Optional[str]
    current_order_id: Optional[str] 