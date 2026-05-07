from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.db.models import Plan, Subscription, SubscriptionStatus, User
from app.services.provisioning import gb_to_bytes, marzban_username_for


class SubscriptionService:
    def __init__(self, session: AsyncSession, settings: Settings) -> None:
        self._session = session
        self._settings = settings

    async def create_pending_for_plan(self, user: User, plan: Plan) -> Subscription:
        subscription = Subscription(
            user_id=user.id,
            plan_id=plan.id,
            status=SubscriptionStatus.pending_payment.value,
            marzban_username=marzban_username_for(user),
            traffic_limit_bytes=gb_to_bytes(plan.traffic_limit_gb),
        )
        self._session.add(subscription)
        await self._session.flush()
        return subscription

    async def create_trial(self, user: User) -> Subscription | None:
        if not self._settings.trial_enabled or await self.has_trial(user):
            return None
        now = datetime.now(timezone.utc)
        subscription = Subscription(
            user_id=user.id,
            plan_id=None,
            status=SubscriptionStatus.trial.value,
            marzban_username=marzban_username_for(user),
            starts_at=now,
            expires_at=now + timedelta(days=self._settings.trial_duration_days),
            traffic_limit_bytes=gb_to_bytes(self._settings.trial_traffic_limit_gb),
        )
        self._session.add(subscription)
        await self._session.flush()
        return subscription

    async def latest_for_user(self, user: User) -> Subscription | None:
        result = await self._session.execute(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .order_by(Subscription.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def has_trial(self, user: User) -> bool:
        result = await self._session.execute(
            select(Subscription.id)
            .where(
                Subscription.user_id == user.id,
                Subscription.status.in_(
                    [SubscriptionStatus.trial.value, SubscriptionStatus.active.value]
                ),
            )
            .limit(1)
        )
        return result.scalar_one_or_none() is not None
