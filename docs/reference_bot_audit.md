# Reference Bot Audit

Reference: https://t.me/Horizonvps_bot

## Result

Automated inspection of the Telegram bot was not performed in this environment: there is no Telegram user session and no safe way to interact with `/start`, buttons, payment steps or possible captcha/manually gated flows.

No claims about the exact texts, buttons or transitions of `@Horizonvps_bot` are made here.

## Manual Checklist

- Start bot with `/start`.
- Capture welcome text and main menu buttons.
- Open tariff list and record plan names, prices, limits and button labels.
- Open trial flow and record eligibility messages.
- Open subscription status screen with and without active subscription.
- Check instruction sections for iOS, Android, Windows, macOS and Linux.
- Check support, site and FAQ links.
- Check payment flow until the last safe step before real payment.
- Record error states: unavailable payment, expired subscription, repeated trial, missing config.

## Adaptation Note

Paradigma VPN UI texts and buttons are isolated in `app/bot/texts/ru.py` and `app/bot/keyboards/common.py`, so they can be replaced after a manual reference audit without rewriting business logic.
