# Marzban Integration

Required env:

- `MARZBAN_BASE_URL`
- `MARZBAN_USERNAME`
- `MARZBAN_PASSWORD`
- `MARZBAN_VERIFY_SSL`
- optional defaults for proxy inbounds, data limit and expiry

Implemented client methods:

- `authenticate()`
- `create_user(...)`
- `get_user(username)`
- `update_user(username, ...)`
- `disable_user(username)` / `revoke_user(username)`
- `get_subscription_link(username)`
- `get_user_usage(username)`
- `reset_user_traffic(username)`
- `healthcheck()`

Before production, open the target panel OpenAPI docs:

- `https://<MARZBAN_DOMAIN>/docs`
- `https://<MARZBAN_DOMAIN>/redoc`

If endpoint paths or payload fields differ, update only `app/integrations/marzban.py`.
