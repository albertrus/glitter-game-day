import json
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from models.ad_models import Platform, ProductInfo, Tone

_MOCK_AD = json.dumps({
    "headline": "Sparkle On Game Day! ✨",
    "body": "Get your glitter on with our Game Day Kit — 6 colors, body glue, and stencils!",
    "hashtags": ["#gameday", "#glitter", "#sporty"],
    "cta": "Shop now at glittergameday.etsy.com",
})


@pytest.fixture
def mock_client(monkeypatch):
    client = MagicMock()
    client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=_MOCK_AD)]
    )
    monkeypatch.setattr("agents.ad_creator.anthropic.Anthropic", lambda: client)
    return client


@pytest.fixture
def product():
    return ProductInfo(
        name="Game Day Glitter Kit",
        description="Sparkle on game day with 6 glitter colors.",
        price=14.99,
        tags=["glitter", "game day", "football"],
    )


def test_generate_ad(mock_client, product, tmp_path):
    from agents.ad_creator import AdCreatorAgent

    agent = AdCreatorAgent(output_dir=tmp_path)
    ad = agent.generate_ad(product, Platform.INSTAGRAM, Tone.PLAYFUL)

    assert ad.platform == Platform.INSTAGRAM
    assert ad.headline == "Sparkle On Game Day! ✨"
    assert ad.variant_label == "A"
    assert len(ad.hashtags) == 3
    assert (tmp_path / f"{ad.id}.json").exists()


def test_generate_ad_variants(mock_client, product, tmp_path):
    from agents.ad_creator import AdCreatorAgent

    agent = AdCreatorAgent(output_dir=tmp_path)
    variants = agent.generate_ad_variants(product, Platform.TIKTOK, count=3)

    assert len(variants) == 3
    assert [v.variant_label for v in variants] == ["A", "B", "C"]


def test_batch_generate(mock_client, product, tmp_path):
    from agents.ad_creator import AdCreatorAgent

    agent = AdCreatorAgent(output_dir=tmp_path)
    ads = agent.batch_generate([product], [Platform.INSTAGRAM, Platform.FACEBOOK, Platform.TIKTOK])

    assert len(ads) == 3
    platforms = {ad.platform for ad in ads}
    assert Platform.INSTAGRAM in platforms


def test_ad_saved_as_json(mock_client, product, tmp_path):
    from agents.ad_creator import AdCreatorAgent

    agent = AdCreatorAgent(output_dir=tmp_path)
    ad = agent.generate_ad(product, Platform.PINTEREST)
    saved = json.loads((tmp_path / f"{ad.id}.json").read_text())

    assert saved["headline"] == ad.headline
    assert saved["platform"] == Platform.PINTEREST.value
