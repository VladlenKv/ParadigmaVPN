from aiogram import Router
from aiogram.types import CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.keyboards.common import back_keyboard, subscription_keyboard
from app.bot.texts import ru
from app.config import Settings
from app.services.subscriptions import SubscriptionService
from app.services.users import UserService

router = Router()


@router.callback_query(lambda call: call.data == "subscription:show")
async def show_subscription(call: CallbackQuery, session: AsyncSession, settings: Settings) -> None:
    if not call.from_user or not call.message:
        return
    user = await UserService(session, settings).get_by_telegram_id(call.from_user.id)
    if not user:
        await call.message.edit_text(ru.SUBSCRIPTION_EMPTY, reply_markup=back_keyboard())
        await call.answer()
        return
    subscription = await SubscriptionService(session, settings).latest_for_user(user)
    if not subscription:
        await call.message.edit_text(ru.SUBSCRIPTION_EMPTY, reply_markup=back_keyboard())
        await call.answer()
        return
    plan_title = subscription.plan.title if subscription.plan else "Тестовый период"
    limit = (
        f"{subscription.traffic_limit_bytes / 1024 / 1024 / 1024:.0f} GB"
        if subscription.traffic_limit_bytes
        else "без фиксированного лимита"
    )
    used = subscription.last_traffic_used_bytes / 1024 / 1024 / 1024
    expires = subscription.expires_at.strftime("%d.%m.%Y") if subscription.expires_at else "не указано"
    await call.message.edit_text(
        ru.SUBSCRIPTION_INFO.format(
            status=subscription.status,
            plan_title=plan_title,
            expires_at=expires,
            used_gb=f"{used:.1f}",
            limit_gb=limit,
            subscription_url=subscription.subscription_url or "ожидает выдачи",
        ),
        reply_markup=subscription_keyboard(),
        disable_web_page_preview=True,
    )
    await call.answer()
