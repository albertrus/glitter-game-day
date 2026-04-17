from __future__ import annotations

import json
from pathlib import Path

import anthropic

from models.ad_models import Ad, Platform, ProductInfo, Tone

_BASE = Path(__file__).parent.parent


class AdCreatorAgent:
    def __init__(self, output_dir: Path | None = None):
        self.client = anthropic.Anthropic()
        self.output_dir = output_dir or (_BASE / "data" / "ads")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self._system_prompt = (_BASE / "config" / "prompts" / "ad_creator_system.txt").read_text()

    _PLATFORM_INSTRUCTIONS: dict[Platform, str] = {
        Platform.INSTAGRAM: (
            "Write an Instagram caption (max 2200 chars) and 20-30 hashtags. "
            'Return JSON: {"headline": "...", "body": "...", "hashtags": [...], "cta": "..."}'
        ),
        Platform.FACEBOOK: (
            "Write a Facebook ad: headline (max 40 chars), primary text (max 125 chars), CTA button label. "
            'Return JSON: {"headline": "...", "body": "...", "hashtags": [], "cta": "..."}'
        ),
        Platform.PINTEREST: (
            "Write a Pinterest pin: title (max 100 chars), description (max 500 chars), keyword list. "
            'Return JSON: {"headline": "...", "body": "...", "hashtags": [...], "cta": "..."}'
        ),
        Platform.TIKTOK: (
            "Write a TikTok: hook line (max 150 chars), 3-bullet script outline as the body, 5-10 trending hashtags. "
            'Return JSON: {"headline": "...", "body": "...", "hashtags": [...], "cta": "..."}'
        ),
    }

    def generate_ad(
        self,
        product_info: ProductInfo,
        platform: Platform,
        tone: Tone = Tone.PLAYFUL,
        variant_label: str = "A",
    ) -> Ad:
        user_msg = (
            f"Product: {product_info.name}\n"
            f"Description: {product_info.description}\n"
            f"Price: ${product_info.price}\n"
            f"Tags: {', '.join(product_info.tags)}\n"
            f"Etsy URL: {product_info.etsy_url}\n"
            f"Tone: {tone.value}\n\n"
            f"{self._PLATFORM_INSTRUCTIONS[platform]}"
        )

        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=[
                {
                    "type": "text",
                    "text": self._system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": user_msg}],
        )

        data = json.loads(response.content[0].text)
        ad = Ad(
            platform=platform,
            variant_label=variant_label,
            headline=data.get("headline", ""),
            body=data.get("body", ""),
            hashtags=data.get("hashtags", []),
            cta=data.get("cta", "Shop now at glittergameday.etsy.com"),
            product_info=product_info,
        )
        self._save(ad)
        return ad

    def generate_ad_variants(
        self,
        product_info: ProductInfo,
        platform: Platform,
        count: int = 2,
    ) -> list[Ad]:
        tones = list(Tone)
        return [
            self.generate_ad(
                product_info,
                platform,
                tone=tones[i % len(tones)],
                variant_label=chr(65 + i),
            )
            for i in range(count)
        ]

    def batch_generate(
        self,
        products: list[ProductInfo],
        platforms: list[Platform],
    ) -> list[Ad]:
        return [
            self.generate_ad(product, platform)
            for product in products
            for platform in platforms
        ]

    def _save(self, ad: Ad) -> None:
        (self.output_dir / f"{ad.id}.json").write_text(ad.model_dump_json(indent=2))
