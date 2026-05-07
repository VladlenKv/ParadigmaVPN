from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Plan


class PlanService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_active(self) -> list[Plan]:
        result = await self._session.execute(
            select(Plan).where(Plan.is_active.is_(True)).order_by(Plan.sort_order, Plan.id)
        )
        return list(result.scalars().all())

    async def get_by_id(self, plan_id: int) -> Plan | None:
        return await self._session.get(Plan, plan_id)
