from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class Platform(str, Enum):
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    PINTEREST = "pinterest"
    TIKTOK = "tiktok"


class Tone(str, Enum):
    PLAYFUL = "playful"
    URGENT = "urgent"
    INSPIRATIONAL = "inspirational"
    SEASONAL = "seasonal"


class ProductInfo(BaseModel):
    name: str
    description: str
    price: float
    tags: list[str] = []
    etsy_url: str = "https://glittergameday.etsy.com"


class Ad(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    platform: Platform
    variant_label: str = "A"
    headline: str
    body: str
    hashtags: list[str] = []
    cta: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    product_info: ProductInfo
