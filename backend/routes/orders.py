from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Order as OrderModel, OrderItem as OrderItemModel
from schemas import Order, OrderCreate, OrderUpdate, OrderStatus
from auth import get_current_user

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

@router.get("", response_model=List[Order])
def get_orders(
    status: Optional[OrderStatus] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(OrderModel)
    if status:
        query = query.filter(OrderModel.status == status)
    return query.all()

@router.get("/active", response_model=List[Order])
def get_active_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(OrderModel).filter(
        OrderModel.status.in_([OrderStatus.PENDING, OrderStatus.PREPARING])
    ).all()

@router.get("/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("", response_model=Order)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_order = OrderModel(
        table_id=order.table_id,
        status=OrderStatus.PENDING,
        total_amount=0
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    total_amount = 0
    for item in order.items:
        order_item = OrderItemModel(
            order_id=db_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(order_item)
        total_amount += item.price * item.quantity
    
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    return db_order

@router.put("/{order_id}/status", response_model=Order)
def update_order_status(
    order_id: int,
    status: OrderStatus,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not current_user.is_admin and not current_user.is_kitchen_staff:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    db.refresh(order)
    return order 