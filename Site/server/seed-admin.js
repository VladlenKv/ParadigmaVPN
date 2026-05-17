import { assertRuntimeConfig } from './config.js';
import { query, closeDb } from './db.js';
import { hashPassword } from './auth.js';

assertRuntimeConfig();

const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const name = process.env.ADMIN_NAME || 'Site Admin';

if (!email || !password || password.length < 12) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD with at least 12 characters are required');
}

try {
  const passwordHash = await hashPassword(password);
  await query(
    `INSERT INTO administrators (email, name, password_hash, role)
     VALUES ($1, $2, $3, 'owner')
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, updated_at = now()`,
    [email, name, passwordHash],
  );
  console.log(`Seeded owner admin: ${email}`);
} finally {
  await closeDb();
}
