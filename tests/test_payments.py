from decimal import Decimal

import pytest

from app.payments.manual import ManualPaymentProvider


@pytest.mark.asyncio
async def test_manual_provider_creates_invoice() -> None:
    provider = ManualPaymentProvider()

    invoice = await provider.create_invoice(
        amount=Decimal("199.00"),
        currency="RUB",
        metadata={"payment_id": 42},
    )

    assert invoice.provider == "manual"
    assert invoice.provider_payment_id == "manual-42"
    assert invoice.amount == Decimal("199.00")
    assert invoice.currency == "RUB"
