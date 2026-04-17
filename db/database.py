from __future__ import annotations

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

_DEFAULT_DB = f"sqlite:///{Path(__file__).parent.parent / 'data' / 'store.db'}"
DATABASE_URL = os.getenv("DATABASE_URL", _DEFAULT_DB)

_kwargs = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from db import models  # noqa: F401 — registers all models
    Base.metadata.create_all(bind=engine)
    _seed_products()


def _seed_products() -> None:
    """Insert sample products on first run."""
    db = SessionLocal()
    try:
        from db.models import Product
        if db.query(Product).count() > 0:
            return
        samples = [
            Product(
                name="Game Day Glitter Kit",
                description="Everything you need to sparkle on game day! Includes 6 colors of ultra-fine glitter, body glue, and team-color stencils. Perfect for football, basketball, and baseball season.",
                price=14.99,
                stock=50,
                category="kits",
                image_url="https://placehold.co/600x600/7B2FBE/FFD700?text=✨+Glitter+Kit",
            ),
            Product(
                name="Chunky Glitter Mix — Team Spirit Pack",
                description="Bold chunky glitter in classic team colors. Perfect for DIY signs, cups, tumblers, and accessories. Makes your game day gear stand out in the crowd!",
                price=8.99,
                stock=75,
                category="glitter",
                image_url="https://placehold.co/600x600/E60023/FFD700?text=✨+Chunky+Glitter",
            ),
            Product(
                name="Game Day Glitter Tumbler Kit",
                description="Make your own custom glitter tumbler in your team's colors! Kit includes ultra-fine and chunky glitter, Mod Podge, application brush, and step-by-step guide.",
                price=19.99,
                stock=30,
                category="kits",
                image_url="https://placehold.co/600x600/1877F2/FFD700?text=✨+Tumbler+Kit",
            ),
            Product(
                name="Game Day Face Glitter Set",
                description="Show your team spirit with our skin-safe face glitter set! Includes 4 colors, cosmetic-grade glitter, and application gel. Approved for face and body use.",
                price=11.99,
                stock=60,
                category="face",
                image_url="https://placehold.co/600x600/FF69B4/FFD700?text=✨+Face+Glitter",
            ),
            Product(
                name="Holographic Glitter Bundle",
                description="Turn heads with our show-stopping holographic glitter bundle! 5 colors that shift and sparkle in any light. Great for nail art, crafts, and game day looks.",
                price=16.99,
                stock=40,
                category="glitter",
                image_url="https://placehold.co/600x600/2ECC71/FFD700?text=✨+Holographic",
            ),
            Product(
                name="DIY Glitter Sign Kit",
                description="Cheer louder with a custom glitter sign! Kit includes foam board, 8 glitter colors, glue, brushes, and letter stencils. Make your sign in under an hour.",
                price=22.99,
                stock=25,
                category="kits",
                image_url="https://placehold.co/600x600/9B59B6/FFD700?text=✨+Sign+Kit",
            ),
        ]
        db.add_all(samples)
        db.commit()
    finally:
        db.close()
