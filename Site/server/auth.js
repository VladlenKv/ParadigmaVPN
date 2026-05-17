import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { query } from './db.js';

const cookieName = 'paradigma_admin_session';

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function createSession(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    config.jwtSecret,
    { expiresIn: '8h', issuer: 'paradigma-vpn-site' },
  );
}

export function setSessionCookies(res, token) {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  const maxAge = 8 * 60 * 60 * 1000;
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    maxAge,
  });
  res.cookie('paradigma_csrf', csrfToken, {
    sameSite: 'strict',
    secure: config.cookieSecure,
    maxAge,
  });
  return csrfToken;
}

export function clearSessionCookies(res) {
  res.clearCookie(cookieName);
  res.clearCookie('paradigma_csrf');
}

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[cookieName];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const payload = jwt.verify(token, config.jwtSecret, { issuer: 'paradigma-vpn-site' });
    const result = await query(
      'SELECT id, email, name, role, is_active FROM administrators WHERE id = $1',
      [payload.sub],
    );
    const admin = result.rows[0];
    if (!admin || !admin.is_active) return res.status(401).json({ error: 'Unauthorized' });
    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireOwner(req, res, next) {
  if (req.admin?.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
  next();
}

export function requireCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const cookieToken = req.cookies?.paradigma_csrf;
  const headerToken = req.get('x-csrf-token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}
