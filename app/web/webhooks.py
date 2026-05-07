from fastapi import APIRouter, Header, HTTPException, Request

from app.bot.dispatcher import create_bot, create_dispatcher
from app.config import Settings


def telegram_router(settings: Settings) -> APIRouter:
    router = APIRouter()
    bot = create_bot(settings)
    dispatcher = create_dispatcher(settings)

    @router.post(settings.webhook_path)
    async def telegram_webhook(
        request: Request, x_telegram_bot_api_secret_token: str | None = Header(default=None)
    ) -> dict[str, bool]:
        expected = settings.webhook_secret.get_secret_value()
        if expected and x_telegram_bot_api_secret_token != expected:
            raise HTTPException(status_code=403, detail="Invalid webhook secret")
        update = await request.json()
        await dispatcher.feed_raw_update(bot, update)
        return {"ok": True}

    return router
