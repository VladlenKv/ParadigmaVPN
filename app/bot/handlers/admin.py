from aiogram import Router
from aiogram.filters import Command
from aiogram.types import CallbackQuery, Message
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.bot.keyboards.common import admin_menu_keyboard, admin_pending_payments_keyboard
from app.bot.texts import ru
from app.config import Settings
from app.db.models import Payment, PaymentStatus, Plan, Subscription, SubscriptionStatus, User
from app.integrations.marzban import MarzbanClient, MarzbanError
from app.services.payments import PaymentService
from app.services.provisioning import MarzbanProvisioningService

router = Router()


def is_admin(telegram_id: int | None, settings: Settings) -> bool:
    return telegram_id is not None and telegram_id in settings.admin_telegram_ids


async def get_payment_with_relations(session: AsyncSession, payment_id: int) -> Payment | None:
    result = await session.execute(
        select(Payment)
        .where(Payment.id == payment_id)
        .options(
            selectinload(Payment.user),
            selectinload(Payment.subscription).selectinload(Subscription.plan),
        )
    )
    return result.scalar_one_or_none()


async def confirm_payment_by_id(
    payment_id: int,
    session: AsyncSession,
    settings: Settings,
) -> tuple[bool, bool, str, Payment | None]:
    payment = await get_payment_with_relations(session, payment_id)
    if not payment or not payment.subscription:
        return False, False, ru.PAYMENT_NOT_FOUND, None
    if payment.status == PaymentStatus.paid.value:
        return True, True, f"Платеж #{payment.id} уже был подтвержден.", payment

    plan = payment.subscription.plan
    if not plan:
        plan = await session.scalar(select(Plan).where(Plan.id == payment.subscription.plan_id))
    if not plan:
        return False, False, "Тариф для платежа не найден.", payment

    await PaymentService(session).mark_paid(payment)
    client = MarzbanClient(settings)
    try:
        await MarzbanProvisioningService(client).provision(payment.user, payment.subscription, plan)
    except MarzbanError:
        await session.commit()
        return True, False, ru.PROVISIONING_FAILED.format(payment_id=payment.id), payment
    finally:
        await client.aclose()

    await session.commit()
    return True, True, ru.PAYMENT_CONFIRMED.format(payment_id=payment.id), payment


@router.message(Command("admin"))
async def admin_command(message: Message, settings: Settings) -> None:
    if not is_admin(message.from_user.id if message.from_user else None, settings):
        await message.answer(ru.ADMIN_DENIED)
        return
    await message.answer(ru.ADMIN_MENU, reply_markup=admin_menu_keyboard())


@router.callback_query(lambda call: call.data == "admin:menu")
async def admin_menu(call: CallbackQuery, settings: Settings) -> None:
    if not is_admin(call.from_user.id if call.from_user else None, settings):
        await call.answer(ru.ADMIN_DENIED, show_alert=True)
        return
    if call.message:
        await call.message.edit_text(ru.ADMIN_MENU, reply_markup=admin_menu_keyboard())
    await call.answer()


@router.callback_query(lambda call: call.data == "admin:stats")
async def admin_stats(call: CallbackQuery, session: AsyncSession, settings: Settings) -> None:
    if not is_admin(call.from_user.id if call.from_user else None, settings):
        await call.answer(ru.ADMIN_DENIED, show_alert=True)
        return

    users_count = await session.scalar(select(func.count(User.id))) or 0
    pending_payments = await session.scalar(
        select(func.count(Payment.id)).where(Payment.status == PaymentStatus.pending.value)
    ) or 0
    paid_payments = await session.scalar(
        select(func.count(Payment.id)).where(Payment.status == PaymentStatus.paid.value)
    ) or 0
    active_subscriptions = await session.scalar(
        select(func.count(Subscription.id)).where(
            Subscription.status == SubscriptionStatus.active.value
        )
    ) or 0
    failed_subscriptions = await session.scalar(
        select(func.count(Subscription.id)).where(
            Subscription.status == SubscriptionStatus.failed.value
        )
    ) or 0

    text = ru.ADMIN_STATS.format(
        users_count=users_count,
        pending_payments=pending_payments,
        paid_payments=paid_payments,
        active_subscriptions=active_subscriptions,
        failed_subscriptions=failed_subscriptions,
    )
    if call.message:
        await call.message.edit_text(text, reply_markup=admin_menu_keyboard())
    await call.answer()


@router.callback_query(lambda call: call.data == "admin:payments:pending")
async def admin_pending_payments(
    call: CallbackQuery,
    session: AsyncSession,
    settings: Settings,
) -> None:
    if not is_admin(call.from_user.id if call.from_user else None, settings):
        await call.answer(ru.ADMIN_DENIED, show_alert=True)
        return

    result = await session.execute(
        select(Payment)
        .where(Payment.status == PaymentStatus.pending.value)
        .options(selectinload(Payment.user), selectinload(Payment.subscription))
        .order_by(Payment.created_at.desc())
        .limit(10)
    )
    payments = list(result.scalars().all())
    if not call.message:
        return
    if not payments:
        await call.message.edit_text(ru.ADMIN_NO_PENDING_PAYMENTS, reply_markup=admin_menu_keyboard())
        await call.answer()
        return

    lines = ["🧾 Платежи, ожидающие подтверждения:"]
    for payment in payments:
        username = payment.user.username if payment.user and payment.user.username else "без username"
        lines.append(
            f"\n#{payment.id} · {payment.amount:g} {payment.currency}"
            f"\nПользователь: {payment.user.telegram_id if payment.user else 'unknown'} @{username}"
            f"\nСоздан: {payment.created_at:%d.%m.%Y %H:%M}"
        )
    await call.message.edit_text(
        "\n".join(lines),
        reply_markup=admin_pending_payments_keyboard(payments),
    )
    await call.answer()


@router.callback_query(lambda call: call.data and call.data.startswith("admin:payment:confirm:"))
async def admin_confirm_payment_callback(
    call: CallbackQuery,
    session: AsyncSession,
    settings: Settings,
) -> None:
    if not is_admin(call.from_user.id if call.from_user else None, settings):
        await call.answer(ru.ADMIN_DENIED, show_alert=True)
        return
    if not call.data:
        return
    payment_id = int(call.data.rsplit(":", maxsplit=1)[1])
    payment_confirmed, provisioned, text, payment = await confirm_payment_by_id(payment_id, session, settings)
    if call.message:
        await call.message.edit_text(text, reply_markup=admin_menu_keyboard())
    if payment_confirmed and payment and payment.user:
        user_text = (
            ru.USER_PAYMENT_CONFIRMED.format(payment_id=payment.id)
            if provisioned
            else ru.USER_PAYMENT_PENDING_PROVISIONING.format(payment_id=payment.id)
        )
        await call.bot.send_message(payment.user.telegram_id, user_text)
    await call.answer("Готово" if payment_confirmed else "Не подтверждено", show_alert=not payment_confirmed)


@router.message(Command("confirm_payment"))
async def confirm_payment(message: Message, session: AsyncSession, settings: Settings) -> None:
    if not is_admin(message.from_user.id if message.from_user else None, settings):
        await message.answer(ru.ADMIN_DENIED)
        return
    parts = (message.text or "").split()
    if len(parts) != 2 or not parts[1].isdigit():
        await message.answer("Использование: /confirm_payment <payment_id>")
        return

    payment_confirmed, provisioned, text, payment = await confirm_payment_by_id(
        int(parts[1]), session, settings
    )
    await message.answer(text)
    if payment_confirmed and payment and payment.user:
        user_text = (
            ru.USER_PAYMENT_CONFIRMED.format(payment_id=payment.id)
            if provisioned
            else ru.USER_PAYMENT_PENDING_PROVISIONING.format(payment_id=payment.id)
        )
        await message.bot.send_message(payment.user.telegram_id, user_text)