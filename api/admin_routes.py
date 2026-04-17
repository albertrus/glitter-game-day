from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Order, OrderItem, Product

BASE = Path(__file__).parent.parent
templates = Jinja2Templates(directory=str(BASE / "dashboard" / "templates"))

router = APIRouter(tags=["admin"])


# ── Inventory ─────────────────────────────────────────────────────────────────

@router.get("/inventory")
async def admin_inventory(request: Request, db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    low_stock = [p for p in products if p.stock <= 10]
    return templates.TemplateResponse(
        "inventory.html",
        {"request": request, "products": products, "low_stock_count": len(low_stock)},
    )


@router.post("/api/inventory/product")
async def upsert_product(
    db: Session = Depends(get_db),
    product_id: str = Form(""),
    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    stock: int = Form(0),
    category: str = Form("general"),
    image_url: str = Form(""),
    etsy_url: str = Form(""),
    is_active: str = Form("on"),
):
    active = is_active == "on"
    if product_id:
        p = db.query(Product).filter(Product.id == product_id).first()
        if p:
            p.name, p.description, p.price = name, description, price
            p.stock, p.category, p.image_url = stock, category, image_url
            p.etsy_url, p.is_active = etsy_url, active
    else:
        p = Product(
            name=name, description=description, price=price,
            stock=stock, category=category, image_url=image_url,
            etsy_url=etsy_url, is_active=active,
        )
        db.add(p)
    db.commit()
    return RedirectResponse("/inventory", status_code=303)


@router.post("/api/inventory/product/{product_id}/delete")
async def delete_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if p:
        p.is_active = False  # soft delete
        db.commit()
    return RedirectResponse("/inventory", status_code=303)


@router.post("/api/inventory/product/{product_id}/stock")
async def adjust_stock(product_id: str, adjustment: int = Form(...), db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if p:
        p.stock = max(0, p.stock + adjustment)
        db.commit()
    return JSONResponse({"stock": p.stock if p else 0})


# ── Orders ────────────────────────────────────────────────────────────────────

@router.get("/orders")
async def admin_orders(request: Request, status_filter: str = "", db: Session = Depends(get_db)):
    q = db.query(Order).order_by(Order.created_at.desc())
    if status_filter:
        q = q.filter(Order.status == status_filter)
    orders = q.all()
    totals = {
        "pending": db.query(Order).filter(Order.status == "pending").count(),
        "paid": db.query(Order).filter(Order.status == "paid").count(),
        "shipped": db.query(Order).filter(Order.status == "shipped").count(),
        "revenue": sum(o.total for o in db.query(Order).filter(Order.status.in_(["paid", "shipped", "delivered"])).all()),
    }
    return templates.TemplateResponse(
        "orders.html",
        {"request": request, "orders": orders, "totals": totals, "status_filter": status_filter},
    )


@router.get("/orders/{order_id}")
async def admin_order_detail(request: Request, order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return JSONResponse(status_code=404, content={"error": "Order not found"})
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    return templates.TemplateResponse(
        "order_detail.html", {"request": request, "order": order, "items": items}
    )


@router.post("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str = Form(...), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    valid = {"pending", "paid", "shipped", "delivered", "cancelled"}
    if order and status in valid:
        order.status = status
        db.commit()
        return {"status": order.status}
    return JSONResponse(status_code=400, content={"error": "Invalid status"})
