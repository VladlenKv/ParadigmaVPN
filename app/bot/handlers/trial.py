from aiogram import Router
from aiogram.types import CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.keyboards.common import back_keyboard
from app.bot.texts import ru
from app.config import Settings
from app.services.subscriptions import SubscriptionService
from app.services.users import UserService

router = Router()


@router.callback_query(lambda call: call.data == "trial:create")
async def create_trial(call: CallbackQuery, session: AsyncSession, settings: Settings) -> None:
    if not call.from_user or not call.message:
        return
    user = await UserService(session, settings).upsert_from_telegram(call.from_user)
    service = SubscriptionService(session, settings)
    subscription = await service.create_trial(user)
    await session.commit()
    if not settings.trial_enabled:
        text = ru.TRIAL_DISABLED
    elif subscription is None:
        text = ru.TRIAL_ALREADY_USED
    else:
        text = ru.TRIAL_CREATED.format(
            expires_at=subscription.expires_at.strftime("%d.%m.%Y") if subscription.expires_at else "",
            traffic_gb=settings.trial_traffic_limit_gb,
        )
    await call.message.edit_text(text, reply_markup=back_keyboard())
    await call.answer()
