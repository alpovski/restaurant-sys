from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Table as TableModel
from schemas import Table, TableCreate, TableUpdate, TableStatus
from auth import get_current_user
import qrcode
from io import BytesIO
import base64

router = APIRouter(
    prefix="/tables",
    tags=["tables"]
)

def generate_qr_code(table_id: str) -> str:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(f"http://localhost:3000/menu/{table_id}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

@router.get("", response_model=List[Table])
def get_tables(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(TableModel).all()

@router.get("/{table_id}", response_model=Table)
def get_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    table = db.query(TableModel).filter(TableModel.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table

@router.post("", response_model=Table)
def create_table(
    table: TableCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_table = TableModel(**table.dict())
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

@router.put("/{table_id}", response_model=Table)
def update_table(
    table_id: int,
    table: TableUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_table = db.query(TableModel).filter(TableModel.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    for key, value in table.dict(exclude_unset=True).items():
        setattr(db_table, key, value)
    
    db.commit()
    db.refresh(db_table)
    return db_table

@router.delete("/{table_id}")
def delete_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_table = db.query(TableModel).filter(TableModel.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    db.delete(db_table)
    db.commit()
    return {"message": "Table deleted"}

@router.put("/{table_id}/status", response_model=Table)
def update_table_status(
    table_id: int,
    status: TableStatus,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not current_user.is_admin and not current_user.is_waiter:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_table = db.query(TableModel).filter(TableModel.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    db_table.status = status
    db.commit()
    db.refresh(db_table)
    return db_table 