import json
from unittest.mock import MagicMock

import pytest

from models.ad_models import Platform
from models.analytics_models import AdMetrics

_MOCK_REC = "Variant B outperformed A with a 37.5% higher CTR. Scale B's budget and pause A."
_MOCK_ANALYSIS = json.dumps({
    "performance_rating": "good",
    "strengths": ["Strong CTR above benchmark", "High ROAS"],
    "weaknesses": ["Low absolute volume"],
    "suggestions": ["Increase daily budget by 20%", "Test a video creative"],
})


@pytest.fixture
def db(monkeypatch, tmp_path):
    import db.metrics_store as store
    monkeypatch.setattr(store, "DB_PATH", tmp_path / "test.db")
    store.init_db()
    return store


@pytest.fixture
def mock_client(monkeypatch):
    client = MagicMock()
    client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_REC)]
    )
    monkeypatch.setattr("agents.ab_tester.anthropic.Anthropic", lambda: client)
    return client


def _metrics(ad_id, clicks, impressions=2000, roas=3.0, platform=Platform.INSTAGRAM):
    return AdMetrics(
        ad_id=ad_id,
        impressions=impressions,
        clicks=clicks,
        ctr=clicks / impressions,
        conversions=max(1, clicks // 8),
        conversion_rate=0.125,
        spend=50.0,
        revenue=roas * 50.0,
        roas=roas,
        platform=platform,
    )


def test_record_and_retrieve(db):
    m = _metrics("ad_001", clicks=50)
    db.insert_metrics(m)
    result = db.get_latest_metrics("ad_001")
    assert result is not None
    assert result.clicks == 50
    assert result.ad_id == "ad_001"


def test_compare_variants_picks_winner(db, mock_client):
    from agents.ab_tester import ABTestingAgent

    db.insert_metrics(_metrics("ad_A", clicks=40))
    db.insert_metrics(_metrics("ad_B", clicks=80))

    agent = ABTestingAgent()
    result = agent.compare_variants("ad_A", "ad_B")

    assert result.winner_id == "ad_B"
    assert result.confidence_score >= 0
    assert result.improvement_pct > 0
    assert len(result.recommendation) > 0


def test_get_winner(db, mock_client):
    from agents.ab_tester import ABTestingAgent

    db.insert_metrics(_metrics("ad_X", clicks=30))
    db.insert_metrics(_metrics("ad_Y", clicks=90))

    agent = ABTestingAgent()
    winner = agent.get_winner("ad_X_vs_ad_Y")

    assert winner.winner_id == "ad_Y"
    assert winner.loser_id == "ad_X"
    assert isinstance(winner.statistical_significance, bool)


def test_analyze_ad(db, mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_ANALYSIS)]
    )
    from agents.ab_tester import ABTestingAgent

    db.insert_metrics(_metrics("ad_Z", clicks=60, roas=4.5))
    agent = ABTestingAgent()
    analysis = agent.analyze_ad("ad_Z")

    assert analysis.performance_rating == "good"
    assert len(analysis.strengths) > 0
    assert len(analysis.suggestions) > 0


def test_get_recommendations(db, mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_ANALYSIS)]
    )
    from agents.ab_tester import ABTestingAgent

    db.insert_metrics(_metrics("ad_W", clicks=45))
    agent = ABTestingAgent()
    recs = agent.get_recommendations("ad_W")

    assert isinstance(recs, list)
    assert len(recs) > 0
