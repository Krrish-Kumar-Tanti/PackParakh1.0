import { getDb, initDb, closeDb } from '../src/database/db';

async function testDatabase() {
  console.log('Testing Database initialization and WAL mode...');
  
  // Initialize DB and load schema
  initDb();
  const db = getDb();

  // 1. Verify WAL Mode
  const journalMode = db.pragma('journal_mode', { simple: true });
  console.log(`Journal Mode: ${journalMode}`);
  if (journalMode !== 'wal') {
    throw new Error(`Expected journal_mode to be 'wal', got '${journalMode}'`);
  }

  // 2. Verify Foreign Keys
  const foreignKeys = db.pragma('foreign_keys', { simple: true });
  console.log(`Foreign Keys: ${foreignKeys}`);

  // 3. Verify all 9 tables exist
  const expectedTables = [
    'users',
    'brands',
    'audit_sessions',
    'scans',
    'violations',
    'ecom_metadata',
    'seizure_memos',
    'audit_trail',
    'acknowledgements'
  ];

  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
  const tableNames = rows.map(r => r.name);
  console.log('Created Tables in SQLite:', tableNames);

  for (const table of expectedTables) {
    if (!tableNames.includes(table)) {
      throw new Error(`Missing expected table: ${table}`);
    }
  }

  // 4. Test insert into users & brands
  const testUserId = 'test-user-1';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, name, role, badge_number, state, district)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(testUserId, 'Officer Sharma', 'LMO', 'LMO-DL-2026-44', 'Delhi', 'New Delhi');

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId) as any;
  console.log('Verified user insertion:', user.name, user.role);

  const testBrandId = 'test-brand-sample';
  db.prepare(`
    INSERT OR REPLACE INTO brands (id, name, registration_no, director_name, category, risk_level, total_violations)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(testBrandId, 'Test Sample Foods Pvt Ltd', 'REG-100234', 'Suresh Test', 'FOOD', 'LOW', 0);

  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(testBrandId) as any;
  console.log('Verified brand insertion with Director Accountability:', brand.name, 'Director:', brand.director_name);

  // Clean up
  closeDb();
  console.log('✅ All 9 tables and WAL mode verified successfully!');
}

testDatabase().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
