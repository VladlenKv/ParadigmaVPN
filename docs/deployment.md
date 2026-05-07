# Deployment

## Environment

```bash
cp .env.example .env
```

Fill:

- Telegram bot token and admin IDs.
- Public app domain in `APP_BASE_URL`.
- Telegram webhook secret and path.
- Marzban panel URL and credentials.
- Public site, support, terms and privacy links.
- Payment provider settings.

## Start

```bash
docker compose up -d --build
docker compose exec app alembic upgrade head
```

## Telegram Webhook

Webhook URL:

```text
https://<APP_DOMAIN>/telegram/webhook
```

Set Telegram secret token to the same value as `WEBHOOK_SECRET`.

## Marzban Check

Open:

```text
https://<MARZBAN_DOMAIN>/docs
https://<MARZBAN_DOMAIN>/redoc
```

Then check backend readiness:

```bash
curl https://<APP_DOMAIN>/marzban/health
```

## Tariffs

Initial tariffs are inserted by the first Alembic migration:

- Start
- Plus
- Premium

Change prices and limits directly in `plans` or add an admin editor later.

## Logs

```bash
docker compose logs -f app
```

Sensitive values are redacted by the application logging filter.

## Database Backup

```bash
docker compose exec postgres pg_dump -U paradigma paradigma_vpn > backup.sql
```
