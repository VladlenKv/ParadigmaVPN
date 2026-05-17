import 'dotenv/config';

const toBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3001),
  publicSiteUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:5173',
  appOrigins: (process.env.APP_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: toBool(process.env.DATABASE_SSL, process.env.NODE_ENV === 'production'),
  jwtSecret: process.env.JWT_SECRET,
  cookieSecure: toBool(process.env.COOKIE_SECURE, process.env.NODE_ENV === 'production'),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
};

export function assertRuntimeConfig() {
  const missing = [];
  if (!config.databaseUrl) missing.push('DATABASE_URL');
  if (!config.jwtSecret || config.jwtSecret.length < 32) missing.push('JWT_SECRET (min 32 chars)');
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
