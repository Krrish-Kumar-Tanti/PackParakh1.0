// ============================================================================
// PackParakh (पैक-परख) — Shared Contracts & Types
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Legal Metrology (Packaged Commodities) Rules, 2011 & GSR 418(E) 2026
// ============================================================================

import { z } from 'zod';

/**
 * Zod Schema for optical packaging extraction via Gemini Vision.
 * Strict schema guarantees zero LLM hallucination entering statutory rule evaluation.
 */
export const DetectedBoxSchema = z.object({
  label: z.string(), // "MRP", "Net Quantity", "USP", "COO", "Mfg Date", "Consumer Care", etc.
  box_2d: z.tuple([z.number(), z.number(), z.number(), z.number()]), // [ymin, xmin, ymax, xmax] 0-1000 scale
  font_height_px: z.number().default(0),
});

export const ExtractedPackSchema = z.object({
  brand_name: z.string().nullable().default(null),
  product_name: z.string().nullable().default(null),
  category: z.enum(['FOOD', 'COSMETICS', 'ELECTRONICS', 'GENERAL']).default('GENERAL'),
  
  // Rule 6(1)(e): MRP & Tax clause
  mrp_raw: z.string().nullable().default(null),
  mrp_value: z.number().nullable().default(null),
  has_inclusive_of_taxes: z.boolean().default(false),
  
  // Rule 6(1)(c): Net Quantity
  net_quantity_raw: z.string().nullable().default(null),
  net_quantity_value: z.number().nullable().default(null),
  net_quantity_unit: z.string().nullable().default(null),
  
  // Rule 6(11): Unit Sale Price
  unit_sale_price_raw: z.string().nullable().default(null),
  unit_sale_price_value: z.number().nullable().default(null),
  unit_sale_price_unit: z.string().nullable().default(null),
  
  // Rule 6(1)(d): Mfg & Expiry Dates
  mfg_or_packing_date_raw: z.string().nullable().default(null),
  expiry_date_raw: z.string().nullable().default(null),
  
  // Rule 6(1)(g): Country of Origin & Importer
  country_of_origin: z.string().nullable().default(null),
  is_imported: z.boolean().default(false),
  importer_name: z.string().nullable().default(null),
  importer_address: z.string().nullable().default(null),
  
  // Rule 6(1)(b): Manufacturer / Packer
  manufacturer_name: z.string().nullable().default(null),
  manufacturer_address: z.string().nullable().default(null),
  has_complete_pincode: z.boolean().default(false),
  
  // Rule 6(1)(f): Consumer Care Contact Details
  consumer_care_name: z.string().nullable().default(null),
  consumer_care_email: z.string().nullable().default(null),
  consumer_care_phone: z.string().nullable().default(null),
  consumer_care_address: z.string().nullable().default(null),
  
  // Food Specific Flags
  is_food_product: z.boolean().default(false),
  fssai_license_number: z.string().nullable().default(null),
  veg_nonveg_emblem_detected: z.boolean().nullable().default(null),

  // E-Commerce Metadata (if scanned from URL)
  is_ecom_listing: z.boolean().default(false),
  has_coo_filter: z.boolean().default(false), // Feb 2026 Mandate
  
  // Optical Bounding Boxes
  detected_boxes: z.array(DetectedBoxSchema).default([]),
});

export type ExtractedPackData = z.infer<typeof ExtractedPackSchema>;
export type DetectedBox = z.infer<typeof DetectedBoxSchema>;

/**
 * Statutory Compliance Verdict & Severity Tiers
 */
export type RuleStatus = 'PASS' | 'FAIL' | 'REVIEW' | 'NOT_APPLICABLE';
export type RuleSeverity = 'CRITICAL' | 'MODERATE' | 'WARNING';
export type ComplianceVerdict = 'PASS' | 'FAIL' | 'REVIEW';

export type CalibrationMode = 'TIER_A' | 'TIER_B' | 'TIER_C';
export type ScanSource = 'LIVE_CAMERA' | 'DEMO_CACHED' | 'SAMPLE_SEED';
export type ProductCategory = 'FOOD' | 'COSMETICS' | 'ELECTRONICS' | 'GENERAL';

/**
 * Result of evaluating an individual Legal Metrology rule
 */
export interface RuleResult {
  ruleId: string;
  ruleTitle: string;
  legalCitation: string;
  status: RuleStatus;
  deduction: number;
  reason: string;
  penaltySection: string;
  remedyAction: string;
}

/**
 * Explainable deduction breakdown for reports and court memos
 */
export interface ExplainableDeduction {
  ruleId: string;
  deductionPoints: number;
  legalCitation: string;
  statutoryPenalty: string;
  reason: string;
}

/**
 * Aggregate result of the 24-rule deterministic compliance engine
 */
export interface ComplianceEvaluationResult {
  complianceScore: number;
  overallVerdict: ComplianceVerdict;
  calculatedUsp: string | null;
  ruleResults: RuleResult[];
  explainableDeductions: ExplainableDeduction[];
  detectedBoxes: DetectedBox[];
  calibratedFontMm?: number;
  requiresScaleConfirmation: boolean;
}

/**
 * Pre-Market Packaging Simulator Result
 */
export interface PackagingSimulationResult {
  pdpAreaCm2: number;
  minFontHeightMm: number;
  standardSizesAllowed: string[];
  dualUnitRequirement: string;
  mandatoryRuleCitations: string[];
}
