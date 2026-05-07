# Decisions

## Empty Repository

The repository contained only the Codex prompt, so the default stack from the prompt was used: Python 3.12, FastAPI, aiogram 3, SQLAlchemy async, Alembic, PostgreSQL, Redis, Docker and httpx.

## Marzban API Paths

The client uses common Marzban paths such as `/api/admin/token`, `/api/user/{username}` and `/api/system`. Paths are centralized in `app/integrations/marzban.py` because the target Marzban panel domain and live OpenAPI schema were not provided.

## Payments

The MVP uses a manual payment provider and admin confirmation command. This keeps subscription issuance idempotent enough for first deployment while avoiding premature coupling to an unknown payment gateway.

## Website

No existing site was present. A minimal JSON landing endpoint is exposed at `/`, with all public links sourced from env. A full marketing site is deferred.
