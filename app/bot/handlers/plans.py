from aiogram import Router
from aiogram.types import CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.keyboards.common import back_keyboard, plan_details_keyboard, plans_keyboard
from app.bot.texts import ru
from app.services.plans import PlanService

router = Router()


@router.callback_query(lambda call: call.data == "plans:list")
async def list_plans(call: CallbackQuery, session: AsyncSession) -> None:
    plans = await PlanService(session).list_active()
    if not call.message:
        return
    if not plans:
        await call.message.edit_text(ru.NO_PLANS, reply_markup=back_keyboard())
    else:
        await call.message.edit_text(ru.PLANS_TITLE, reply_markup=plans_keyboard(plans))
    await call.answer()


@router.callback_query(lambda call: call.data and call.data.startswith("plans:select:"))
async def show_plan(call: CallbackQuery, session: AsyncSession) -> None:
    if not call.data or not call.message:
        return
    plan_id = int(call.data.rsplit(":", maxsplit=1)[1])
    plan = await PlanService(session).get_by_id(plan_id)
    if not plan:
        await call.answer("Тариф не найден", show_alert=True)
        return
    traffic = f"{plan.traffic_limit_gb} GB" if plan.traffic_limit_gb else "без фиксированного лимита"
    text = (
        f"🚀 {plan.title}\n\n"
        f"{plan.description}\n\n"
        f"Срок: {plan.duration_days} дней\n"
        f"Трафик: {traffic}\n"
        f"Устройства: {plan.device_limit}\n"
        f"Цена: {plan.price_amount:g} {plan.currency}"
    )
    await call.message.edit_text(text, reply_markup=plan_details_keyboard(plan.id))
    await call.answer()
