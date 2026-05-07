from aiogram import Router
from aiogram.types import CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.keyboards.common import back_keyboard
from app.bot.texts import ru
from app.config import Settings
from app.services.payments import PaymentService
from app.services.plans import PlanService
from app.services.subscriptions import SubscriptionService
from app.services.users import UserService

router = Router()


@router.callback_query(lambda call: call.data and call.data.startswith("payments:create:"))
async def create_payment(call: CallbackQuery, session: AsyncSession, settings: Settings) -> None:
    if not call.data or not call.from_user or not call.message:
        return
    plan_id = int(call.data.rsplit(":", maxsplit=1)[1])
    user = await UserService(session, settings).upsert_from_telegram(call.from_user)
    plan = await PlanService(session).get_by_id(plan_id)
    if not plan:
        await call.answer("Тариф не найден", show_alert=True)
        return
    subscription = await SubscriptionService(session, settings).create_pending_for_plan(user, plan)
    payment = await PaymentService(session).create_manual_payment(user, plan, subscription)
    await session.commit()
    await call.message.edit_text(
        ru.PAYMENT_CREATED.format(
            payment_id=payment.id,
            plan_title=plan.title,
            amount=f"{payment.amount:g}",
            currency=payment.currency,
        ),
        reply_markup=back_keyboard(),
    )
    await call.answer()
