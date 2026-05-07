from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    bot_token: SecretStr = Field(default=SecretStr(""))
    app_env: Literal["local", "dev", "staging", "production"] = "local"
    app_base_url: AnyHttpUrl = "https://bot.paradigma-vpn.example"
    webhook_secret: SecretStr = Field(default=SecretStr(""))
    webhook_path: str = "/telegram/webhook"

    database_url: str = "postgresql+asyncpg://paradigma:paradigma@postgres:5432/paradigma_vpn"
    redis_url: str | None = "redis://redis:6379/0"

    marzban_base_url: AnyHttpUrl = "https://panel.paradigma-vpn.example"
    marzban_username: str = ""
    marzban_password: SecretStr = Field(default=SecretStr(""))
    marzban_verify_ssl: bool = True
    marzban_default_proxy_inbounds: str | None = None
    marzban_default_data_limit_gb: int | None = None
    marzban_default_expire_days: int | None = None

    public_site_url: AnyHttpUrl = "https://paradigma-vpn.example"
    support_url: AnyHttpUrl = "https://t.me/paradigma_support"
    terms_url: AnyHttpUrl = "https://paradigma-vpn.example/terms"
    privacy_url: AnyHttpUrl = "https://paradigma-vpn.example/privacy"

    payment_provider: Literal["manual"] = "manual"
    payment_webhook_secret: SecretStr = Field(default=SecretStr(""))
    admin_telegram_ids: set[int] = Field(default_factory=set)

    trial_enabled: bool = True
    trial_duration_days: int = 3
    trial_traffic_limit_gb: int = 10

    @field_validator("webhook_path")
    @classmethod
    def webhook_path_must_start_with_slash(cls, value: str) -> str:
        if not value.startswith("/"):
            msg = "WEBHOOK_PATH must start with /"
            raise ValueError(msg)
        return value

    @field_validator("admin_telegram_ids", mode="before")
    @classmethod
    def parse_admin_ids(cls, value: object) -> set[int]:
        if value in (None, ""):
            return set()
        if isinstance(value, set):
            return value
        if isinstance(value, str):
            return {int(item.strip()) for item in value.split(",") if item.strip()}
        if isinstance(value, list | tuple):
            return {int(item) for item in value}
        msg = "ADMIN_TELEGRAM_IDS must be comma-separated integers"
        raise ValueError(msg)

    @property
    def webhook_url(self) -> str:
        return f"{str(self.app_base_url).rstrip('/')}{self.webhook_path}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
