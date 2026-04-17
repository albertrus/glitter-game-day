from __future__ import annotations

import json
from pathlib import Path

import anthropic
from scipy import stats

import db.metrics_store as metrics_store
from models.analytics_models import AdAnalysis, AdMetrics, ComparisonResult, WinnerResult

_BASE = Path(__file__).parent.parent


class ABTestingAgent:
    def __init__(self):
        self.client = anthropic.Anthropic()
        self._system_prompt = (_BASE / "config" / "prompts" / "ab_tester_system.txt").read_text()
        metrics_store.init_db()

    def record_metrics(self, ad_id: str, metrics: AdMetrics) -> None:
        metrics_store.insert_metrics(metrics)

    def compare_variants(self, variant_a_id: str, variant_b_id: str) -> ComparisonResult:
        a = metrics_store.get_latest_metrics(variant_a_id)
        b = metrics_store.get_latest_metrics(variant_b_id)
        if not a or not b:
            raise ValueError(f"Metrics not found for variants: {variant_a_id}, {variant_b_id}")

        a_miss = max(a.impressions - a.clicks, 0)
        b_miss = max(b.impressions - b.clicks, 0)
        _, p_value, _, _ = stats.chi2_contingency([[a.clicks, a_miss], [b.clicks, b_miss]])
        confidence = round((1 - p_value) * 100, 2)

        winner = variant_a_id if a.ctr >= b.ctr else variant_b_id
        loser_ctr = min(a.ctr, b.ctr)
        improvement = abs(a.ctr - b.ctr) / max(loser_ctr, 1e-6) * 100

        prompt = (
            f"Variant A (id={variant_a_id}): CTR={a.ctr:.2%}, ROAS={a.roas:.2f}, conversions={a.conversions}\n"
            f"Variant B (id={variant_b_id}): CTR={b.ctr:.2%}, ROAS={b.roas:.2f}, conversions={b.conversions}\n"
            f"Winner: {winner}, statistical confidence={confidence:.1f}%\n\n"
            "In one short paragraph explain why the winner performed better and what to do next."
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

        return ComparisonResult(
            variant_a_id=variant_a_id,
            variant_b_id=variant_b_id,
            winner_id=winner,
            confidence_score=confidence,
            improvement_pct=round(improvement, 2),
            recommendation=resp.content[0].text.strip(),
        )

    def analyze_ad(self, ad_id: str) -> AdAnalysis:
        m = metrics_store.get_latest_metrics(ad_id)
        if not m:
            raise ValueError(f"No metrics found for ad {ad_id}")

        prompt = (
            f"Ad ID: {ad_id}, Platform: {m.platform.value}\n"
            f"Impressions: {m.impressions}, Clicks: {m.clicks}, CTR: {m.ctr:.2%}\n"
            f"Conversions: {m.conversions}, ROAS: {m.roas:.2f}\n\n"
            'Return JSON only: {"performance_rating": "poor|fair|good|excellent", '
            '"strengths": [...], "weaknesses": [...], "suggestions": [...]}'
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
        return AdAnalysis(ad_id=ad_id, **data)

    def get_winner(self, test_id: str) -> WinnerResult:
        a_id, b_id = test_id.split("_vs_", 1)
        result = self.compare_variants(a_id, b_id)
        loser = a_id if result.winner_id == b_id else b_id
        return WinnerResult(
            test_id=test_id,
            winner_id=result.winner_id,
            loser_id=loser,
            confidence=result.confidence_score,
            statistical_significance=result.confidence_score >= 95.0,
        )

    def get_recommendations(self, ad_id: str) -> list[str]:
        return self.analyze_ad(ad_id).suggestions
