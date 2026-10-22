-- ============================================================================
-- PackParakh (पैक-परख) — Core Database Schema (9 Tables)
-- Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
-- Engine: SQLite with WAL (Write-Ahead Logging) Mode
-- ============================================================================

-- 1. Users & Officers
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('LMO', 'MSME', 'CITIZEN', 'ADMIN')) NOT NULL,
    badge_number TEXT,
    state TEXT,
    district TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Brands & Manufacturers (with Rule 27 Director Accountability - GSR 418(E) 2026)
CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    registration_no TEXT,
    director_name TEXT, -- Rule 27 Director Accountability (GSR 418(E) 2026)
    category TEXT,
    risk_level TEXT CHECK(risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'LOW',
    total_violations INTEGER DEFAULT 0
);

-- 3. Audit Sessions
CREATE TABLE IF NOT EXISTS audit_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    audit_mode TEXT CHECK(audit_mode IN ('PHYSICAL', 'ECOM', 'ARTWORK')) NOT NULL,
    location_lat REAL,
    location_lng REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Scans
CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES audit_sessions(id),
    brand_id TEXT REFERENCES brands(id),
    product_name TEXT,
    category TEXT CHECK(category IN ('FOOD', 'COSMETICS', 'ELECTRONICS', 'GENERAL')) DEFAULT 'GENERAL',
    source TEXT CHECK(source IN ('LIVE_CAMERA', 'DEMO_CACHED', 'SAMPLE_SEED')) DEFAULT 'LIVE_CAMERA',
    reference_width_mm REAL, -- Tier-B declared package width for optical scaling
    image_url TEXT,
    declared_mrp REAL,
    declared_net_qty REAL,
    declared_net_unit TEXT,
    calculated_usp TEXT,
    compliance_score INTEGER NOT NULL,
    verdict TEXT CHECK(verdict IN ('PASS', 'FAIL', 'REVIEW')) NOT NULL,
    sha256_hash TEXT NOT NULL,
    is_officer_confirmed INTEGER DEFAULT 0, -- HITL Review Gate sign-off flag
    micrometer_reading_mm REAL,
    officer_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Violations Log
CREATE TABLE IF NOT EXISTS violations (
    id TEXT PRIMARY KEY,
    scan_id TEXT REFERENCES scans(id),
    rule_number TEXT NOT NULL, -- e.g. "Rule 6(11)"
    rule_title TEXT NOT NULL,
    description TEXT NOT NULL,
    penalty_section TEXT NOT NULL, -- e.g. "Section 36(1) LM Act"
    severity TEXT CHECK(severity IN ('WARNING', 'MODERATE', 'CRITICAL')) NOT NULL,
    score_deduction INTEGER NOT NULL
);

-- 6. E-Commerce Metadata
CREATE TABLE IF NOT EXISTS ecom_metadata (
    id TEXT PRIMARY KEY,
    scan_id TEXT REFERENCES scans(id),
    platform TEXT NOT NULL, -- Amazon, Blinkit, Zepto, Flipkart
    product_url TEXT NOT NULL,
    asin_sku TEXT,
    seller_name TEXT,
    coo_declared BOOLEAN NOT NULL,
    coo_filter_present BOOLEAN DEFAULT 0, -- Feb 2026 COO Filter Mandate
    aeo_bonded_declared BOOLEAN DEFAULT 0 -- GSR 418(E) Rule 4 Exp-2
);

-- 7. Officer Action Log & Form-V Seizure Records
CREATE TABLE IF NOT EXISTS seizure_memos (
    id TEXT PRIMARY KEY,
    scan_id TEXT REFERENCES scans(id),
    officer_id TEXT REFERENCES users(id),
    memo_number TEXT UNIQUE NOT NULL,
    premises_name TEXT,
    trader_name TEXT,
    witness_name TEXT,
    pdf_path TEXT,
    qr_code_payload TEXT,
    status TEXT CHECK(status IN ('DRAFTED', 'ISSUED', 'COMPOUNDED', 'COURT_FILED')) DEFAULT 'DRAFTED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Immutable Audit Trail (Section 63 BSA 2023 / 65B Evidence Act)
CREATE TABLE IF NOT EXISTS audit_trail (
    id TEXT PRIMARY KEY,
    scan_id TEXT REFERENCES scans(id),
    event_type TEXT NOT NULL,
    actor_id TEXT,
    sha256_hash TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. e-District Style Acknowledgements & Public Verification Tokens
CREATE TABLE IF NOT EXISTS acknowledgements (
    id TEXT PRIMARY KEY, -- e.g. DOCA/MH/2026/084291
    scan_id TEXT REFERENCES scans(id) ON DELETE CASCADE,
    reference_id TEXT UNIQUE NOT NULL, -- e.g. DOCA/MH/2026/084291-8F3A
    user_id TEXT REFERENCES users(id),
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT CHECK(status IN ('SUBMITTED', 'UNDER_REVIEW', 'ACTION_TAKEN', 'CLOSED')) DEFAULT 'SUBMITTED',
    filed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL, -- filed_at + 7 days (field/LMO) or 14 days (citizen)
    acknowledge_pdf_url TEXT NOT NULL,
    acknowledge_sha256 TEXT NOT NULL,
    channel_email_sent BOOLEAN DEFAULT 0,
    channel_whatsapp_link_generated BOOLEAN DEFAULT 0
);
