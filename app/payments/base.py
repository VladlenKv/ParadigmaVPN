from abc import ABC, abstractmethod
from dataclasses import dataclass
from decimal import Decimal
from typing import Any


@dataclass(frozen=True)
class Invoice:
    provider: str
    provider_payment_id: str
    amount: Decimal
    currency: str
    payment_url: str | None = None
    payload: dict[str, Any] | None = None


class PaymentProvider(ABC):
    @abstractmethod
    async def create_invoice(self, *, amount: Decimal, currency: str, metadata: dict[str, Any]) -> Invoice:
        raise NotImplementedError

    @abstractmethod
    async def parse_webhook(self, payload: dict[str, Any], signature: str | None) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def get_payment_status(self, provider_payment_id: str) -> str:
        raise NotImplementedError
