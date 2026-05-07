from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Payment, PaymentStatus, Plan, Subscription, User


class PaymentService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create_manual_payment(self, user: User, plan: Plan, subscription: Subscription) -> Payment:
        payment = Payment(
            user_id=user.id,
            subscription_id=subscription.id,
            provider="manual",
            amount=Decimal(plan.price_amount),
            currency=plan.currency,
            status=PaymentStatus.pending.value,
            payload_json={"plan_code": plan.code},
        )
        self._session.add(payment)
        await self._session.flush()
        payment.provider_payment_id = f"manual-{payment.id}"
        await self._session.flush()
        return payment

    async def mark_paid(self, payment: Payment) -> Payment:
        if payment.status == PaymentStatus.paid.value:
            return payment
        payment.status = PaymentStatus.paid.value
        await self._session.flush()
        return payment
