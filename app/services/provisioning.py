from datetime import datetime, timedelta, timezone

from app.db.models import Plan, Subscription, SubscriptionStatus, User
from app.integrations.marzban import MarzbanClient, MarzbanError, MarzbanUserPayload


def marzban_username_for(user: User, subscription_id: int | None = None) -> str:
    if subscription_id is None:
        return f"tg_{user.telegram_id}"
    return f"tg_{user.telegram_id}_{subscription_id}"


def gb_to_bytes(value: int | None) -> int | None:
    if value is None:
        return None
    return value * 1024 * 1024 * 1024


class MarzbanProvisioningService:
    def __init__(self, client: MarzbanClient) -> None:
        self._client = client

    async def provision(self, user: User, subscription: Subscription, plan: Plan) -> Subscription:
        now = datetime.now(timezone.utc)
        base = subscription.expires_at if subscription.expires_at and subscription.expires_at > now else now
        starts_at = subscription.starts_at or now
        expires_at = base + timedelta(days=plan.duration_days)
        traffic_limit = gb_to_bytes(plan.traffic_limit_gb)
        username = subscription.marzban_username or marzban_username_for(user)

        payload = MarzbanUserPayload(
            username=username,
            expire_at=expires_at,
            data_limit_bytes=traffic_limit,
            note=f"Paradigma VPN Telegram user {user.telegram_id}",
        )
        try:
            try:
                await self._client.get_user(username)
                await self._client.update_user(username, payload)
            except MarzbanError:
                await self._client.create_user(payload)
            link = await self._client.get_subscription_link(username)
        except MarzbanError:
            subscription.status = SubscriptionStatus.failed.value
            raise

        subscription.status = SubscriptionStatus.active.value
        subscription.marzban_username = username
        subscription.subscription_url = link
        subscription.starts_at = starts_at
        subscription.expires_at = expires_at
        subscription.traffic_limit_bytes = traffic_limit
        return subscription
