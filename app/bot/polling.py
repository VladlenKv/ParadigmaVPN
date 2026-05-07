import asyncio
import logging

from app.bot.dispatcher import create_bot, create_dispatcher
from app.config import get_settings
from app.logging import configure_logging

logger = logging.getLogger(__name__)


async def main() -> None:
    configure_logging()
    settings = get_settings()
    token = settings.bot_token.get_secret_value()
    if not token:
        msg = "BOT_TOKEN is required to run polling bot"
        raise RuntimeError(msg)

    bot = create_bot(settings)
    dispatcher = create_dispatcher(settings)
    try:
        await bot.delete_webhook(drop_pending_updates=True)
        logger.info("Starting Paradigma VPN bot in polling mode")
        await dispatcher.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())