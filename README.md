# Paradigma VPN

Telegram bot and FastAPI backend for selling and issuing VPN subscriptions through Marzban.

## Stack

- Python 3.12
- FastAPI
- aiogram 3
- SQLAlchemy 2 async
- Alembic
- PostgreSQL
- Redis placeholder for cache/FSM/rate limits
- httpx Marzban API client

## Local Run

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app alembic upgrade head
```

Fill `.env` before using the bot:

- `BOT_TOKEN`
- `WEBHOOK_SECRET`
- `ADMIN_TELEGRAM_IDS`
- `MARZBAN_BASE_URL`
- `MARZBAN_USERNAME`
- `MARZBAN_PASSWORD`
- public/support/legal URLs

Health endpoint:

```bash
curl http://localhost:8000/health
```

Telegram webhook path defaults to `/telegram/webhook`. Set it in Telegram with the secret token from `WEBHOOK_SECRET`.

## Manual Payments MVP

The first provider is `manual`:

1. User selects a tariff.
2. Bot creates a pending payment.
3. Admin confirms it with `/confirm_payment <payment_id>`.
4. Backend creates or updates the Marzban user and stores the subscription link.

## Tests

```bash
python -m compileall app
pytest
ruff check .
```
