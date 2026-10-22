// ============================================================================
// PackParakh (पैक-परख) — Core Application & Statutory Constants
// Legal Metrology (Packaged Commodities) Rules, 2011 & Amendments
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// ============================================================================

export const APP_CONSTANTS = {
  APP_NAME: 'PackParakh (पैक-परख)',
  SYSTEM_STATUS: 'OPERATIONAL',
  RULE_ENGINE_VERSION: '2.1',
  TOTAL_RULES_ACTIVE: 24,
  MAX_UPLOAD_SIZE_MB: 15,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],

  // Statutory & System Roles
  ROLES: {
    LMO: 'LMO',         // Legal Metrology Officer (Enforcement authority)
    MSME: 'MSME',       // Brand Manufacturer / Packer (Self-audit)
    CITIZEN: 'CITIZEN', // Consumer / Public Verification
    ADMIN: 'ADMIN',     // National DoCA Oversight
  } as const,

  // Inspection & Audit Modes
  AUDIT_MODES: {
    PHYSICAL: 'PHYSICAL', // Physical retail packaging via camera/scanner
    ECOM: 'ECOM',         // E-commerce listing verification (Amazon, Blinkit, etc.)
    ARTWORK: 'ARTWORK',   // Pre-market digital PDF vector artwork audit
  } as const,

  // Statutory Compliance Verdicts
  VERDICTS: {
    PASS: 'PASS',     // 100% PCR-2011 Compliant
    FAIL: 'FAIL',     // Breaches mandatory statutory rules (Penalty trigger)
    REVIEW: 'REVIEW', // Heuristic / Requires physical micrometer confirmation (HITL)
  } as const,

  // Evidence & Provenance Sources
  SOURCES: {
    LIVE_CAMERA: 'LIVE_CAMERA', // Direct field officer / citizen photo capture
    DEMO_CACHED: 'DEMO_CACHED', // High-fidelity cached scan for zero-wifi venue demos
    SAMPLE_SEED: 'SAMPLE_SEED', // Mathematically consistent seed inspection fixtures
  } as const,

  // Calibration Modes for Optical Font Measurement
  CALIBRATION_MODES: {
    TIER_A: 'TIER_A', // Lab/Field Marker: OpenCV ArUco / 85.6mm ID reference card
    TIER_B: 'TIER_B', // Declared Dimensions: Physical package width/height in mm
    TIER_C: 'TIER_C', // Heuristic Fallback: DPI/pixel estimate (Triggers REVIEW if borderline)
  } as const,

  // Statutory Product Categories
  CATEGORIES: {
    FOOD: 'FOOD',
    COSMETICS: 'COSMETICS',
    ELECTRONICS: 'ELECTRONICS', // GSR 577(E) 2022 QR Code pilot
    GENERAL: 'GENERAL',
  } as const,

  // Violation Severity
  SEVERITY: {
    CRITICAL: 'CRITICAL', // Deduction: -30 (Missing MRP, Missing Country of Origin)
    MODERATE: 'MODERATE', // Deduction: -20 (USP math mismatch, non-metric units)
    WARNING: 'WARNING',   // Deduction: -10 (Font height borderline, address formatting)
  } as const,

  // Legal Metrology Act Penalties
  PENALTIES: {
    SECTION_36_1: 'Section 36(1) Legal Metrology Act, 2009', // Non-standard packaging: Up to ₹25,000 fine
    SECTION_36_2: 'Section 36(2) Legal Metrology Act, 2009', // Repeat offenses: Up to ₹50,000 / ₹1,00,000 or imprisonment
    RULE_27_DIRECTOR: 'Rule 27 Legal Metrology (PC) Rules, 2011 (GSR 418(E) 2026)', // Director Accountability
    RULE_6_10_ECOM: 'Rule 6(10) E-Commerce Metrology Mandate (Feb 2026)', // Mandatory Country of Origin & Filter
  } as const,

  // Rule 7 Table-I Minimum Font Height Standards (based on Net Quantity)
  FONT_TABLE_I: [
    { maxQtyGrams: 200, minFontMm: 1.0 },
    { maxQtyGrams: 500, minFontMm: 2.0 },
    { maxQtyGrams: Infinity, minFontMm: 4.0 },
  ],
};

export type AppRole = typeof APP_CONSTANTS.ROLES[keyof typeof APP_CONSTANTS.ROLES];
export type AuditMode = typeof APP_CONSTANTS.AUDIT_MODES[keyof typeof APP_CONSTANTS.AUDIT_MODES];
export type ComplianceVerdict = typeof APP_CONSTANTS.VERDICTS[keyof typeof APP_CONSTANTS.VERDICTS];
export type ScanSource = typeof APP_CONSTANTS.SOURCES[keyof typeof APP_CONSTANTS.SOURCES];
export type CalibrationMode = typeof APP_CONSTANTS.CALIBRATION_MODES[keyof typeof APP_CONSTANTS.CALIBRATION_MODES];
export type ProductCategory = typeof APP_CONSTANTS.CATEGORIES[keyof typeof APP_CONSTANTS.CATEGORIES];
