# Paradigma VPN Site

React/Vite frontend with a Node.js/Express API, PostgreSQL storage, protected admin panel, and Telegram notifications.

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, Helmet, CORS, rate limiting, Zod validation
- Database: PostgreSQL via `DATABASE_URL`
- Auth: HTTP-only JWT cookie, CSRF token for admin mutations, bcrypt password hashes
- Telegram: Bot API notifications and protected webhook endpoint

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and set real values:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and create a database, for example `paradigma_vpn`.

4. Apply schema and create the first owner admin:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Run API and frontend in two terminals:

   ```bash
   npm run dev:api
   npm run dev
   ```

Frontend: `http://localhost:5173`
API: `http://localhost:3001`
Admin panel: `http://localhost:5173/admin/login`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `DATABASE_SSL`: set to `true` in production when the provider requires SSL.
- `JWT_SECRET`: long random secret, at least 32 characters.
- `COOKIE_SECURE`: `true` behind HTTPS in production.
- `APP_ORIGIN`: allowed browser origin, for example `https://example.com`.
- `PUBLIC_SITE_URL`: public URL used in docs and webhook setup.
- `TELEGRAM_BOT_TOKEN`: token from BotFather.
- `TELEGRAM_CHAT_ID`: admin/support chat ID for site notifications.
- `TELEGRAM_WEBHOOK_SECRET`: random secret passed to Telegram webhook setup.
- `VITE_TELEGRAM_BOT_USERNAME`: bot username used by the frontend Telegram button.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: first admin seed values.

Never commit `.env`; it is ignored by `.gitignore`.

## Telegram Setup

1. Create a bot with BotFather and put the token into `TELEGRAM_BOT_TOKEN`.
2. Put the support/admin chat ID into `TELEGRAM_CHAT_ID`.
3. Generate `TELEGRAM_WEBHOOK_SECRET`.
4. After deploy, register the webhook:

   ```bash
   curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -d "url=https://YOUR_DOMAIN/api/telegram/webhook" \
     -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
   ```

The API checks `X-Telegram-Bot-Api-Secret-Token` on every webhook request. Plain Telegram messages that are not commands are stored as `requests` with source `telegram`.

## Admin Panel

The admin API is protected by:

- HTTP-only session cookie
- CSRF header for state-changing requests
- bcrypt password hashes
- rate limiting on login
- role guard for owner-only user management endpoint

Available functions:

- Sign in and sign out
- View site and Telegram requests
- Change request status
- Archive requests
- View admin action logs

## Deployment

GitHub Pages is not suitable for the full product because this project now has a backend, PostgreSQL, secure cookies, and Telegram webhook endpoint. Use a platform that can run Node.js services and attach PostgreSQL:

- Render: Web Service + PostgreSQL
- Railway: Node service + PostgreSQL
- Fly.io: Node app + managed/external PostgreSQL
- VPS: Node process behind Nginx with HTTPS and PostgreSQL

Typical production commands:

```bash
npm install
npm run build
npm run db:migrate
npm run db:seed
npm start
```

Set `NODE_ENV=production`, `COOKIE_SECURE=true`, `DATABASE_SSL=true` if required by the database provider, and `APP_ORIGIN=https://YOUR_DOMAIN`.

## Security Notes

- No secrets are stored in source code.
- SQL uses parameterized queries.
- Request bodies are validated before database writes.
- Helmet security headers are enabled on the API.
- Admin mutations require CSRF token.
- Public request and login endpoints are rate-limited.
- The previous generated external tracking scripts were removed from `index.html`.
