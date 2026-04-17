from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from models.ad_models import Platform


class AdMetrics(BaseModel):
    ad_id: str
    impressions: int = 0
    clicks: int = 0
    ctr: float = 0.0
    conversions: int = 0
    conversion_rate: float = 0.0
    spend: float = 0.0
    revenue: float = 0.0
    roas: float = 0.0
    platform: Platform
    recorded_at: datetime = Field(default_factory=datetime.utcnow)


class ComparisonResult(BaseModel):
    variant_a_id: str
    variant_b_id: str
    winner_id: str
    confidence_score: float
    improvement_pct: float
    recommendation: str


class AdAnalysis(BaseModel):
    ad_id: str
    performance_rating: str
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]


class WinnerResult(BaseModel):
    test_id: str
    winner_id: str
    loser_id: str
    confidence: float
    statistical_significance: bool
