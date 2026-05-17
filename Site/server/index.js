import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { assertRuntimeConfig, config } from './config.js';
import { query } from './db.js';
import {
  clearSessionCookies,
  createSession,
  requireAdmin,
  requireCsrf,
  requireOwner,
  setSessionCookies,
  verifyPassword,
} from './auth.js';
import {
  formatRequestNotification,
  handleTelegramUpdate,
  sendTelegramMessage,
  verifyTelegramWebhook,
} from './telegram.js';

assertRuntimeConfig();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

app.set('trust proxy', 1);
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false,
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.appOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '128kb' }));
app.use(cookieParser());

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
});

const requestSchema = z.object({
  type: z.enum(['support', 'order', 'callback']).default('support'),
  name: z.string().trim().min(1).max(120).optional().or(z.literal('')),
  email: z.string().trim().email().max(320).optional().or(z.literal('')),
  telegramUsername: z.string().trim().max(64).optional().or(z.literal('')),
  message: z.string().trim().min(5).max(4000),
});

const statusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'done', 'archived']),
});

app.get('/api/health', async (_req, res) => {
  await query('SELECT 1');
  res.json({ ok: true });
});

app.post('/api/requests', publicLimiter, async (req, res, next) => {
  try {
    const data = requestSchema.parse(req.body);
    const result = await query(
      `INSERT INTO requests (type, name, email, telegram_username, message, source)
       VALUES ($1, NULLIF($2, ''), NULLIF($3, ''), NULLIF($4, ''), $5, 'site')
       RETURNING id, type, name, email, telegram_username, message, status, created_at`,
      [data.type, data.name || '', data.email || '', data.telegramUsername || '', data.message],
    );
    const request = result.rows[0];
    sendTelegramMessage(formatRequestNotification(request)).catch((error) => {
      console.error(error);
    });
    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await query(
      'SELECT id, email, name, role, password_hash, is_active FROM administrators WHERE email = $1',
      [email.toLowerCase()],
    );
    const admin = result.rows[0];
    if (!admin || !admin.is_active || !(await verifyPassword(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createSession(admin);
    const csrfToken = setSessionCookies(res, token);
    await query('UPDATE administrators SET last_login_at = now() WHERE id = $1', [admin.id]);
    await logAdminAction(req, admin.id, 'admin.login', 'administrator', admin.id);
    res.json({ admin: sanitizeAdmin(admin), csrfToken });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/logout', requireAdmin, requireCsrf, async (req, res) => {
  await logAdminAction(req, req.admin.id, 'admin.logout', 'administrator', req.admin.id);
  clearSessionCookies(res);
  res.json({ ok: true });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ admin: sanitizeAdmin(req.admin) });
});

app.get('/api/admin/requests', requireAdmin, async (_req, res) => {
  const result = await query(
    `SELECT id, type, status, name, email, telegram_username, message, source, created_at, updated_at
     FROM requests
     ORDER BY created_at DESC
     LIMIT 200`,
  );
  res.json({ requests: result.rows });
});

app.patch('/api/admin/requests/:id/status', requireAdmin, requireCsrf, async (req, res, next) => {
  try {
    const { status } = statusSchema.parse(req.body);
    const result = await query(
      `UPDATE requests SET status = $1, updated_at = now()
       WHERE id = $2
       RETURNING id, type, status, name, email, telegram_username, message, source, created_at, updated_at`,
      [status, req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Request not found' });
    await logAdminAction(req, req.admin.id, 'request.status_update', 'request', req.params.id, { status });
    res.json({ request: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/requests/:id', requireAdmin, requireCsrf, async (req, res) => {
  const result = await query(
    `UPDATE requests SET status = 'archived', updated_at = now()
     WHERE id = $1
     RETURNING id`,
    [req.params.id],
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Request not found' });
  await logAdminAction(req, req.admin.id, 'request.archive', 'request', req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/users', requireAdmin, requireOwner, async (_req, res) => {
  const result = await query(
    `SELECT id, email, telegram_id, telegram_username, display_name, role, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT 200`,
  );
  res.json({ users: result.rows });
});

app.get('/api/admin/logs', requireAdmin, async (_req, res) => {
  const result = await query(
    `SELECT l.id, l.action, l.entity_type, l.entity_id, l.ip_address, l.user_agent, l.metadata, l.created_at,
            a.email AS admin_email
     FROM admin_action_logs l
     LEFT JOIN administrators a ON a.id = l.admin_id
     ORDER BY l.created_at DESC
     LIMIT 200`,
  );
  res.json({ logs: result.rows });
});

app.post('/api/telegram/webhook', verifyTelegramWebhook, async (req, res, next) => {
  try {
    const result = await handleTelegramUpdate(req.body);
    res.json({ ok: true, ...result });
  } catch (error) {
    next(error);
  }
});

if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(rootDir, 'dist')));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(rootDir, 'dist', 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: error.flatten() });
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});

function sanitizeAdmin(admin) {
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

async function logAdminAction(req, adminId, action, entityType, entityId, metadata = {}) {
  await query(
    `INSERT INTO admin_action_logs (admin_id, action, entity_type, entity_id, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [adminId, action, entityType, entityId, req.ip, req.get('user-agent') || null, metadata],
  );
}
