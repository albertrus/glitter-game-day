#!/usr/bin/env python3
"""GlitterGameDay Marketing Suite — CLI orchestrator."""
from __future__ import annotations

import argparse
from datetime import date, timedelta

from dotenv import load_dotenv

load_dotenv()


def cmd_generate_ads() -> None:
    from agents.ad_creator import AdCreatorAgent
    from models.ad_models import Platform, ProductInfo

    products = [
        ProductInfo(
            name="Game Day Glitter Kit",
            description="Everything you need to sparkle on game day — 6 colors of ultra-fine glitter, body glue, and team-color stencils.",
            price=14.99,
            tags=["game day", "glitter", "football", "sports fan", "DIY"],
        ),
        ProductInfo(
            name="Chunky Glitter Mix — Team Spirit Pack",
            description="Bold chunky glitter in classic team colors. Perfect for signs, cups, and accessories.",
            price=8.99,
            tags=["chunky glitter", "team spirit", "craft supplies", "DIY"],
        ),
        ProductInfo(
            name="Game Day Glitter Tumbler Kit",
            description="Make your own custom glitter tumbler in team colors — includes glitter, Mod Podge, and step-by-step guide.",
            price=19.99,
            tags=["tumbler", "glitter", "game day", "DIY", "personalized"],
        ),
    ]
    platforms = [Platform.INSTAGRAM, Platform.FACEBOOK, Platform.TIKTOK, Platform.PINTEREST]

    print("Generating ads for all products and platforms...")
    agent = AdCreatorAgent()
    ads = agent.batch_generate(products, platforms)
    print(f"✓ Generated {len(ads)} ads → saved to data/ads/")
    for ad in ads:
        print(f"  [{ad.platform.value:10}] [{ad.variant_label}] {ad.headline}")


def cmd_run_ab_test() -> None:
    from agents.ab_tester import ABTestingAgent
    from models.ad_models import Platform
    from models.analytics_models import AdMetrics

    agent = ABTestingAgent()

    agent.record_metrics(
        "ad_demo_A",
        AdMetrics(
            ad_id="ad_demo_A",
            impressions=2000, clicks=80, ctr=0.04,
            conversions=12, conversion_rate=0.15,
            spend=50.0, revenue=180.0, roas=3.6,
            platform=Platform.INSTAGRAM,
        ),
    )
    agent.record_metrics(
        "ad_demo_B",
        AdMetrics(
            ad_id="ad_demo_B",
            impressions=2000, clicks=110, ctr=0.055,
            conversions=18, conversion_rate=0.164,
            spend=50.0, revenue=260.0, roas=5.2,
            platform=Platform.INSTAGRAM,
        ),
    )

    print("Running A/B test: ad_demo_A vs ad_demo_B...")
    result = agent.compare_variants("ad_demo_A", "ad_demo_B")
    print(f"  Winner  : {result.winner_id}")
    print(f"  Confidence : {result.confidence_score:.1f}%")
    print(f"  Improvement: {result.improvement_pct:.1f}%")
    print(f"  Insight : {result.recommendation}")

    winner = agent.get_winner("ad_demo_A_vs_ad_demo_B")
    sig = "✓ statistically significant" if winner.statistical_significance else "⚠ not yet significant"
    print(f"  {sig}")


def cmd_weekly_report() -> None:
    from agents.content_reporter import ContentReporterAgent
    from models.ad_models import Platform, ProductInfo
    from models.analytics_models import AdMetrics

    week_start = date.today() - timedelta(days=date.today().weekday())

    products = [
        ProductInfo(
            name="Game Day Glitter Kit",
            description="Sparkle on game day!",
            price=14.99,
            tags=["glitter", "game day"],
        ),
        ProductInfo(
            name="Chunky Glitter Mix",
            description="Bold team colors.",
            price=8.99,
            tags=["glitter", "crafts"],
        ),
    ]
    metrics = [
        AdMetrics(
            ad_id="ad_ig_1",
            impressions=3200, clicks=128, ctr=0.04,
            conversions=16, conversion_rate=0.125,
            spend=80.0, revenue=240.0, roas=3.0,
            platform=Platform.INSTAGRAM,
        ),
        AdMetrics(
            ad_id="ad_fb_1",
            impressions=1800, clicks=54, ctr=0.03,
            conversions=8, conversion_rate=0.148,
            spend=45.0, revenue=120.0, roas=2.67,
            platform=Platform.FACEBOOK,
        ),
        AdMetrics(
            ad_id="ad_pin_1",
            impressions=4500, clicks=90, ctr=0.02,
            conversions=11, conversion_rate=0.122,
            spend=30.0, revenue=165.0, roas=5.5,
            platform=Platform.PINTEREST,
        ),
    ]

    agent = ContentReporterAgent()
    print(f"Generating weekly report for week of {week_start}...")
    report = agent.generate_weekly_report(week_start, [], metrics)
    output = f"reports/week_{week_start.strftime('%Y_%m_%d')}.md"
    agent.export_report_markdown(report, output)

    print(f"  ✓ Report saved → {output}")
    print(f"  Impressions : {report.total_impressions:,}")
    print(f"  Clicks      : {report.total_clicks:,}")
    print(f"  Revenue     : ${report.total_revenue:.2f}")
    print(f"  Top Ad      : {report.top_performing_ad}")
    print(f"  Recs        : {len(report.recommendations)} recommendations generated")


_COMMANDS = {
    "generate-ads": cmd_generate_ads,
    "run-ab-test": cmd_run_ab_test,
    "weekly-report": cmd_weekly_report,
}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="GlitterGameDay Marketing Suite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python main.py --generate-ads\n"
            "  python main.py --run-ab-test\n"
            "  python main.py --weekly-report\n"
            "  python main.py --all\n"
        ),
    )
    for cmd in _COMMANDS:
        parser.add_argument(f"--{cmd}", action="store_true")
    parser.add_argument("--all", action="store_true", help="Run full pipeline")
    args = parser.parse_args()

    ran = False
    for cmd, fn in _COMMANDS.items():
        if getattr(args, cmd.replace("-", "_")) or args.all:
            fn()
            ran = True

    if not ran:
        parser.print_help()


if __name__ == "__main__":
    main()
