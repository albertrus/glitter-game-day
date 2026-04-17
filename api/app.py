from __future__ import annotations

import json
from contextlib import asynccontextmanager
from datetime import date, timedelta
from pathlib import Path

import db.metrics_store as metrics_store
from api.store_routes import router as store_router
from api.admin_routes import router as admin_router
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import BackgroundTasks, FastAPI, Form, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE = Path(__file__).parent.parent
scheduler = BackgroundScheduler(timezone="America/New_York")


def _daily_content_job() -> None:
    """Runs every morning: generate today's posts and refresh the calendar."""
    try:
        from agents.content_reporter import ContentReporterAgent
        from models.ad_models import ProductInfo

        products = _default_products()
        agent = ContentReporterAgent()
        week_start = date.today() - timedelta(days=date.today().weekday())
        calendar = agent.create_weekly_content_calendar(products, week_start)
        _save_calendar(calendar)
    except Exception as exc:  # noqa: BLE001
        print(f"[scheduler] daily_content_job failed: {exc}")


def _weekly_report_job() -> None:
    """Runs every Monday morning: generate the weekly performance report."""
    try:
        from agents.content_reporter import ContentReporterAgent

        agent = ContentReporterAgent()
        week_start = date.today() - timedelta(days=date.today().weekday())
        all_metrics = metrics_store.get_all_metrics()
        report = agent.generate_weekly_report(week_start, [], all_metrics)
        out = BASE / "reports" / f"week_{week_start.strftime('%Y_%m_%d')}.md"
        agent.export_report_markdown(report, str(out))
        print(f"[scheduler] weekly report saved → {out}")
    except Exception as exc:  # noqa: BLE001
        print(f"[scheduler] weekly_report_job failed: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    from db.database import init_db as init_store_db
    init_store_db()
    metrics_store.init_db()
    (BASE / "data" / "ads").mkdir(parents=True, exist_ok=True)
    (BASE / "reports").mkdir(exist_ok=True)
    scheduler.add_job(_daily_content_job, CronTrigger(hour=8, minute=0))
    scheduler.add_job(_weekly_report_job, CronTrigger(day_of_week="mon", hour=8, minute=30))
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="GlitterGameDay Marketing Dashboard", lifespan=lifespan)
app.include_router(store_router)
app.include_router(admin_router)
app.mount(
    "/static",
    StaticFiles(directory=str(BASE / "dashboard" / "static")),
    name="static",
)
templates = Jinja2Templates(directory=str(BASE / "dashboard" / "templates"))


# ── helpers ──────────────────────────────────────────────────────────────────

def _default_products():
    from models.ad_models import ProductInfo
    return [
        ProductInfo(
            name="Game Day Glitter Kit",
            description="Everything you need to sparkle on game day — 6 colors, body glue, stencils.",
            price=14.99,
            tags=["game day", "glitter", "football", "sports fan", "DIY"],
        ),
        ProductInfo(
            name="Chunky Glitter Mix — Team Spirit Pack",
            description="Bold chunky glitter in classic team colors for signs, cups, and accessories.",
            price=8.99,
            tags=["chunky glitter", "team spirit", "craft supplies", "DIY"],
        ),
        ProductInfo(
            name="Game Day Glitter Tumbler Kit",
            description="Make a custom glitter tumbler in team colors — glitter, Mod Podge, step-by-step guide.",
            price=19.99,
            tags=["tumbler", "glitter", "game day", "DIY", "personalized"],
        ),
    ]


def _save_calendar(calendar) -> None:
    data = calendar.model_dump(mode="json")
    (BASE / "data" / "calendar.json").write_text(
        json.dumps(data, indent=2, default=str)
    )


def _get_kpis() -> dict:
    all_metrics = metrics_store.get_all_metrics()
    total_impressions = sum(m.impressions for m in all_metrics)
    total_clicks = sum(m.clicks for m in all_metrics)
    total_revenue = sum(m.revenue for m in all_metrics)
    avg_roas = sum(m.roas for m in all_metrics) / len(all_metrics) if all_metrics else 0
    return {
        "total_impressions": total_impressions,
        "total_clicks": total_clicks,
        "total_revenue": round(total_revenue, 2),
        "avg_roas": round(avg_roas, 2),
        "overall_ctr": round(total_clicks / total_impressions * 100, 2) if total_impressions else 0,
        "total_ads": len(list((BASE / "data" / "ads").glob("*.json"))),
    }


def _get_platform_breakdown() -> dict:
    breakdown: dict = {}
    for m in metrics_store.get_all_metrics():
        p = m.platform.value
        if p not in breakdown:
            breakdown[p] = {"impressions": 0, "clicks": 0, "revenue": 0.0}
        breakdown[p]["impressions"] += m.impressions
        breakdown[p]["clicks"] += m.clicks
        breakdown[p]["revenue"] += m.revenue
    return breakdown


def _get_recent_ads(limit: int = 20) -> list:
    ads_dir = BASE / "data" / "ads"
    return [
        json.loads(f.read_text())
        for f in sorted(ads_dir.glob("*.json"), key=lambda x: x.stat().st_mtime, reverse=True)[:limit]
    ]


def _get_reports() -> list:
    return [
        {
            "name": f.name,
            "date": f.stem.replace("week_", "").replace("_", "-"),
            "content": f.read_text(),
        }
        for f in sorted(
            (BASE / "reports").glob("week_*.md"),
            key=lambda x: x.stat().st_mtime,
            reverse=True,
        )
    ]


# ── page routes ───────────────────────────────────────────────────────────────

@app.get("/")
async def page_index(request: Request):
    kpis = _get_kpis()
    breakdown = _get_platform_breakdown()
    platforms = list(breakdown.keys())
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "kpis": kpis,
            "breakdown": breakdown,
            "recent_ads": _get_recent_ads(6),
            "chart_labels": json.dumps([p.title() for p in platforms]),
            "chart_impressions": json.dumps([breakdown[p]["impressions"] for p in platforms]),
            "chart_revenue": json.dumps([round(breakdown[p]["revenue"], 2) for p in platforms]),
        },
    )


@app.get("/reports")
async def page_reports(request: Request):
    reports = _get_reports()
    return templates.TemplateResponse(
        "reports.html",
        {"request": request, "reports": reports, "latest": reports[0] if reports else None},
    )


@app.get("/content")
async def page_content(request: Request):
    cal_file = BASE / "data" / "calendar.json"
    calendar = json.loads(cal_file.read_text()) if cal_file.exists() else None
    return templates.TemplateResponse(
        "content.html", {"request": request, "calendar": calendar}
    )


@app.get("/abtests")
async def page_abtests(request: Request):
    all_metrics = metrics_store.get_all_metrics()
    ad_ids = sorted({m.ad_id for m in all_metrics})
    metrics_by_id = {
        m.ad_id: {
            "impressions": m.impressions,
            "clicks": m.clicks,
            "ctr": round(m.ctr * 100, 2),
            "roas": round(m.roas, 2),
            "platform": m.platform.value,
        }
        for m in all_metrics
    }
    return templates.TemplateResponse(
        "abtests.html",
        {"request": request, "ad_ids": ad_ids, "metrics": metrics_by_id},
    )


@app.get("/ads")
async def page_ads(request: Request):
    return templates.TemplateResponse(
        "ads.html", {"request": request, "ads": _get_recent_ads(30)}
    )


# ── API: triggers ─────────────────────────────────────────────────────────────

@app.post("/api/run/generate-ads")
async def api_generate_ads(background_tasks: BackgroundTasks):
    def _run():
        from agents.ad_creator import AdCreatorAgent
        from models.ad_models import Platform
        agent = AdCreatorAgent()
        agent.batch_generate(_default_products(), list(Platform))

    background_tasks.add_task(_run)
    return {"status": "started", "message": "Generating ads for all platforms…"}


@app.post("/api/run/generate-report")
async def api_generate_report(background_tasks: BackgroundTasks):
    def _run():
        from agents.content_reporter import ContentReporterAgent
        week_start = date.today() - timedelta(days=date.today().weekday())
        agent = ContentReporterAgent()
        report = agent.generate_weekly_report(week_start, [], metrics_store.get_all_metrics())
        out = BASE / "reports" / f"week_{week_start.strftime('%Y_%m_%d')}.md"
        agent.export_report_markdown(report, str(out))

    background_tasks.add_task(_run)
    return {"status": "started", "message": "Generating weekly report…"}


@app.post("/api/run/generate-calendar")
async def api_generate_calendar(background_tasks: BackgroundTasks):
    def _run():
        from agents.content_reporter import ContentReporterAgent
        week_start = date.today() - timedelta(days=date.today().weekday())
        calendar = ContentReporterAgent().create_weekly_content_calendar(
            _default_products(), week_start
        )
        _save_calendar(calendar)

    background_tasks.add_task(_run)
    return {"status": "started", "message": "Generating content calendar…"}


@app.post("/api/run/ab-test")
async def api_ab_test(variant_a: str = Form(...), variant_b: str = Form(...)):
    try:
        from agents.ab_tester import ABTestingAgent
        result = ABTestingAgent().compare_variants(variant_a, variant_b)
        return result.model_dump()
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=400, content={"error": str(exc)})


# ── API: data ─────────────────────────────────────────────────────────────────

@app.get("/api/data/kpis")
async def api_kpis():
    return _get_kpis()


@app.get("/api/data/metrics")
async def api_metrics():
    return [m.model_dump(mode="json") for m in metrics_store.get_all_metrics()]


@app.get("/api/data/ads")
async def api_ads():
    return _get_recent_ads(50)
