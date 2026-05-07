from fastapi import APIRouter

from app.config import Settings
from app.integrations.marzban import MarzbanClient

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/ready")
async def ready() -> dict[str, str]:
    return {"status": "ready"}


def public_router(settings: Settings) -> APIRouter:
    site = APIRouter()

    @site.get("/")
    async def landing() -> dict[str, object]:
        return {
            "name": "Paradigma VPN",
            "bot": "Telegram bot is configured via BOT_TOKEN",
            "links": {
                "site": str(settings.public_site_url),
                "support": str(settings.support_url),
                "terms": str(settings.terms_url),
                "privacy": str(settings.privacy_url),
            },
        }

    @site.get("/marzban/health")
    async def marzban_health() -> dict[str, bool]:
        client = MarzbanClient(settings)
        try:
            ok = await client.healthcheck()
        finally:
            await client.aclose()
        return {"ok": ok}

    return site
