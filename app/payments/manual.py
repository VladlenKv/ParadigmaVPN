from decimal import Decimal
from typing import Any

from app.payments.base import Invoice, PaymentProvider


class ManualPaymentProvider(PaymentProvider):
    async def create_invoice(
        self, *, amount: Decimal, currency: str, metadata: dict[str, Any]
    ) -> Invoice:
        return Invoice(
            provider="manual",
            provider_payment_id=f"manual-{metadata['payment_id']}",
            amount=amount,
            currency=currency,
            payload=metadata,
        )

    async def parse_webhook(self, payload: dict[str, Any], signature: str | None) -> dict[str, Any]:
        return payload

    async def get_payment_status(self, provider_payment_id: str) -> str:
        return "pending"
