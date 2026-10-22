import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

let dbInstance: Database.Database | null = null;
let isSeeding = false;

/**
 * Initialize and get SQLite database connection with WAL (Write-Ahead Logging) mode.
 */
export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure database directory exists
  const dbDir = path.dirname(env.DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Connect to SQLite
  dbInstance = new Database(env.DB_PATH, {
    verbose: env.NODE_ENV === 'development' ? undefined : undefined,
  });

  // Enable WAL Mode & performance PRAGMAs
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('synchronous = NORMAL');
  dbInstance.pragma('foreign_keys = ON');

  console.log(`[Database] SQLite connected at: ${env.DB_PATH} (WAL Mode Enabled)`);

  return dbInstance;
}

/**
 * Execute DDL schema.sql to ensure all 9 tables exist.
 */
export function initDb(): void {
  const db = getDb();
  const candidates = [
    path.resolve(__dirname, 'schema.sql'),
    path.resolve(__dirname, '../../src/database/schema.sql'),
    path.resolve(process.cwd(), 'src/database/schema.sql'),
    path.resolve(process.cwd(), 'server/src/database/schema.sql'),
  ];
  const schemaPath = candidates.find(p => fs.existsSync(p));

  if (schemaPath) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('[Database] Core 9-table schema initialized successfully.');

    // Auto-seed if database is freshly created or empty
    if (!isSeeding) {
      const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
      if (userCount.count === 0) {
        isSeeding = true;
        console.log('[Database] Empty database detected. Auto-seeding initial master records...');
        try {
          const { seedDatabase } = require('./seed');
          seedDatabase();
        } catch (err) {
          console.warn('[Database] Auto-seed warning:', err);
        } finally {
          isSeeding = false;
        }
      }
    }
  } else {
    console.error(`[Database] Schema file not found in candidate paths:`, candidates);
  }
}

/**
 * Gracefully close database connection.
 */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('[Database] SQLite connection closed.');
  }
}

export default getDb;
