import { config } from './config.js';
import { query } from './db.js';

export async function sendTelegramMessage(text) {
  if (!config.telegramBotToken || !config.telegramChatId) return { skipped: true };

  const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.telegramChatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram sendMessage failed: ${response.status} ${body}`);
  }

  return response.json();
}

export function formatRequestNotification(request) {
  return [
    '<b>New site request</b>',
    `Type: ${escapeHtml(request.type)}`,
    `Name: ${escapeHtml(request.name || '-')}`,
    `Email: ${escapeHtml(request.email || '-')}`,
    `Telegram: ${escapeHtml(request.telegram_username || '-')}`,
    '',
    escapeHtml(request.message),
  ].join('\n');
}

export function verifyTelegramWebhook(req, res, next) {
  if (!config.telegramWebhookSecret) {
    return res.status(503).json({ error: 'Telegram webhook is not configured' });
  }
  const secret = req.get('x-telegram-bot-api-secret-token');
  if (secret !== config.telegramWebhookSecret) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }
  next();
}

export async function handleTelegramUpdate(update) {
  const message = update.message || update.edited_message;
  const chat = message?.chat;
  const text = message?.text || '';
  let createdRequestId = null;

  if (chat && text && !text.startsWith('/')) {
    const created = await query(
      `INSERT INTO requests (type, name, telegram_username, message, source, metadata)
       VALUES ('telegram', $1, $2, $3, 'telegram', $4)
       RETURNING id`,
      [
        [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') || null,
        message.from?.username || null,
        text.slice(0, 4000),
        { chat_id: chat.id, message_id: message.message_id },
      ],
    );
    createdRequestId = created.rows[0].id;
  }

  await query(
    `INSERT INTO telegram_events (update_id, chat_id, message_text, payload, created_request_id)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (update_id) DO NOTHING`,
    [update.update_id, chat?.id || null, text || null, update, createdRequestId],
  );

  return { createdRequestId };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
