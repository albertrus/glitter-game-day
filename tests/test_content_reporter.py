import json
from datetime import date
from unittest.mock import MagicMock

import pytest

from models.ad_models import Platform, ProductInfo
from models.analytics_models import AdMetrics

_MOCK_POST = json.dumps({
    "caption": "Game day ready! ✨ Grab your glitter kit and sparkle all season long! Shop now 👇",
    "hashtags": ["#gameday", "#glitter", "#sporty", "#DIY"],
    "image_prompt": "Sparkly game day flat lay with glitter in team colors",
})
_MOCK_RECS = json.dumps([
    "Boost Instagram posts on Saturday mornings for maximum game-day reach",
    "Test video content on TikTok showing glitter application",
    "Add seasonal hashtags to all Pinterest pins this week",
    "Run a flash sale post on Facebook Sunday evening",
    "Engage with game day hashtags in comments to grow organic reach",
])
_MOCK_HASHTAGS = json.dumps(["#glitter", "#gameday", "#sparkle", "#crafts", "#DIY"])


@pytest.fixture
def products():
    return [
        ProductInfo(
            name="Game Day Glitter Kit",
            description="Sparkle kit with 6 colors!",
            price=14.99,
            tags=["glitter", "game day"],
        ),
        ProductInfo(
            name="Chunky Glitter Mix",
            description="Bold team-color chunky glitter.",
            price=8.99,
            tags=["glitter", "crafts"],
        ),
    ]


@pytest.fixture
def mock_client(monkeypatch):
    client = MagicMock()
    client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_POST)]
    )
    monkeypatch.setattr("agents.content_reporter.anthropic.Anthropic", lambda: client)
    return client


def test_create_post(mock_client, products, tmp_path):
    from agents.content_reporter import ContentReporterAgent

    agent = ContentReporterAgent(output_dir=tmp_path)
    post = agent.create_post(Platform.INSTAGRAM, "Game Day", products[0])

    assert post.platform == Platform.INSTAGRAM
    assert post.theme == "Game Day"
    assert len(post.caption) > 0
    assert len(post.hashtags) > 0


def test_weekly_calendar_7_posts(mock_client, products, tmp_path):
    from agents.content_reporter import ContentReporterAgent

    agent = ContentReporterAgent(output_dir=tmp_path)
    calendar = agent.create_weekly_content_calendar(products, date(2026, 4, 20))

    assert len(calendar.posts) == 7
    assert calendar.week_start == date(2026, 4, 20)
    assert calendar.week_end == date(2026, 4, 26)
    assert len(calendar.platforms_covered) >= 3


def test_weekly_calendar_covers_all_platforms(mock_client, products, tmp_path):
    from agents.content_reporter import ContentReporterAgent

    agent = ContentReporterAgent(output_dir=tmp_path)
    calendar = agent.create_weekly_content_calendar(products, date(2026, 4, 20))

    platforms = {p.platform for p in calendar.posts}
    assert Platform.INSTAGRAM in platforms
    assert Platform.PINTEREST in platforms
    assert Platform.TIKTOK in platforms
    assert Platform.FACEBOOK in platforms


def test_generate_weekly_report(mock_client, products, tmp_path):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_RECS)]
    )
    from agents.content_reporter import ContentReporterAgent

    agent = ContentReporterAgent(output_dir=tmp_path)
    metrics = [
        AdMetrics(
            ad_id="ad_1",
            impressions=3000, clicks=120, ctr=0.04,
            conversions=15, conversion_rate=0.125,
            spend=75.0, revenue=225.0, roas=3.0,
            platform=Platform.INSTAGRAM,
        ),
        AdMetrics(
            ad_id="ad_2",
            impressions=1500, clicks=45, ctr=0.03,
            conversions=7, conversion_rate=0.155,
            spend=40.0, revenue=105.0, roas=2.63,
            platform=Platform.FACEBOOK,
        ),
    ]
    report = agent.generate_weekly_report(date(2026, 4, 20), [], metrics)

    assert report.total_impressions == 4500
    assert report.total_clicks == 165
    assert report.total_revenue == 330.0
    assert report.top_performing_ad == "ad_1"
    assert len(report.recommendations) == 5


def test_export_report_markdown(mock_client, products, tmp_path):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_RECS)]
    )
    from agents.content_reporter import ContentReporterAgent

    agent = ContentReporterAgent(output_dir=tmp_path)
    metrics = [
        AdMetrics(
            ad_id="ad_x",
            impressions=1000, clicks=40, ctr=0.04,
            conversions=5, conversion_rate=0.125,
            spend=30.0, revenue=90.0, roas=3.0,
            platform=Platform.INSTAGRAM,
        )
    ]
    report = agent.generate_weekly_report(date(2026, 4, 20), [], metrics)
    out = str(tmp_path / "week_report.md")
    agent.export_report_markdown(report, out)

    content = (tmp_path / "week_report.md").read_text()
    assert "GlitterGameDay" in content
    assert "April 20" in content
    assert "1,000" in content
