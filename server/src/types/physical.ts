// ============================================================================
// PackParakh (पैक-परख) — Physical Packaging Scan Types & Validation Schemas
// Legal Metrology (Packaged Commodities) Rules, 2011 | Rule 7 Table-I Fonts
// Contract mirroring Frontend_Lead.md Section: Physical Scan Response
// ============================================================================

import { z } from 'zod';
import { CalibrationMode, ComplianceVerdict, ProductCategory, ScanSource } from '../config/constants';

// ----------------------------------------------------------------------------
// 1. Request Validation (POST /api/scan/physical — multipart/form-data fields)
// ----------------------------------------------------------------------------

const optionalNumber = (min: number, max: number) =>
  z.preprocess(
    (v) => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : undefined;
    },
    z.number().min(min).max(max).optional()
  );

export const PHYSICAL_PRESETS = ['compliant', 'review', 'violation'] as const;
export type PhysicalPreset = (typeof PHYSICAL_PRESETS)[number];

export const PhysicalScanRequestSchema = z
  .object({
    // Tier-B declared package width in mm (required for optical mm scale math)
    referenceWidthMm: optionalNumber(1, 10000),
    // Calibration trust level for converting pixels -> millimetres
    calibrationMode: z.enum(['TIER_A', 'TIER_B', 'TIER_C']).default('TIER_C'),
    // Statutory product category (drives exemption logic)
    category: z.enum(['FOOD', 'COSMETICS', 'ELECTRONICS', 'GENERAL']).default('GENERAL'),
    // Evidence provenance
    source: z.enum(['LIVE_CAMERA', 'DEMO_CACHED', 'SAMPLE_SEED']).default('LIVE_CAMERA'),
    // Deterministic demo-cached preset (zero-wifi stage fixtures)
    preset: z.enum(PHYSICAL_PRESETS).optional(),
    // Field officer / citizen geo-tag
    lat: optionalNumber(-90, 90),
    lng: optionalNumber(-180, 180),
  })
  .superRefine((data, ctx) => {
    if (data.calibrationMode === 'TIER_B' && data.referenceWidthMm === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referenceWidthMm'],
        message: 'referenceWidthMm is required when calibrationMode is TIER_B',
      });
    }
  });

export type PhysicalScanRequest = z.infer<typeof PhysicalScanRequestSchema>;

// ----------------------------------------------------------------------------
// 2. Calibration Scales (Rule 7 mm/pixel conversion)
// ----------------------------------------------------------------------------

export type ScaleConfidence = 'HIGH' | 'ESTIMATED' | 'UNCALIBRATED';
export type ScaleStatus = 'CALIBRATED' | 'REVIEW';

export interface CalibrationResult {
  mode: CalibrationMode;
  imageWidthPx: number;
  mmPerPixel: number;
  confidence: ScaleConfidence;
  status: ScaleStatus;
  referenceWidthMm?: number;
  requiresScaleConfirmation: boolean;
  disclaimer: string;
}

// ----------------------------------------------------------------------------
// 3. Extracted Packaging Fields (Vision Bridge output used by rule engine)
// ----------------------------------------------------------------------------

export interface DetectedBox {
  box_2d: [number, number, number, number]; // [x1, y1, x2, y2] in pixels
  label: string; // e.g. 'MRP', 'NET_QTY', 'MANUFACTURER'
  confidence: number;
  fontHeightPx?: number; // cap-height heuristic feeding Rule 7 Table-I
}

export interface ExtractedPackData {
  brandName?: string;
  productName?: string;
  category?: ProductCategory; // OCR/vision read of the actual product (downgrades perishable checks on stationery etc.)
  mrpValue?: number;
  mrpRaw?: string;
  hasInclusiveOfTaxes?: boolean;
  netQuantityValue?: number;
  netQuantityUnit?: string; // canonical lowercase SI symbol: g/kg/ml/l/m/cm/piece/unit
  netQuantityRaw?: string;
  mfgDateRaw?: string;
  mfgDateValid?: boolean; // parses as a month & year and is not in the future
  expiryDateRaw?: string; // best-before / use-by / expiry declaration text
  expiryDateValid?: boolean; // parses and is not in the past (FOOD)
  countryOfOrigin?: string;
  manufacturerName?: string;
  manufacturerAddress?: string;
  hasCompletePincode?: boolean; // Rule 6(1)(b) complete address + PIN
  consumerCareEmail?: string;
  consumerCarePhone?: string;
  declaredUspValue?: number;
  declaredUspRaw?: string;
  measuredFontHeightPx?: number; // tallest declaration cap-height (Rule 7)
  detectedBoxes: DetectedBox[];
  ocrConfidence: number; // 0..1
  ocrComplete: boolean; // false when OCR was unavailable (honesty flag -> REVIEW)
}

// ----------------------------------------------------------------------------
// 4. Rule Violation & Bounding Box Report Shapes
// ----------------------------------------------------------------------------

export interface PhysicalViolation {
  ruleNumber: string;
  title: string;
  description: string;
  penaltyClause: string;
  severity: 'WARNING' | 'MODERATE' | 'CRITICAL';
  deduction: number;
  remedy: string;
}

export interface PhysicalBoundingBox {
  box_2d: [number, number, number, number];
  label: string;
  confidence: number;
  status: 'PASS' | 'FAIL' | 'REVIEW';
  originImage?: number;
}

// ----------------------------------------------------------------------------
// 5. Full Physical Scan Report (Frontend_Lead.md contract)
// ----------------------------------------------------------------------------

export interface PhysicalScanReport {
  success: boolean;
  scanId: string;
  timestamp: string;
  sha256Hash: string;
  imageSha256Hash: string;
  imageCount?: number;
  source: ScanSource;
  verdict: ComplianceVerdict;
  complianceScore: number;
  category: ProductCategory;
  measuredFontHeightMm?: number;
  requiresConfirm: boolean;
  isOfficerConfirmed: boolean;
  calibration: CalibrationResult & { done: boolean };
  extractedFields: {
    mrp: { declared?: number; valid: boolean; rawText?: string; hasTaxClause?: boolean };
    netQuantity: { value?: number; unit?: string; valid: boolean; rawText?: string };
    unitSalePrice: { calculated?: string; declared?: string; valid: boolean };
    mfgDate: { text?: string; valid: boolean };
    expiryDate: { text?: string; valid: boolean };
    countryOfOrigin: { text?: string; valid: boolean };
    manufacturerAddress: { text?: string; valid: boolean; hasCompletePincode?: boolean };
    consumerCare: { text?: string; valid: boolean };
    brandName?: string;
    productName?: string;
  };
  violations: PhysicalViolation[];
  boundingBoxes: PhysicalBoundingBox[];
}

export interface RuleEvaluationResult {
  complianceScore: number;
  verdict: ComplianceVerdict;
  violations: PhysicalViolation[];
  measuredFontHeightMm?: number;
  calculatedUspText?: string;
}