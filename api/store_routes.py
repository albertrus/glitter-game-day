from __future__ import annotations

import json
import os
from pathlib import Path

import stripe
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Order, OrderItem, Product

BASE = Path(__file__).parent.parent
templates = Jinja2Templates(directory=str(BASE / "dashboard" / "templates"))
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
SITE_URL = os.getenv("SITE_URL", "http://localhost:8000")

router = APIRouter(tags=["store"])


# ── Pages ─────────────────────────────────────────────────────────────────────

@router.get("/store")
async def store_home(request: Request, db: Session = Depends(get_db)):
    featured = db.query(Product).filter(Product.is_active == True).limit(6).all()  # noqa: E712
    return templates.TemplateResponse(
        "store/home.html", {"request": request, "featured": featured}
    )


@router.get("/store/products")
async def store_products(request: Request, category: str = "", db: Session = Depends(get_db)):
    q = db.query(Product).filter(Product.is_active == True)  # noqa: E712
    if category:
        q = q.filter(Product.category == category)
    products = q.all()
    categories = [r[0] for r in db.query(Product.category).distinct().all()]
    return templates.TemplateResponse(
        "store/products.html",
        {"request": request, "products": products, "categories": categories, "active_cat": category},
    )


@router.get("/store/product/{product_id}")
async def store_product(request: Request, product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return templates.TemplateResponse("store/404.html", {"request": request}, status_code=404)
    related = (
        db.query(Product)
        .filter(Product.category == product.category, Product.id != product.id, Product.is_active == True)  # noqa: E712
        .limit(3)
        .all()
    )
    return templates.TemplateResponse(
        "store/product.html", {"request": request, "product": product, "related": related}
    )


@router.get("/store/cart")
async def store_cart(request: Request):
    return templates.TemplateResponse("store/cart.html", {"request": request})


@router.get("/store/checkout")
async def store_checkout(request: Request):
    return templates.TemplateResponse("store/checkout.html", {"request": request})


@router.get("/store/success")
async def store_success(request: Request, session_id: str = "", db: Session = Depends(get_db)):
    order = None
    if session_id:
        order = db.query(Order).filter(Order.stripe_session_id == session_id).first()
        if order and order.status == "pending":
            order.status = "paid"
            db.commit()
    return templates.TemplateResponse(
        "store/success.html", {"request": request, "order": order}
    )


# ── API ───────────────────────────────────────────────────────────────────────

@router.post("/api/store/checkout")
async def create_checkout(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    cart_items: list[dict] = body.get("items", [])
    customer = body.get("customer", {})

    if not cart_items:
        return JSONResponse(status_code=400, content={"error": "Cart is empty"})

    # Validate products and compute total
    line_items = []
    order_items_data = []
    total = 0.0

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item["id"]).first()
        if not product or not product.is_active:
            continue
        qty = max(1, int(item.get("qty", 1)))
        total += product.price * qty
        order_items_data.append((product, qty))
        if stripe.api_key:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(product.price * 100),
                    "product_data": {
                        "name": product.name,
                        "images": [product.image_url] if product.image_url else [],
                    },
                },
                "quantity": qty,
            })

    if not order_items_data:
        return JSONResponse(status_code=400, content={"error": "No valid products in cart"})

    # Create order in DB
    order = Order(
        customer_name=customer.get("name", "Guest"),
        customer_email=customer.get("email", ""),
        address_line1=customer.get("address", ""),
        address_city=customer.get("city", ""),
        address_state=customer.get("state", ""),
        address_zip=customer.get("zip", ""),
        total=round(total, 2),
        status="pending",
    )
    db.add(order)
    db.flush()  # get order.id before commit

    for product, qty in order_items_data:
        db.add(OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            quantity=qty,
            price_at_purchase=product.price,
        ))
        # Decrement stock
        product.stock = max(0, product.stock - qty)

    db.commit()

    # Stripe checkout session
    if stripe.api_key and line_items:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            customer_email=customer.get("email"),
            success_url=f"{SITE_URL}/store/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{SITE_URL}/store/cart",
            metadata={"order_id": order.id},
        )
        order.stripe_session_id = session.id
        db.commit()
        return {"url": session.url}

    # No Stripe key — demo mode: go straight to success
    return {"url": f"/store/success?session_id=demo_{order.id}"}


@router.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, secret) if secret else json.loads(payload)
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid payload"})

    if isinstance(event, dict) and event.get("type") == "checkout.session.completed":
        session_obj = event["data"]["object"]
        order = db.query(Order).filter(Order.stripe_session_id == session_obj["id"]).first()
        if order:
            order.status = "paid"
            db.commit()

    return {"status": "ok"}
