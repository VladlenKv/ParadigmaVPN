from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.bot.texts import ru
from app.config import Settings
from app.db.models import Payment, Plan
from app.integrations.marzban import MarzbanClient, MarzbanError
from app.services.payments import PaymentService
from app.services.provisioning import MarzbanProvisioningService

router = Router()


@router.message(Command("confirm_payment"))
async def confirm_payment(message: Message, session: AsyncSession, settings: Settings) -> None:
    if not message.from_user or message.from_user.id not in settings.admin_telegram_ids:
        await message.answer(ru.ADMIN_DENIED)
        return
    parts = (message.text or "").split()
    if len(parts) != 2 or not parts[1].isdigit():
        await message.answer("Использование: /confirm_payment <payment_id>")
        return
    payment = await session.get(Payment, int(parts[1]))
    if not payment or not payment.subscription:
        await message.answer(ru.PAYMENT_NOT_FOUND)
        return
    await PaymentService(session).mark_paid(payment)
    plan = await session.scalar(select(Plan).where(Plan.id == payment.subscription.plan_id))
    if not plan:
        await message.answer("Тариф для платежа не найден.")
        return
    client = MarzbanClient(settings)
    try:
        await MarzbanProvisioningService(client).provision(payment.user, payment.subscription, plan)
    except MarzbanError:
        await session.commit()
        await message.answer(ru.PROVISIONING_FAILED.format(payment_id=payment.id))
        return
    finally:
        await client.aclose()

    await session.commit()
    await message.answer(ru.PAYMENT_CONFIRMED.format(payment_id=payment.id))
