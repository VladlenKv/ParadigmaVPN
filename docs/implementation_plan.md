# Implementation Plan

## MVP Scope

1. Bootstrap Python/FastAPI/aiogram project for an empty repository.
2. Add secure env-based configuration and `.env.example`.
3. Add PostgreSQL schema with Alembic migration and initial tariffs.
4. Add Marzban API client with token auth, retries and domain exceptions.
5. Add service layer for users, plans, subscriptions, manual payments and provisioning.
6. Add Telegram handlers for `/start`, tariffs, trial, subscription status, instructions, support, FAQ and admin payment confirmation.
7. Add Docker/deployment docs and basic tests.

## Deferred

- Real payment provider integration after provider credentials are known.
- Full admin panel and broadcasts.
- Periodic usage synchronization job.
- QR code delivery.
- Redis-backed rate limiting/FSM.
