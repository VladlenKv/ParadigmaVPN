from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from app.config import get_settings
from app.logging import configure_logging
from app.web.routes import public_router, router as health_router
from app.web.webhooks import telegram_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_logging()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Paradigma VPN", version="0.1.0", lifespan=lifespan)
    app.include_router(health_router)
    app.include_router(public_router(settings))
    app.include_router(telegram_router(settings))
    return app


app = create_app()
