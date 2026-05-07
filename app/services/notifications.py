from aiogram import Bot


class NotificationService:
    def __init__(self, bot: Bot) -> None:
        self._bot = bot

    async def notify_admins(self, admin_ids: set[int], text: str) -> None:
        for admin_id in admin_ids:
            await self._bot.send_message(admin_id, text)
