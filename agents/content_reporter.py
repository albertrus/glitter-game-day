from __future__ import annotations

import json
from datetime import date, datetime, timedelta
from pathlib import Path

import anthropic
from jinja2 import Environment, FileSystemLoader

from models.ad_models import Ad, Platform, ProductInfo
from models.analytics_models import AdMetrics
from models.content_models import ContentCalendar, SocialPost, WeeklyReport

_BASE = Path(__file__).parent.parent

_WEEKLY_SCHEDULE: dict[int, tuple[Platform, str]] = {
    0: (Platform.INSTAGRAM, "Game Day"),
    1: (Platform.PINTEREST, "Product Spotlight"),
    2: (Platform.INSTAGRAM, "Glitter DIY"),
    3: (Platform.PINTEREST, "DIY Ideas"),
    4: (Platform.INSTAGRAM, "Seasonal"),
    5: (Platform.TIKTOK, "Fun/Viral"),
    6: (Platform.FACEBOOK, "Boosted Post"),
}


class ContentReporterAgent:
    def __init__(self, output_dir: Path | None = None):
        self.client = anthropic.Anthropic()
        self.reports_dir = output_dir or (_BASE / "reports")
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        self._system_prompt = (
            _BASE / "config" / "prompts" / "content_reporter_system.txt"
        ).read_text()
        self.jinja = Environment(
            loader=FileSystemLoader(str(_BASE / "config" / "templates"))
        )

    def create_post(
        self, platform: Platform, theme: str, product_info: ProductInfo
    ) -> SocialPost:
        prompt = (
            f"Platform: {platform.value}\n"
            f"Theme: {theme}\n"
            f"Product: {product_info.name} — {product_info.description} — ${product_info.price}\n"
            f"URL: {product_info.etsy_url}\n\n"
            "Write a ready-to-post caption and hashtags.\n"
            'Return JSON: {"caption": "...", "hashtags": [...], "image_prompt": "..."}'
        )
        resp = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=512,
            system=[
                {
                    "type": "text",
                    "text": self._system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": prompt}],
        )
        data = json.loads(resp.content[0].text)
        return SocialPost(
            platform=platform,
            caption=data["caption"],
            hashtags=data.get("hashtags", []),
            image_prompt=data.get("image_prompt", ""),
            post_time=datetime.utcnow(),
            theme=theme,
        )

    def create_weekly_content_calendar(
        self, products: list[ProductInfo], week_start: date
    ) -> ContentCalendar:
        posts: list[SocialPost] = []
        for day_offset, (platform, theme) in _WEEKLY_SCHEDULE.items():
            product = products[day_offset % len(products)]
            post = self.create_post(platform, theme, product)
            post.post_time = datetime.combine(
                week_start + timedelta(days=day_offset),
                datetime.min.time().replace(hour=10),
            )
            posts.append(post)

        platforms_covered = list({p.platform for p in posts})
        return ContentCalendar(
            week_start=week_start,
            week_end=week_start + timedelta(days=6),
            posts=posts,
            platforms_covered=platforms_covered,
        )

    def generate_hashtag_set(self, niche: str, platform: Platform) -> list[str]:
        prompt = (
            f"Generate 20 trending hashtags for '{niche}' on {platform.value}. "
            "Return a JSON array of strings only."
        )
        resp = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=256,
            system=[
                {
                    "type": "text",
                    "text": self._system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": prompt}],
        )
        return json.loads(resp.content[0].text)

    def generate_weekly_report(
        self,
        week_start: date,
        ads: list[Ad],
        metrics: list[AdMetrics],
    ) -> WeeklyReport:
        total_impressions = sum(m.impressions for m in metrics)
        total_clicks = sum(m.clicks for m in metrics)
        total_revenue = sum(m.revenue for m in metrics)

        platform_breakdown: dict[str, dict] = {}
        for m in metrics:
            p = m.platform.value
            if p not in platform_breakdown:
                platform_breakdown[p] = {"impressions": 0, "clicks": 0, "revenue": 0.0}
            platform_breakdown[p]["impressions"] += m.impressions
            platform_breakdown[p]["clicks"] += m.clicks
            platform_breakdown[p]["revenue"] += m.revenue

        top_ad = max(metrics, key=lambda m: m.roas).ad_id if metrics else ""
        worst_ad = min(metrics, key=lambda m: m.roas).ad_id if metrics else ""

        summary = (
            f"Week of {week_start}: {total_impressions:,} impressions, "
            f"{total_clicks:,} clicks, ${total_revenue:.2f} revenue.\n"
            f"Platform breakdown: {json.dumps(platform_breakdown)}"
        )
        resp = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=512,
            system=[
                {
                    "type": "text",
                    "text": self._system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"{summary}\n\n"
                        "Give 5 specific, actionable recommendations for next week. "
                        "Return a JSON array of strings."
                    ),
                }
            ],
        )
        recommendations: list[str] = json.loads(resp.content[0].text)

        return WeeklyReport(
            week_start=week_start,
            week_end=week_start + timedelta(days=6),
            total_impressions=total_impressions,
            total_clicks=total_clicks,
            total_revenue=total_revenue,
            top_performing_ad=top_ad,
            worst_performing_ad=worst_ad,
            platform_breakdown=platform_breakdown,
            recommendations=recommendations,
        )

    def export_report_markdown(self, report: WeeklyReport, output_path: str) -> str:
        template = self.jinja.get_template("weekly_report.md.j2")
        content = template.render(report=report)
        Path(output_path).write_text(content)
        return output_path
