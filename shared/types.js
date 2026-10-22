"use strict";
// ============================================================================
// PackParakh (पैक-परख) — Shared Contracts & Types
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Legal Metrology (Packaged Commodities) Rules, 2011 & GSR 418(E) 2026
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractedPackSchema = exports.DetectedBoxSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod Schema for optical packaging extraction via Gemini Vision.
 * Strict schema guarantees zero LLM hallucination entering statutory rule evaluation.
 */
exports.DetectedBoxSchema = zod_1.z.object({
    label: zod_1.z.string(), // "MRP", "Net Quantity", "USP", "COO", "Mfg Date", "Consumer Care", etc.
    box_2d: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]), // [ymin, xmin, ymax, xmax] 0-1000 scale
    font_height_px: zod_1.z.number().default(0),
});
exports.ExtractedPackSchema = zod_1.z.object({
    brand_name: zod_1.z.string().nullable().default(null),
    product_name: zod_1.z.string().nullable().default(null),
    category: zod_1.z.enum(['FOOD', 'COSMETICS', 'ELECTRONICS', 'GENERAL']).default('GENERAL'),
    // Rule 6(1)(e): MRP & Tax clause
    mrp_raw: zod_1.z.string().nullable().default(null),
    mrp_value: zod_1.z.number().nullable().default(null),
    has_inclusive_of_taxes: zod_1.z.boolean().default(false),
    // Rule 6(1)(c): Net Quantity
    net_quantity_raw: zod_1.z.string().nullable().default(null),
    net_quantity_value: zod_1.z.number().nullable().default(null),
    net_quantity_unit: zod_1.z.string().nullable().default(null),
    // Rule 6(11): Unit Sale Price
    unit_sale_price_raw: zod_1.z.string().nullable().default(null),
    unit_sale_price_value: zod_1.z.number().nullable().default(null),
    unit_sale_price_unit: zod_1.z.string().nullable().default(null),
    // Rule 6(1)(d): Mfg & Expiry Dates
    mfg_or_packing_date_raw: zod_1.z.string().nullable().default(null),
    expiry_date_raw: zod_1.z.string().nullable().default(null),
    // Rule 6(1)(g): Country of Origin & Importer
    country_of_origin: zod_1.z.string().nullable().default(null),
    is_imported: zod_1.z.boolean().default(false),
    importer_name: zod_1.z.string().nullable().default(null),
    importer_address: zod_1.z.string().nullable().default(null),
    // Rule 6(1)(b): Manufacturer / Packer
    manufacturer_name: zod_1.z.string().nullable().default(null),
    manufacturer_address: zod_1.z.string().nullable().default(null),
    has_complete_pincode: zod_1.z.boolean().default(false),
    // Rule 6(1)(f): Consumer Care Contact Details
    consumer_care_name: zod_1.z.string().nullable().default(null),
    consumer_care_email: zod_1.z.string().nullable().default(null),
    consumer_care_phone: zod_1.z.string().nullable().default(null),
    consumer_care_address: zod_1.z.string().nullable().default(null),
    // Food Specific Flags
    is_food_product: zod_1.z.boolean().default(false),
    fssai_license_number: zod_1.z.string().nullable().default(null),
    veg_nonveg_emblem_detected: zod_1.z.boolean().nullable().default(null),
    // E-Commerce Metadata (if scanned from URL)
    is_ecom_listing: zod_1.z.boolean().default(false),
    has_coo_filter: zod_1.z.boolean().default(false), // Feb 2026 Mandate
    // Optical Bounding Boxes
    detected_boxes: zod_1.z.array(exports.DetectedBoxSchema).default([]),
});
//# sourceMappingURL=types.js.map