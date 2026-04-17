CREATE TABLE IF NOT EXISTS ad_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad_id TEXT NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0.0,
    conversions INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0.0,
    spend REAL DEFAULT 0.0,
    revenue REAL DEFAULT 0.0,
    roas REAL DEFAULT 0.0,
    platform TEXT NOT NULL,
    recorded_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ad_metrics_ad_id ON ad_metrics(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_metrics_platform ON ad_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_ad_metrics_recorded_at ON ad_metrics(recorded_at);
