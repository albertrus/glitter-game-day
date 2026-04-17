from __future__ import annotations

import sqlite3
from datetime import datetime
from pathlib import Path

from models.ad_models import Platform
from models.analytics_models import AdMetrics

DB_PATH = Path(__file__).parent.parent / "data" / "metrics.db"
_SCHEMA = Path(__file__).parent / "schema.sql"


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection | None = None) -> None:
    _conn = conn or get_connection()
    with _conn:
        _conn.executescript(_SCHEMA.read_text())
    if not conn:
        _conn.close()


def insert_metrics(metrics: AdMetrics, conn: sqlite3.Connection | None = None) -> None:
    _conn = conn or get_connection()
    with _conn:
        _conn.execute(
            """INSERT INTO ad_metrics
               (ad_id, impressions, clicks, ctr, conversions, conversion_rate,
                spend, revenue, roas, platform, recorded_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                metrics.ad_id,
                metrics.impressions,
                metrics.clicks,
                metrics.ctr,
                metrics.conversions,
                metrics.conversion_rate,
                metrics.spend,
                metrics.revenue,
                metrics.roas,
                metrics.platform.value,
                metrics.recorded_at.isoformat(),
            ),
        )
    if not conn:
        _conn.close()


def get_metrics_for_ad(ad_id: str, conn: sqlite3.Connection | None = None) -> list[AdMetrics]:
    _conn = conn or get_connection()
    rows = _conn.execute(
        "SELECT * FROM ad_metrics WHERE ad_id = ? ORDER BY recorded_at", (ad_id,)
    ).fetchall()
    if not conn:
        _conn.close()
    return [_row_to_metrics(r) for r in rows]


def get_latest_metrics(ad_id: str, conn: sqlite3.Connection | None = None) -> AdMetrics | None:
    _conn = conn or get_connection()
    row = _conn.execute(
        "SELECT * FROM ad_metrics WHERE ad_id = ? ORDER BY recorded_at DESC LIMIT 1",
        (ad_id,),
    ).fetchone()
    if not conn:
        _conn.close()
    return _row_to_metrics(row) if row else None


def get_all_metrics(conn: sqlite3.Connection | None = None) -> list[AdMetrics]:
    _conn = conn or get_connection()
    rows = _conn.execute(
        "SELECT * FROM ad_metrics ORDER BY recorded_at DESC"
    ).fetchall()
    if not conn:
        _conn.close()
    return [_row_to_metrics(r) for r in rows]


def _row_to_metrics(row: sqlite3.Row) -> AdMetrics:
    return AdMetrics(
        ad_id=row["ad_id"],
        impressions=row["impressions"],
        clicks=row["clicks"],
        ctr=row["ctr"],
        conversions=row["conversions"],
        conversion_rate=row["conversion_rate"],
        spend=row["spend"],
        revenue=row["revenue"],
        roas=row["roas"],
        platform=Platform(row["platform"]),
        recorded_at=datetime.fromisoformat(row["recorded_at"]),
    )
