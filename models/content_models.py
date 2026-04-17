from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, Field
import uuid

from models.ad_models import Platform


class SocialPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    platform: Platform
    caption: str
    hashtags: list[str] = []
    image_prompt: str = ""
    post_time: datetime
    product_id: str = ""
    theme: str


class ContentCalendar(BaseModel):
    week_start: date
    week_end: date
    posts: list[SocialPost]
    platforms_covered: list[Platform]


class WeeklyReport(BaseModel):
    week_start: date
    week_end: date
    total_impressions: int = 0
    total_clicks: int = 0
    total_revenue: float = 0.0
    top_performing_ad: str = ""
    worst_performing_ad: str = ""
    platform_breakdown: dict = {}
    recommendations: list[str] = []
    content_calendar_next_week: ContentCalendar | None = None
