import pytest

pydantic_settings = pytest.importorskip("pydantic_settings")

from app.config import Settings  # noqa: E402


def test_settings_parses_admin_ids() -> None:
    settings = Settings(admin_telegram_ids="1, 2,3")

    assert settings.admin_telegram_ids == {1, 2, 3}


def test_settings_builds_webhook_url() -> None:
    settings = Settings(app_base_url="https://bot.example.com/", webhook_path="/telegram/webhook")

    assert settings.webhook_url == "https://bot.example.com/telegram/webhook"
