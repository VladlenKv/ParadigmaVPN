import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertRuntimeConfig } from './config.js';
import { query, closeDb } from './db.js';

assertRuntimeConfig();

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationDir = path.join(rootDir, 'database');

try {
  const files = (await fs.readdir(migrationDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationDir, file), 'utf8');
    await query(sql);
    console.log(`Applied ${file}`);
  }
} finally {
  await closeDb();
}
