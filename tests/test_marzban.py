import pytest

httpx = pytest.importorskip("httpx")

from app.config import Settings  # noqa: E402
from app.integrations.marzban import MarzbanClient, MarzbanUserPayload  # noqa: E402


class MockTransport(httpx.AsyncBaseTransport):
    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        if request.url.path == "/api/admin/token":
            return httpx.Response(200, json={"access_token": "token"}, request=request)
        if request.url.path == "/api/user":
            return httpx.Response(
                200,
                json={"username": "tg_1", "subscription_url": "https://sub.example/tg_1"},
                request=request,
            )
        if request.url.path == "/api/user/tg_1":
            return httpx.Response(
                200,
                json={"username": "tg_1", "subscription_url": "https://sub.example/tg_1"},
                request=request,
            )
        return httpx.Response(404, request=request)


@pytest.mark.asyncio
async def test_marzban_client_auth_and_create_user() -> None:
    settings = Settings(
        marzban_base_url="https://panel.example.com",
        marzban_username="admin",
        marzban_password="password",
    )
    async_client = httpx.AsyncClient(
        base_url="https://panel.example.com", transport=MockTransport()
    )
    client = MarzbanClient(settings, async_client)

    created = await client.create_user(
        MarzbanUserPayload(
            username="tg_1",
            expire_at=None,
            data_limit_bytes=None,
            note="test",
        )
    )
    link = await client.get_subscription_link("tg_1")

    assert created["username"] == "tg_1"
    assert link == "https://sub.example/tg_1"
