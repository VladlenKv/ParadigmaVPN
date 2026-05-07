from aiogram.types import User as TelegramUser
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.db.models import User


class UserService:
    def __init__(self, session: AsyncSession, settings: Settings) -> None:
        self._session = session
        self._settings = settings

    async def upsert_from_telegram(
        self, telegram_user: TelegramUser, referral_code: str | None = None
    ) -> User:
        user = await self.get_by_telegram_id(telegram_user.id)
        if user is None:
            user = User(telegram_id=telegram_user.id)
            self._session.add(user)

        user.username = telegram_user.username
        user.first_name = telegram_user.first_name
        user.last_name = telegram_user.last_name
        user.language_code = telegram_user.language_code
        user.is_admin = telegram_user.id in self._settings.admin_telegram_ids
        if referral_code and not user.referral_code:
            user.referral_code = referral_code
        await self._session.flush()
        return user

    async def get_by_telegram_id(self, telegram_id: int) -> User | None:
        result = await self._session.execute(select(User).where(User.telegram_id == telegram_id))
        return result.scalar_one_or_none()
