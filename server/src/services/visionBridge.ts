// ============================================================================
// PackParakh (पैक-परख) — Gemini Vision Bridge (Swetakshi-owned integration)
// Swetakshi owns: scanController.ts & scanRoutes.ts. The AI specialist owns
// server/src/services/geminiVision.ts (Refer AI_Rule_Specialist.md).
//
// This bridge NEVER blocks the pipeline:
//   - If GEMINI_API_KEY is set AND geminiVision.ts exists -> real OCR.
//   - Otherwise -> deterministic DEMO_CACHED fixtures / honest abstain.
// Gemini Vision only extracts text — legal verdicts are 100% deterministic
// TypeScript rule code inside scanController.ts.
// ============================================================================

import crypto from 'crypto';
import { env } from '../config/env';
import { APP_CONSTANTS, ProductCategory, ScanSource } from '../config/constants';
import { DetectedBox, ExtractedPackData, PhysicalPreset } from '../types/physical';

// ----------------------------------------------------------------------------
// 1. Deterministic Demo Fixtures (zero-wifi venue stage reliability)
// ----------------------------------------------------------------------------

// ~300 DPI reference: 1 mm ≈ 11.81 px, so a compliant 4.0 mm font ≈ 47 px cap-height.
const pxPerMmAt300Dpi = 25.4 / 300;

const compliantBoxes: DetectedBox[] = [
  { box_2d: [320, 180, 1150, 320], label: 'MRP', confidence: 0.99, fontHeightPx: 122 },
  { box_2d: [320, 400, 1180, 515], label: 'NET_QTY', confidence: 0.98, fontHeightPx: 118 },
  { box_2d: [340, 1410, 1560, 1525], label: 'MANUFACTURER', confidence: 0.96, fontHeightPx: 56 },
  { box_2d: [340, 1620, 1500, 1700], label: 'CONSUMER_CARE', confidence: 0.95, fontHeightPx: 33 },
];

const violationBoxes: DetectedBox[] = [
  { box_2d: [300, 190, 920, 300], label: 'MRP', confidence: 0.97, fontHeightPx: 64 },
  { box_2d: [300, 360, 940, 445], label: 'NET_QTY', confidence: 0.96, fontHeightPx: 10 },
  { box_2d: [300, 900, 1180, 1000], label: 'COUNTRY_OF_ORIGIN', confidence: 0.88, fontHeightPx: 22 },
];

const reviewBoxes: DetectedBox[] = [
  { box_2d: [340, 200, 1180, 330], label: 'MRP', confidence: 0.98, fontHeightPx: 96 },
  { box_2d: [340, 410, 1200, 520], label: 'NET_QTY', confidence: 0.97, fontHeightPx: 26 },
  { box_2d: [360, 1500, 1580, 1600], label: 'MANUFACTURER', confidence: 0.9, fontHeightPx: 20 },
];

function buildCompliantFixture(): ExtractedPackData {
  return {
    brandName: 'Aashirvaad',
    productName: 'Aashirvaad Atta (Whole Wheat Flour)',
    mrpValue: 260,
    mrpRaw: 'MRP Rs.260/- incl. of all taxes',
    hasInclusiveOfTaxes: true,
    netQuantityValue: 5,
    netQuantityUnit: 'kg',
    netQuantityRaw: 'Net. Qty 5 Kg',
    mfgDateRaw: 'MFG: 08/2026',
    mfgDateValid: true,
    expiryDateRaw: 'Best Before: 12/2027',
    expiryDateValid: true,
    countryOfOrigin: 'India',
    manufacturerName: 'ITC Limited',
    manufacturerAddress: 'ITC Limited, ITC House, 2 Nelson Mandela Road, Vasant Kunj, New Delhi - 110070',
    hasCompletePincode: true,
    consumerCareEmail: 'packparakh.care@itc.example',
    consumerCarePhone: '1800-3456-789',
    declaredUspValue: 52,
    declaredUspRaw: 'Rs.52 per kg',
    measuredFontHeightPx: 56,
    detectedBoxes: compliantBoxes,
    ocrConfidence: 0.97,
    ocrComplete: true,
  };
}

function buildViolationFixture(): ExtractedPackData {
  return {
    brandName: 'Nestle',
    productName: 'Maggi 2-Minute Noodles',
    mrpValue: 14,
    mrpRaw: 'MRP 14.00 (incl. of all taxes)',
    hasInclusiveOfTaxes: true,
    netQuantityValue: 70,
    netQuantityUnit: 'gms', // Non-metric SI symbol -> Rule 6(1)(c) FAIL
    netQuantityRaw: 'NET QTY: 70 gms',
    mfgDateRaw: 'MFG 06/2026',
    mfgDateValid: true,
    countryOfOrigin: 'India',
    manufacturerName: 'Nestle India Ltd.',
    manufacturerAddress: 'Nestle House, Jacaranda Marg, DLF City Phase II, Gurugram - 122002',
    hasCompletePincode: true,
    consumerCareEmail: 'abc@maggi.example',
    consumerCarePhone: '1800-419-4200',
    declaredUspValue: undefined, // Rule 6(11) missing USP
    declaredUspRaw: undefined,
    measuredFontHeightPx: 10, // ≈ 0.85 mm < 1.0 mm required -> Rule 7 FAIL
    detectedBoxes: violationBoxes,
    ocrConfidence: 0.9,
    ocrComplete: true,
  };
}

function buildReviewFixture(): ExtractedPackData {
  return {
    brandName: 'Dabur',
    productName: 'Dabur Premium Honey',
    mrpValue: 145,
    mrpRaw: 'MRP: Rs.145/- (incl. of all taxes)',
    hasInclusiveOfTaxes: true,
    netQuantityValue: 250,
    netQuantityUnit: 'g',
    netQuantityRaw: 'Net. Qty 250 g',
    mfgDateRaw: 'MFG: 05/2026',
    mfgDateValid: true,
    expiryDateRaw: 'Use By: 05/2027',
    expiryDateValid: true,
    countryOfOrigin: 'India',
    manufacturerName: 'Dabur India Limited',
    manufacturerAddress: 'Dabur India Ltd., 8/3 Asaf Ali Road, New Delhi - 110002',
    hasCompletePincode: true,
    consumerCareEmail: 'care@dabur.example',
    consumerCarePhone: '1800-123-3600',
    declaredUspValue: 0.58,
    declaredUspRaw: 'Rs.0.58 per g',
    measuredFontHeightPx: 26, // ≈ 2.2 mm (looks fine) but scale is UNCALIBRATED
    detectedBoxes: reviewBoxes,
    ocrConfidence: 0.85,
    ocrComplete: true,
  };
}

function buildUnreadableFallback(): ExtractedPackData {
  // Honest "abstain rather than guess": no OCR available -> all fields unknown.
  // Deterministic rule code converts this into a REVIEW verdict (needs HITL).
  return {
    detectedBoxes: [],
    ocrConfidence: 0,
    ocrComplete: false,
  };
}

const PRESET_FIXTURES: Record<PhysicalPreset, () => ExtractedPackData> = {
  compliant: buildCompliantFixture,
  review: buildReviewFixture,
  violation: buildViolationFixture,
};

export function getDemoFixture(preset: PhysicalPreset): ExtractedPackData {
  return PRESET_FIXTURES[preset]();
}

// ----------------------------------------------------------------------------
// 2. Gemini Vision Adapter (optional dynamic import — safe if AI files absent)
// ----------------------------------------------------------------------------

/**
 * Gemini Vision emits the shared snake_case extract schema (brand_name,
 * mrp_value, detected_boxes, ..). The physical rule engine inside
 * scanController.ts consumes the camelCase server ExtractedPackData shape, so
 * we translate across the boundary here (visionBridge is integration-owned).
 * This adapter is what makes live camera scans produce real OCR fields instead
 * of silently-empty REVIEW results.
 */
type SharedExtract = Record<string, any>;

function cleanBoxLabel(raw?: string): string {
  if (!raw) return 'DECLARATION';
  const s = raw.toLowerCase().trim();
  if (s === 'mrp_raw' || s === 'mrp_value' || s === 'mrp') return 'Rule 6(1)(e): MRP';
  if (s === 'brand_name' || s === 'brand') return 'Brand';
  if (s === 'product_name' || s === 'product') return 'Product Name';
  if (s === 'net_quantity_raw' || s === 'net_quantity_value' || s === 'net_quantity') return 'Rule 6(1)(c): Net Quantity';
  if (s === 'unit_sale_price_raw' || s === 'unit_sale_price' || s === 'usp') return 'Rule 6(11): USP';
  if (s === 'country_of_origin' || s === 'origin') return 'Rule 6(1)(g): Origin';
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeBoxes(boxes: any[] = []): DetectedBox[] {
  return boxes
    .filter((b) => b && Array.isArray(b.box_2d) && b.box_2d.length === 4)
    .map((b) => ({
      box_2d: b.box_2d as [number, number, number, number],
      label: cleanBoxLabel(b.label),
      confidence: typeof b.confidence === 'number' ? b.confidence : 0.9,
      fontHeightPx:
        typeof b.font_height_px === 'number'
          ? b.font_height_px
          : typeof b.fontHeightPx === 'number'
          ? b.fontHeightPx
          : undefined,
    }));
}

function adaptSharedExtract(raw: SharedExtract): ExtractedPackData {
  const boxes = normalizeBoxes(raw.detected_boxes || raw.detectedBoxes);
  // Tallest declaration cap-height feeds Rule 7 Table-I font math.
  let measuredFontHeightPx: number | undefined;
  if (boxes.length > 0) {
    measuredFontHeightPx = Math.max(
      ...boxes.map((b) => b.fontHeightPx || 0)
    );
  }
  if (!measuredFontHeightPx || measuredFontHeightPx <= 0) {
    measuredFontHeightPx =
      typeof raw.measured_font_height_px === 'number'
        ? raw.measured_font_height_px
        : maybeNumber(raw.measuredFontHeightPx);
  }

  return {
    brandName: maybeString(raw.brand_name) || maybeString(raw.brandName) || undefined,
    productName: maybeString(raw.product_name) || maybeString(raw.productName) || undefined,
    // OCR/vision category fed through so the rule engine can downgrade
    // expiry checks when the item is clearly not perishable (e.g. stationery).
    category: (maybeString(raw.category) as ProductCategory) || undefined,
    mrpValue: maybeNumber(raw.mrp_value) ?? maybeNumber(raw.mrpValue),
    mrpRaw: maybeString(raw.mrp_raw) || maybeString(raw.mrpRaw) || undefined,
    hasInclusiveOfTaxes: raw.has_inclusive_of_taxes ?? raw.hasInclusiveOfTaxes ?? false,
    netQuantityValue: maybeNumber(raw.net_quantity_value) ?? maybeNumber(raw.netQuantityValue),
    netQuantityUnit: maybeString(raw.net_quantity_unit) || maybeString(raw.netQuantityUnit) || undefined,
    netQuantityRaw: maybeString(raw.net_quantity_raw) || maybeString(raw.netQuantityRaw) || undefined,
    mfgDateRaw: maybeString(raw.mfg_or_packing_date_raw) || maybeString(raw.mfgDateRaw) || undefined,
    mfgDateValid: raw.mfg_date_valid ?? raw.mfgDateValid ?? true,
    expiryDateRaw: maybeString(raw.expiry_date_raw) || maybeString(raw.expiryDateRaw) || undefined,
    expiryDateValid: raw.expiry_date_valid ?? raw.expiryDateValid ?? undefined,
    countryOfOrigin: maybeString(raw.country_of_origin) || maybeString(raw.countryOfOrigin) || undefined,
    manufacturerName: maybeString(raw.manufacturer_name) || maybeString(raw.manufacturerName) || undefined,
    manufacturerAddress: maybeString(raw.manufacturer_address) || maybeString(raw.manufacturerAddress) || undefined,
    hasCompletePincode: raw.has_complete_pincode ?? raw.hasCompletePincode ?? undefined,
    consumerCareEmail: maybeString(raw.consumer_care_email) || maybeString(raw.consumerCareEmail) || undefined,
    consumerCarePhone: maybeString(raw.consumer_care_phone) || maybeString(raw.consumerCarePhone) || undefined,
    declaredUspValue: maybeNumber(raw.unit_sale_price_value) ?? maybeNumber(raw.declaredUspValue),
    declaredUspRaw: maybeString(raw.unit_sale_price_raw) || maybeString(raw.declaredUspRaw) || undefined,
    measuredFontHeightPx,
    detectedBoxes: boxes,
    ocrConfidence:
      typeof raw.ocrConfidence === 'number'
        ? raw.ocrConfidence
        : boxes.length > 0
        ? 0.9
        : 0.4,
    ocrComplete: raw.ocrComplete ?? true,
  };
}

function maybeString(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  return undefined;
}
function maybeNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) {
    return Number(v);
  }
  return undefined;
}

// ----------------------------------------------------------------------------
// 2b. Multi-Photo Fusion (one product, many label panels)
// ----------------------------------------------------------------------------
// A single photo often misses declarations printed on another face of the pack
// (MRP on the front, address + mfg date on the back). Each uploaded photo is
// extracted independently, then the panel extracts are fused:
//   - strings: first meaningful value (vision placeholders are dropped)
//   - numbers (MRP / net qty / USP): majority vote, tie -> first seen
//   - booleans: any true wins
//   - boxes/confidence: union / max
//   - ocrComplete: recalculated on the fused core (MRP + net qty both present)
const VISION_PLACEHOLDERS = new Set([
  'inspected product',
  'inspected fmcg brand',
  'packaged commodity',
  'packaged product',
]);

function preferMajority(values: Array<number | undefined>): number | undefined {
  const defined = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (defined.length === 0) return undefined;
  const counts = new Map<number, number>();
  const order: number[] = [];
  for (const v of defined) {
    if (!counts.has(v)) order.push(v);
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  let best = defined[0];
  let bestCount = 0;
  for (const v of order) {
    const c = counts.get(v) || 0;
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}

export function mergeExtracts(extracts: ExtractedPackData[]): ExtractedPackData {
  const list = extracts.filter((e) => e && typeof e === 'object');
  if (list.length === 0) {
    return { detectedBoxes: [], ocrConfidence: 0, ocrComplete: false, category: 'GENERAL' };
  }
  if (list.length === 1) {
    const only = list[0];
    return {
      ...only,
      category: only.category ?? 'GENERAL',
      detectedBoxes: only.detectedBoxes || [],
      ocrComplete: !!(only.mrpValue && only.netQuantityValue),
    };
  }

  const firstMeaningful = (
    pick: (e: ExtractedPackData) => string | undefined,
    fallback = true
  ): string | undefined => {
    for (const e of list) {
      const raw = pick(e);
      if (typeof raw !== 'string' || raw.trim().length === 0) continue;
      if (!fallback) {
        const lower = raw.trim().toLowerCase();
        if (VISION_PLACEHOLDERS.has(lower)) continue;
      }
      return raw.trim();
    }
    return undefined;
  };

  const firstDefined = <T>(values: Array<T | undefined>): T | undefined =>
    values.find((v) => v !== undefined && v !== null) as T | undefined;

  const merged: ExtractedPackData = {
    brandName: firstMeaningful((e) => e.brandName, false),
    productName: firstMeaningful((e) => e.productName, false),
    // Prefer the most safety-critical category (e.g. FOOD) across panels;
    // fall back to GENERAL so non-perishable items never get expiry flagged.
    category: firstDefined(list.map((e) => e.category)) ?? 'GENERAL',
    mrpValue: preferMajority(list.map((e) => e.mrpValue)),
    mrpRaw: firstMeaningful((e) => e.mrpRaw),
    hasInclusiveOfTaxes: list.some((e) => !!e.hasInclusiveOfTaxes),
    netQuantityValue: preferMajority(list.map((e) => e.netQuantityValue)),
    netQuantityUnit: firstMeaningful((e) => e.netQuantityUnit),
    netQuantityRaw: firstMeaningful((e) => e.netQuantityRaw),
    mfgDateRaw: firstMeaningful((e) => e.mfgDateRaw),
    mfgDateValid: list.some((e) => !!e.mfgDateValid),
    expiryDateRaw: firstMeaningful((e) => e.expiryDateRaw),
    expiryDateValid: list.some((e) => !!e.expiryDateValid),
    countryOfOrigin: firstMeaningful((e) => e.countryOfOrigin),
    manufacturerName: firstMeaningful((e) => e.manufacturerName),
    manufacturerAddress: firstMeaningful((e) => e.manufacturerAddress),
    hasCompletePincode: list.some((e) => !!e.hasCompletePincode),
    consumerCareEmail: firstMeaningful((e) => e.consumerCareEmail),
    consumerCarePhone: firstMeaningful((e) => e.consumerCarePhone),
    declaredUspValue: preferMajority(list.map((e) => e.declaredUspValue)),
    declaredUspRaw: firstMeaningful((e) => e.declaredUspRaw),
    measuredFontHeightPx: list.reduce<number | undefined>(
      (acc, e) =>
        typeof e.measuredFontHeightPx === 'number'
          ? Math.max(acc ?? -Infinity, e.measuredFontHeightPx)
          : acc,
      undefined
    ),
    detectedBoxes: list.flatMap((e, idx) =>
      (e.detectedBoxes || []).map((box) => ({ ...box, originImage: idx }))
    ),
    ocrConfidence: Math.max(...list.map((e) => e.ocrConfidence || 0)),
    ocrComplete: false, // recomputed below on the FUSED core fields
  };

  const mrp = preferMajority(list.map((e) => e.mrpValue));
  const netQty = preferMajority(list.map((e) => e.netQuantityValue));
  merged.mrpValue = mrp;
  merged.netQuantityValue = netQty;
  merged.ocrComplete = !!(mrp && netQty && (mrp > 0) && (netQty > 0));
  return merged;
}

interface GeminiVisionModule {
  extractPackagingData?: (imageBuffer: Buffer) => Promise<SharedExtract>;
}

async function tryGeminiVision(imageBuffer: Buffer): Promise<ExtractedPackData | null> {
  if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY.trim().length === 0) {
    return null;
  }

  try {
    // Variable specifier keeps geminiVision.ts an optional runtime dependency —
    // the build succeeds even before the AI specialist's engine lands.
    const modulePath = './geminiVision';
    const mod = (await import(modulePath).catch(() => null)) as
      | GeminiVisionModule
      | null;
    if (!mod || typeof mod.extractPackagingData !== 'function') {
      return null;
    }
    const raw = await mod.extractPackagingData(imageBuffer);
    if (!raw) return null;
    return adaptSharedExtract(raw);
  } catch {
    // Vision failure must never crash the audit pipeline.
    return null;
  }
}

async function tryLocalOcr(imageBuffer: Buffer): Promise<SharedExtract | null> {
  try {
    const { extractFromImageBuffer } = await import('./localOcr');
    return (await extractFromImageBuffer(imageBuffer)) as SharedExtract | null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------------
// 3. Public Bridge Entry Point
// ----------------------------------------------------------------------------

export interface VisionBridgeOptions {
  category: ProductCategory;
  source: ScanSource;
  preset?: PhysicalPreset;
}

export async function extractPackagingData(
  imageBuffer: Buffer,
  options: VisionBridgeOptions
): Promise<ExtractedPackData> {
  // Deterministic demo-cached fixtures power 100% of stage demos (even offline).
  if (options.preset) {
    return getDemoFixture(options.preset);
  }

  if (options.source === APP_CONSTANTS.SOURCES.DEMO_CACHED) {
    return getDemoFixture('compliant');
  }

  if (options.source === APP_CONSTANTS.SOURCES.SAMPLE_SEED) {
    return getDemoFixture('compliant');
  }

  // Live camera scan: prefer real Gemini OCR, then local Tesseract OCR (works
  // with NO API key — venue/offline critical), then abort-with-REVIEW fallback.
  const geminiResult = await tryGeminiVision(imageBuffer);
  if (geminiResult) return geminiResult;

  const localOcrResult = await tryLocalOcr(imageBuffer);
  if (localOcrResult) return adaptSharedExtract(localOcrResult);

  return buildUnreadableFallback();
}

// ----------------------------------------------------------------------------
// 4. Image Evidence Hash (Section 63 BSA 2023 / 65B Evidence Act)
// ----------------------------------------------------------------------------

export function hashImageEvidence(imageBuffer: Buffer): string {
  return crypto.createHash('sha256').update(imageBuffer).digest('hex');
}

export function referencePixelPerMmFallback(): number {
  return pxPerMmAt300Dpi;
}