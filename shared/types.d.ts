import { z } from 'zod';
/**
 * Zod Schema for optical packaging extraction via Gemini Vision.
 * Strict schema guarantees zero LLM hallucination entering statutory rule evaluation.
 */
export declare const DetectedBoxSchema: z.ZodObject<{
    label: z.ZodString;
    box_2d: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    font_height_px: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    label: string;
    box_2d: [number, number, number, number];
    font_height_px: number;
}, {
    label: string;
    box_2d: [number, number, number, number];
    font_height_px?: number | undefined;
}>;
export declare const ExtractedPackSchema: z.ZodObject<{
    brand_name: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    product_name: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    category: z.ZodDefault<z.ZodEnum<["FOOD", "COSMETICS", "ELECTRONICS", "GENERAL"]>>;
    mrp_raw: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    mrp_value: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    has_inclusive_of_taxes: z.ZodDefault<z.ZodBoolean>;
    net_quantity_raw: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    net_quantity_value: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    net_quantity_unit: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    unit_sale_price_raw: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    unit_sale_price_value: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    unit_sale_price_unit: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    mfg_or_packing_date_raw: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    expiry_date_raw: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    country_of_origin: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    is_imported: z.ZodDefault<z.ZodBoolean>;
    importer_name: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    importer_address: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    manufacturer_name: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    manufacturer_address: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    has_complete_pincode: z.ZodDefault<z.ZodBoolean>;
    consumer_care_name: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    consumer_care_email: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    consumer_care_phone: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    consumer_care_address: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    is_food_product: z.ZodDefault<z.ZodBoolean>;
    fssai_license_number: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    veg_nonveg_emblem_detected: z.ZodDefault<z.ZodNullable<z.ZodBoolean>>;
    is_ecom_listing: z.ZodDefault<z.ZodBoolean>;
    has_coo_filter: z.ZodDefault<z.ZodBoolean>;
    detected_boxes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        box_2d: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        font_height_px: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        box_2d: [number, number, number, number];
        font_height_px: number;
    }, {
        label: string;
        box_2d: [number, number, number, number];
        font_height_px?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    category: "FOOD" | "COSMETICS" | "ELECTRONICS" | "GENERAL";
    brand_name: string | null;
    product_name: string | null;
    mrp_raw: string | null;
    mrp_value: number | null;
    has_inclusive_of_taxes: boolean;
    net_quantity_raw: string | null;
    net_quantity_value: number | null;
    net_quantity_unit: string | null;
    unit_sale_price_raw: string | null;
    unit_sale_price_value: number | null;
    unit_sale_price_unit: string | null;
    mfg_or_packing_date_raw: string | null;
    expiry_date_raw: string | null;
    country_of_origin: string | null;
    is_imported: boolean;
    importer_name: string | null;
    importer_address: string | null;
    manufacturer_name: string | null;
    manufacturer_address: string | null;
    has_complete_pincode: boolean;
    consumer_care_name: string | null;
    consumer_care_email: string | null;
    consumer_care_phone: string | null;
    consumer_care_address: string | null;
    is_food_product: boolean;
    fssai_license_number: string | null;
    veg_nonveg_emblem_detected: boolean | null;
    is_ecom_listing: boolean;
    has_coo_filter: boolean;
    detected_boxes: {
        label: string;
        box_2d: [number, number, number, number];
        font_height_px: number;
    }[];
}, {
    category?: "FOOD" | "COSMETICS" | "ELECTRONICS" | "GENERAL" | undefined;
    brand_name?: string | null | undefined;
    product_name?: string | null | undefined;
    mrp_raw?: string | null | undefined;
    mrp_value?: number | null | undefined;
    has_inclusive_of_taxes?: boolean | undefined;
    net_quantity_raw?: string | null | undefined;
    net_quantity_value?: number | null | undefined;
    net_quantity_unit?: string | null | undefined;
    unit_sale_price_raw?: string | null | undefined;
    unit_sale_price_value?: number | null | undefined;
    unit_sale_price_unit?: string | null | undefined;
    mfg_or_packing_date_raw?: string | null | undefined;
    expiry_date_raw?: string | null | undefined;
    country_of_origin?: string | null | undefined;
    is_imported?: boolean | undefined;
    importer_name?: string | null | undefined;
    importer_address?: string | null | undefined;
    manufacturer_name?: string | null | undefined;
    manufacturer_address?: string | null | undefined;
    has_complete_pincode?: boolean | undefined;
    consumer_care_name?: string | null | undefined;
    consumer_care_email?: string | null | undefined;
    consumer_care_phone?: string | null | undefined;
    consumer_care_address?: string | null | undefined;
    is_food_product?: boolean | undefined;
    fssai_license_number?: string | null | undefined;
    veg_nonveg_emblem_detected?: boolean | null | undefined;
    is_ecom_listing?: boolean | undefined;
    has_coo_filter?: boolean | undefined;
    detected_boxes?: {
        label: string;
        box_2d: [number, number, number, number];
        font_height_px?: number | undefined;
    }[] | undefined;
}>;
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
