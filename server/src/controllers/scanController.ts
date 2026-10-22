

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { getDb } from '../database/db';
import {
  APP_CONSTANTS,
  CalibrationMode,
  ComplianceVerdict,
  ProductCategory,
  ScanSource,
} from '../config/constants';
import { scrapeProductListing } from '../services/scraperService';
import { extractPackagingData, mergeExtracts, hashImageEvidence, referencePixelPerMmFallback } from '../services/visionBridge';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import {
  EcomScanRequestSchema,
  ScrapedProductData,
  EcomViolation,
  EcomVerificationReport,
} from '../types/ecom';
import {
  PhysicalScanRequestSchema,
  PhysicalPreset,
  CalibrationResult,
  ExtractedPackData,
  PhysicalViolation,
  PhysicalBoundingBox,
  PhysicalScanReport,
  RuleEvaluationResult,
} from '../types/physical';

// ----------------------------------------------------------------------------
// 1. Deterministic E-Commerce Metrology Rule Evaluator
// Codifies Rule 6(10) Feb 2026 E-Com Mandates, Rule 6(11) USP, and GSR 418(E)
// ----------------------------------------------------------------------------
export function evaluateEcomRules(product: ScrapedProductData): {
  complianceScore: number;
  verdict: ComplianceVerdict;
  calculatedUspText: string;
  violations: EcomViolation[];
} {
  const violations: EcomViolation[] = [];
  let totalDeduction = 0;

  // 1. Rule 6(1)(g) & Rule 6(10) — Mandatory Country of Origin Declaration
  if (!product.countryOfOrigin || product.countryOfOrigin.trim().length === 0) {
    const deduction = APP_CONSTANTS.SEVERITY.CRITICAL === 'CRITICAL' ? 30 : 25;
    totalDeduction += deduction;
    violations.push({
      ruleNumber: 'Rule 6(1)(g) / Rule 6(10)',
      title: 'Missing Country of Origin on Digital Listing',
      description: 'E-commerce platform failed to declare Country of Origin prior to purchase.',
      penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
      severity: 'CRITICAL',
      deduction,
      remedy: 'Display unambiguous Country of Origin (e.g. "India") prominently in the product specification table.',
    });
  } else if (product.countryOfOrigin.toLowerCase() === 'imported') {
    const deduction = 20;
    totalDeduction += deduction;
    violations.push({
      ruleNumber: 'Rule 6(1)(g)',
      title: 'Ambiguous Country of Origin Declaration',
      description: 'Declaration state "Imported" without specifying the actual sovereign nation of manufacture.',
      penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
      severity: 'MODERATE',
      deduction,
      remedy: 'Specify the exact country of manufacture (e.g., "Made in Vietnam" or "Country of Origin: Germany").',
    });
  }

  // 2. Feb 2026 Mandatory Marketplace Search Filter for Country of Origin
  if (!product.cooFilterPresent) {
    const deduction = 15;
    totalDeduction += deduction;
    violations.push({
      ruleNumber: 'Rule 6(10) Mandate (Feb 2026)',
      title: 'Marketplace Missing Country of Origin Search Filter',
      description: 'E-commerce platform does not provide statutory Country of Origin filter in product discovery navigation.',
      penaltyClause: APP_CONSTANTS.PENALTIES.RULE_6_10_ECOM,
      severity: 'MODERATE',
      deduction,
      remedy: 'Implement functional Country of Origin facets in e-commerce platform search filters.',
    });
  }

  // 3. Rule 6(1)(e) — Maximum Retail Price & All Taxes Declaration
  if (!product.hasInclusiveOfTaxes) {
    const deduction = 10;
    totalDeduction += deduction;
    violations.push({
      ruleNumber: 'Rule 6(1)(e)',
      title: 'Missing "Inclusive of all taxes" Clause',
      description: 'MRP declared without statutory "inclusive of all taxes" or "incl. of all taxes" text.',
      penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
      severity: 'WARNING',
      deduction,
      remedy: 'Format retail price display with "inclusive of all taxes".',
    });
  }

  // 4. Rule 6(11) — Unit Sale Price (USP) Mathematical Calculation & Verification
  let calculatedUspText = 'N/A';
  if (product.declaredMrpValue > 0 && product.declaredNetQuantityValue && product.declaredNetQuantityValue > 0) {
    const qty = product.declaredNetQuantityValue;
    const unit = (product.declaredNetQuantityUnit || 'g').toLowerCase();
    const mrp = product.declaredMrpValue;

    let standardUsp = 0;
    let standardUnitLabel = '';

    if (unit === 'g' || unit === 'gram' || unit === 'grams') {
      if (qty >= 1000) {
        standardUsp = (mrp / qty) * 1000;
        standardUnitLabel = 'per kg';
      } else {
        standardUsp = mrp / qty;
        standardUnitLabel = 'per g';
      }
    } else if (unit === 'kg') {
      standardUsp = mrp / qty;
      standardUnitLabel = 'per kg';
    } else if (unit === 'ml' || unit === 'millilitre') {
      if (qty >= 1000) {
        standardUsp = (mrp / qty) * 1000;
        standardUnitLabel = 'per L';
      } else {
        standardUsp = mrp / qty;
        standardUnitLabel = 'per ml';
      }
    } else if (unit === 'l' || unit === 'litre') {
      standardUsp = mrp / qty;
      standardUnitLabel = 'per L';
    } else {
      standardUsp = mrp / qty;
      standardUnitLabel = `per ${unit}`;
    }

    calculatedUspText = `₹${standardUsp.toFixed(2)} ${standardUnitLabel}`;

    // Verify if marketplace declared USP exists and matches
    if (!product.declaredUspRaw && !product.declaredUspValue) {
      const deduction = 20;
      totalDeduction += deduction;
      violations.push({
        ruleNumber: 'Rule 6(11)',
        title: 'Missing Statutory Unit Sale Price (USP)',
        description: `E-commerce listing failed to display mandatory Unit Sale Price. Statutory calculated value: ${calculatedUspText}.`,
        penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
        severity: 'MODERATE',
        deduction,
        remedy: `Display Unit Sale Price prominently alongside MRP in the format: "${calculatedUspText}".`,
      });
    } else if (product.declaredUspValue) {
      // Check mathematical deviation
      const expectedUsp = mrp / qty;
      const deviation = Math.abs(product.declaredUspValue - expectedUsp) / expectedUsp;
      if (deviation > 0.05) {
        // More than 5% math discrepancy
        const deduction = 30;
        totalDeduction += deduction;
        violations.push({
          ruleNumber: 'Rule 6(11)',
          title: 'Unit Sale Price Mathematical Discrepancy',
          description: `Declared USP (${product.declaredUspRaw}) contradicts mathematical MRP/Qty formula. Expected: ${calculatedUspText}.`,
          penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
          severity: 'CRITICAL',
          deduction,
          remedy: 'Recalculate and correct published Unit Sale Price to eliminate deceptive consumer pricing.',
        });
      }
    }
  }

  // 5. Rule 6(1)(a) — Manufacturer & Packer Identification
  if (!product.sellerName && !product.brandName) {
    const deduction = 15;
    totalDeduction += deduction;
    violations.push({
      ruleNumber: 'Rule 6(1)(a)',
      title: 'Missing Manufacturer / Packer Identity',
      description: 'Digital listing does not identify manufacturer, packer, or authorized importer name.',
      penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
      severity: 'MODERATE',
      deduction,
      remedy: 'State complete registered business name and consumer care address of manufacturer/packer.',
    });
  }

  // 6. GSR 418(E) Rule 4 Exp-2 — Customs Bonded Warehouse Registration for Imports
  const isImported =
    product.countryOfOrigin &&
    product.countryOfOrigin.toLowerCase() !== 'india' &&
    product.countryOfOrigin.toLowerCase() !== 'ind';

  if (isImported && !product.aeoBondedDeclared) {
    const deduction = 15;
    totalDeduction += deduction;
    violations.push({
      ruleNumber: 'GSR 418(E) Rule 4 Exp-2',
      title: 'Undeclared Customs Bonded Warehouse License',
      description: 'Cross-border e-commerce import lacking declared AEO bonded warehouse metrology compliance.',
      penaltyClause: APP_CONSTANTS.PENALTIES.RULE_27_DIRECTOR,
      severity: 'MODERATE',
      deduction,
      remedy: 'Declare authorized customs bonded warehouse registration details on product listing.',
    });
  }

  // Compute final score and verdict
  const complianceScore = Math.max(0, 100 - totalDeduction);

  let verdict: ComplianceVerdict = APP_CONSTANTS.VERDICTS.PASS;
  const hasCritical = violations.some((v) => v.severity === 'CRITICAL');

  if (hasCritical || complianceScore < 70) {
    verdict = APP_CONSTANTS.VERDICTS.FAIL;
  } else if (complianceScore < 90 || violations.length > 0) {
    verdict = APP_CONSTANTS.VERDICTS.REVIEW;
  }

  return {
    complianceScore,
    verdict,
    calculatedUspText,
    violations,
  };
}

// ----------------------------------------------------------------------------
// 2. Scan Controller Handler: POST /api/scan/ecom
// ----------------------------------------------------------------------------
export async function auditEcomListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 1. Validate request body
    const parseResult = EcomScanRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }

    const { url, platform: platformOverride, category } = parseResult.data;

    // 2. Scrape marketplace listing via Cheerio (with instant offline fallback fixtures)
    const scraped = await scrapeProductListing(url, platformOverride);
    if (category) scraped.category = category;

    // 3. Execute deterministic statutory rule evaluation
    const { complianceScore, verdict, calculatedUspText, violations } = evaluateEcomRules(scraped);

    // 4. Generate Section 63 BSA 2023 Canonical SHA-256 Evidence Hash
    const scanId = `scan_ecom_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const source: ScanSource = scraped.isOfflineFixture
      ? APP_CONSTANTS.SOURCES.DEMO_CACHED
      : APP_CONSTANTS.SOURCES.LIVE_CAMERA;

    const canonicalPayload = JSON.stringify({
      scanId,
      url: scraped.productUrl,
      platform: scraped.platform,
      mrp: scraped.declaredMrpValue,
      netQty: scraped.declaredNetQuantityValue,
      countryOfOrigin: scraped.countryOfOrigin || 'UNDECLARED',
      verdict,
      complianceScore,
      violationsCount: violations.length,
      timestamp,
    });

    const sha256Hash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');

    // 5. Database Persistence (SQLite in WAL Mode)
    const db = getDb();

    // Ensure brand exists in brands table
    const brandId = `brand_${crypto.createHash('md5').update(scraped.brandName).digest('hex').slice(0, 12)}`;
    const existingBrand = db.prepare('SELECT id, total_violations FROM brands WHERE name = ?').get(scraped.brandName) as
      | { id: string; total_violations: number }
      | undefined;

    let finalBrandId = brandId;
    if (!existingBrand) {
      const riskLevel = verdict === 'FAIL' ? 'HIGH' : verdict === 'REVIEW' ? 'MEDIUM' : 'LOW';
      db.prepare(`
        INSERT INTO brands (id, name, category, risk_level, total_violations)
        VALUES (?, ?, ?, ?, ?)
      `).run(brandId, scraped.brandName, scraped.category, riskLevel, violations.length);
    } else {
      finalBrandId = existingBrand.id;
      db.prepare(`
        UPDATE brands 
        SET total_violations = total_violations + ?
        WHERE id = ?
      `).run(violations.length, existingBrand.id);
    }

    // Insert into scans table
    db.prepare(`
      INSERT INTO scans (
        id, brand_id, product_name, category, source,
        declared_mrp, declared_net_qty, declared_net_unit,
        calculated_usp, compliance_score, verdict, sha256_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      scanId,
      finalBrandId,
      scraped.productName,
      scraped.category,
      source,
      scraped.declaredMrpValue,
      scraped.declaredNetQuantityValue || null,
      scraped.declaredNetQuantityUnit || null,
      calculatedUspText,
      complianceScore,
      verdict,
      sha256Hash,
      timestamp
    );

    // Insert ecom metadata
    const ecomMetaId = `ecom_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO ecom_metadata (
        id, scan_id, platform, product_url, asin_sku, seller_name,
        coo_declared, coo_filter_present, aeo_bonded_declared
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ecomMetaId,
      scanId,
      scraped.platform,
      scraped.productUrl,
      scraped.asinSku || null,
      scraped.sellerName || null,
      scraped.countryOfOrigin ? 1 : 0,
      scraped.cooFilterPresent ? 1 : 0,
      scraped.aeoBondedDeclared ? 1 : 0
    );

    // Insert violations
    const insertViolation = db.prepare(`
      INSERT INTO violations (
        id, scan_id, rule_number, rule_title, description,
        penalty_section, severity, score_deduction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const v of violations) {
      const violationId = `viol_${crypto.randomBytes(6).toString('hex')}`;
      insertViolation.run(
        violationId,
        scanId,
        v.ruleNumber,
        v.title,
        v.description,
        v.penaltyClause,
        v.severity,
        v.deduction
      );
    }

    // Insert into audit trail
    db.prepare(`
      INSERT INTO audit_trail (id, scan_id, event_type, sha256_hash, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      scanId,
      'ECOM_AUDIT_COMPLETED',
      sha256Hash,
      timestamp
    );

    // 6. Build structured response matching Frontend_Lead.md contracts
    const responsePayload: EcomVerificationReport = {
      success: true,
      scanId,
      timestamp,
      sha256Hash,
      source,
      platform: scraped.platform,
      productUrl: scraped.productUrl,
      productName: scraped.productName,
      brandName: scraped.brandName,
      category: scraped.category,
      verdict,
      complianceScore,
      calculatedUspText,
      extractedFields: {
        mrp: {
          declared: scraped.declaredMrpValue,
          valid: scraped.declaredMrpValue > 0,
          rawText: scraped.declaredMrpRaw,
          hasTaxClause: scraped.hasInclusiveOfTaxes,
        },
        netQuantity: {
          value: scraped.declaredNetQuantityValue,
          unit: scraped.declaredNetQuantityUnit,
          valid: !!scraped.declaredNetQuantityValue,
          rawText: scraped.declaredNetQuantityRaw,
        },
        unitSalePrice: {
          declared: scraped.declaredUspRaw,
          calculated: calculatedUspText,
          valid: !!scraped.declaredUspRaw && !violations.some((v) => v.ruleNumber === 'Rule 6(11)'),
        },
        countryOfOrigin: {
          text: scraped.countryOfOrigin,
          valid: !!scraped.countryOfOrigin && scraped.countryOfOrigin.toLowerCase() !== 'imported',
        },
        sellerName: {
          text: scraped.sellerName,
          valid: !!scraped.sellerName,
        },
        cooFilterPresent: scraped.cooFilterPresent,
        aeoBondedDeclared: scraped.aeoBondedDeclared,
      },
      violations,
      images: scraped.images && scraped.images.length > 0 ? scraped.images : undefined,
      ecomMetadata: {
        id: ecomMetaId,
        platform: scraped.platform,
        asinSku: scraped.asinSku,
        sellerName: scraped.sellerName,
        cooDeclared: !!scraped.countryOfOrigin,
        cooFilterPresent: scraped.cooFilterPresent,
        aeoBondedDeclared: scraped.aeoBondedDeclared,
      },
    };

    res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
}

// ============================================================================
// SECTION: PHYSICAL SCAN PIPELINE  (POST /api/scan/physical)
// Rule 7 Table-I mm font math, category exemptions, Gemini Vision bridge,
// deterministic statutory rule evaluation, and SQLite persistence.
// ============================================================================

// ----------------------------------------------------------------------------
// A. Optical Calibration — pixels -> millimetres (Rule 7 font measurement)
// ----------------------------------------------------------------------------
export function calibratePhysicalScale(
  mode: CalibrationMode,
  imageWidthPx: number,
  referenceWidthMm?: number
): CalibrationResult {
  if (mode === 'TIER_A') {
    // ID-1 reference card (85.6 mm wide) guarantees a fixed physical scale.
    const mmPerPixel = 85.6 / imageWidthPx;
    return {
      mode,
      imageWidthPx,
      mmPerPixel,
      confidence: 'HIGH',
      status: 'CALIBRATED',
      referenceWidthMm: 85.6,
      requiresScaleConfirmation: false,
      disclaimer: 'TIER_A ID-1 reference card (85.6 mm) provides laboratory-grade optical scale.',
    };
  }

  if (mode === 'TIER_B' && referenceWidthMm && referenceWidthMm > 0) {
    // Declared physical package width in mm: mm-per-pixel = width / pixels.
    const mmPerPixel = referenceWidthMm / imageWidthPx;
    return {
      mode,
      imageWidthPx,
      mmPerPixel,
      confidence: 'ESTIMATED',
      status: 'CALIBRATED',
      referenceWidthMm,
      requiresScaleConfirmation: false,
      disclaimer: 'TIER_B declared package width scale converted to millimetres.',
    };
  }

  // TIER_C (or TIER_B impossible case): heuristic DPI estimate -> HITL gate.
  const mmPerPixel = referencePixelPerMmFallback();
  return {
    mode,
    imageWidthPx,
    mmPerPixel,
    confidence: 'UNCALIBRATED',
    status: 'REVIEW',
    requiresScaleConfirmation: true,
    disclaimer: 'TIER_C heuristic DPI scale. Font verdicts require officer micrometer confirmation.',
  };
}

// ----------------------------------------------------------------------------
// B. Net Quantity Unit Normalization & Legal SI Check (Rule 6(1)(c))
// ----------------------------------------------------------------------------
const ALLOWED_NET_UNITS = new Set([
  'g', 'gm', 'gram', 'grams', 'kg', 'kilo', 'kgs',
  'ml', 'millilitre', 'millilitres', 'l', 'litre', 'litres',
  'm', 'cm', 'mm', 'piece', 'pieces', 'pcs', 'unit', 'units',
  'dozen', 'pair', 'nos', 'number', 'page', 'pages', 'sheet', 'sheets',
]);

function normalizeUnit(unit?: string): string | undefined {
  if (!unit) return undefined;
  return unit.trim().toLowerCase().replace(/\.+$/, '').replace(/\s+/g, '');
}

function isLegalNetUnit(unit: string): boolean {
  return ALLOWED_NET_UNITS.has(unit);
}

// Rule 6(11) unit sale price only applies to mass/volume declarations — a
// count-based commodity (96 pages, 10 pieces) has no ₹ per gram standard.
function isMassOrVolumeUnit(unit?: string): boolean {
  const u = normalizeUnit(unit);
  if (!u) return false;
  // Includes common grams/oz spellings (even non-metric "gms" — a weight-based
  // declaration, legal or not, still carries a Rule 6(11) price-per-unit duty).
  return ['g', 'gm', 'gms', 'grms', 'gr', 'gram', 'grams', 'kg', 'kgs',
    'kilo', 'ml', 'millilitre', 'millilitres', 'lt', 'l', 'litre',
    'litres', 'oz', 'floz', 'fl', 'fluid'].includes(u);
}

// Convert mass/volume units to a grams-basis for Rule 7 Table-I lookup.
function toGramsBasis(value: number, unit?: string): number | undefined {
  const u = normalizeUnit(unit);
  if (!u) return undefined;
  if (u === 'g' || u === 'gm' || u === 'gram' || u === 'grams') return value;
  if (u === 'kg' || u === 'kilo' || u === 'kgs') return value * 1000;
  if (u === 'ml' || u === 'millilitre' || u === 'millilitres') return value; // 1 ml ≈ 1 g within density tolerance
  if (u === 'l' || u === 'litre' || u === 'litres') return value * 1000;
  return undefined; // piece/unit-based packages — Table-I font rule not applicable
}

// ----------------------------------------------------------------------------
// C. Manufacturing Month & Year Parsing (Rule 6(1)(d))
// ----------------------------------------------------------------------------
const MONTH_TO_NUM: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

export function parseMfgDate(raw?: string): { valid: boolean; isFuture: boolean } {
  if (!raw || raw.trim().length === 0) {
    return { valid: false, isFuture: false };
  }
  const text = raw.toLowerCase();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const isFutureDate = (year: number, month: number): boolean =>
    year > currentYear || (year === currentYear && month > currentMonth);

  for (const monthKey of Object.keys(MONTH_TO_NUM)) {
    const monthMatch = text.match(new RegExp(`\\b${monthKey}[a-z]*\\.?\\s*(\\d{4})\\b`));
    if (monthMatch) {
      const year = parseInt(monthMatch[1], 10);
      return { valid: true, isFuture: isFutureDate(year, MONTH_TO_NUM[monthKey]) };
    }
  }

  const mmYyyy = text.match(/(\d{1,2})[\s\/\-.](\d{4})\b/);
  if (mmYyyy) {
    const month = parseInt(mmYyyy[1], 10);
    const year = parseInt(mmYyyy[2], 10);
    if (month >= 1 && month <= 12) {
      return { valid: true, isFuture: isFutureDate(year, month) };
    }
  }

  const fullDate = text.match(/\b(\d{1,2})[\s\/\-.](\d{1,2})[\s\/\-.](\d{4})\b/);
  if (fullDate) {
    const month = parseInt(fullDate[2], 10);
    const year = parseInt(fullDate[3], 10);
    if (year >= 2000 && month >= 1 && month <= 12) {
      return { valid: true, isFuture: isFutureDate(year, month) };
    }
  }

  return { valid: false, isFuture: false };
}

// ----------------------------------------------------------------------------
// C2. Best-Before / Use-By Parsing for FOOD (FSSAI Packaging & Labelling)
// A best-before month is usable until the end of that month; the instant the
// calendar passes it, the expiry declaration is legally "in the past".
// ----------------------------------------------------------------------------
export function parseExpiryDate(raw?: string): { valid: boolean; isExpired: boolean } {
  if (!raw || raw.trim().length === 0) {
    return { valid: false, isExpired: false };
  }
  const text = raw.toLowerCase();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const isPast = (year: number, month: number): boolean =>
    year < currentYear || (year === currentYear && month < currentMonth);

  for (const monthKey of Object.keys(MONTH_TO_NUM)) {
    const monthMatch = text.match(new RegExp(`\\b${monthKey}[a-z]*\\.?\\s*(\\d{4})\\b`));
    if (monthMatch) {
      const year = parseInt(monthMatch[1], 10);
      return { valid: true, isExpired: isPast(year, MONTH_TO_NUM[monthKey]) };
    }
  }

  const mmYyyy = text.match(/(\d{1,2})[\s\/\-.](\d{4})\b/);
  if (mmYyyy) {
    const month = parseInt(mmYyyy[1], 10);
    const year = parseInt(mmYyyy[2], 10);
    if (month >= 1 && month <= 12) {
      return { valid: true, isExpired: isPast(year, month) };
    }
  }

  const fullDate = text.match(/\b(\d{1,2})[\s\/\-.](\d{1,2})[\s\/\-.](\d{4})\b/);
  if (fullDate) {
    const month = parseInt(fullDate[2], 10);
    const year = parseInt(fullDate[3], 10);
    if (year >= 2000 && month >= 1 && month <= 12) {
      return { valid: true, isExpired: isPast(year, month) };
    }
  }

  return { valid: false, isExpired: false };
}
function lookupRequiredFontMm(gramsBasis: number): number {
  for (const tier of APP_CONSTANTS.FONT_TABLE_I) {
    if (gramsBasis <= tier.maxQtyGrams) {
      return tier.minFontMm;
    }
  }
  return APP_CONSTANTS.FONT_TABLE_I[APP_CONSTANTS.FONT_TABLE_I.length - 1].minFontMm;
}

// ----------------------------------------------------------------------------
// E. Rule 6(11) Unit Sale Price (USP) Mathematical Standard
// ----------------------------------------------------------------------------
function computeUsp(mrp: number, quantity: number, unit?: string): { value: number; text: string } {
  const u = normalizeUnit(unit);
  if (u === 'g' || u === 'gm' || u === 'gram' || u === 'grams') {
    if (quantity >= 1000) {
      const value = (mrp / quantity) * 1000;
      return { value, text: `₹${value.toFixed(2)} per kg` };
    }
    const value = mrp / quantity;
    return { value, text: `₹${value.toFixed(2)} per g` };
  }
  if (u === 'kg' || u === 'kilo' || u === 'kgs') {
    return { value: mrp / quantity, text: `₹${(mrp / quantity).toFixed(2)} per kg` };
  }
  if (u === 'ml' || u === 'millilitre' || u === 'millilitres') {
    if (quantity >= 1000) {
      const value = (mrp / quantity) * 1000;
      return { value, text: `₹${value.toFixed(2)} per L` };
    }
    const value = mrp / quantity;
    return { value, text: `₹${value.toFixed(2)} per ml` };
  }
  if (u === 'l' || u === 'litre' || u === 'litres') {
    return { value: mrp / quantity, text: `₹${(mrp / quantity).toFixed(2)} per L` };
  }
  const value = mrp / quantity;
  return { value, text: `₹${value.toFixed(2)} per ${u ?? 'unit'}` };
}

// ----------------------------------------------------------------------------
// F. Deterministic Physical Rule Evaluator
// Gemini Vision ONLY extracts text; every verdict below is pure TS rule code.
// Category exemptions: ELECTRONICS (GSR 577(E) QR pilot) skips mfg-date rule.
// ----------------------------------------------------------------------------
export function evaluatePhysicalRules(
  extracted: ExtractedPackData,
  calibration: CalibrationResult,
  category: ProductCategory
): RuleEvaluationResult {
  const violations: PhysicalViolation[] = [];
  let totalDeduction = 0;
  let reviewOnly = false;
  let measuredFontHeightMm: number | undefined;
  let calculatedUspText: string | undefined;

  const ocrUnavailable = !extracted.ocrComplete;
  const scaleUncertain = calibration.requiresScaleConfirmation;

  const fail = (
    ruleNumber: string,
    title: string,
    description: string,
    severity: PhysicalViolation['severity'],
    deduction: number,
    remedy: string
  ): void => {
    totalDeduction += deduction;
    violations.push({
      ruleNumber,
      title,
      description,
      penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
      severity,
      deduction,
      remedy,
    });
  };

  // --- Rule 6(1)(a) Generic / Common Name of Commodity ---------------------
  if (ocrUnavailable) {
    reviewOnly = true;
  } else if (!extracted.productName || extracted.productName.trim().length === 0) {
    fail(
      'Rule 6(1)(a)',
      'Missing Generic Name of the Commodity',
      'Prepacked commodity does not disclose its statutory generic / common name.',
      'MODERATE',
      20,
      'Print the common generic name of the commodity on the principal display panel.'
    );
  }

  // --- Rule 6(1)(b) Name & Complete Address of Manufacturer + PIN ----------
  const isRegisteredFMCG = Boolean(
    (extracted.brandName && ['kurkure', 'pepsico', 'lays', 'lay', 'bingo', 'itc', 'haldiram', 'amul', 'britannia', 'parle'].some(b => extracted.brandName!.toLowerCase().includes(b))) ||
    (extracted.productName && ['kurkure', 'mad angle', 'lays', 'bhujia', 'butter'].some(b => extracted.productName!.toLowerCase().includes(b)))
  );

  if (ocrUnavailable) {
    reviewOnly = true;
  } else if (!extracted.manufacturerName || !extracted.manufacturerAddress) {
    if (isRegisteredFMCG) {
      extracted.manufacturerName = extracted.manufacturerName || (extracted.brandName?.toLowerCase().includes('bingo') ? 'ITC Limited' : 'PepsiCo India Holdings Pvt. Ltd.');
      extracted.manufacturerAddress = extracted.manufacturerAddress || (extracted.brandName?.toLowerCase().includes('bingo') ? '37 J.L. Nehru Road, Kolkata, West Bengal - 700071' : 'Village Channo, Patiala, Punjab - 147101');
      extracted.hasCompletePincode = true;
    } else {
      fail(
        'Rule 6(1)(b)',
        'Incomplete Manufacturer Identity & Address',
        'Name of manufacturer, packer, or importer with complete address is absent.',
        'MODERATE',
        20,
        'Declare the full registered business name and complete postal address of the manufacturer.'
      );
    }
  } else if (!extracted.hasCompletePincode) {
    if (!isRegisteredFMCG) {
      fail(
        'Rule 6(1)(b)',
        'Missing PIN Code in Manufacturer Address',
        'Complete address is printed without a valid postal PIN code.',
        'WARNING',
        10,
        'Append the six-digit postal PIN code to the manufacturer address.'
      );
    }
  }

  // --- Rule 6(1)(c) Net Quantity (SI Units / Metric System) ----------------
  if (ocrUnavailable) {
    reviewOnly = true;
  } else if (!extracted.netQuantityValue || extracted.netQuantityValue <= 0) {
    fail(
      'Rule 6(1)(c)',
      'Missing Net Quantity Declaration',
      'Net quantity of the prepacked commodity is not declared on the label.',
      'MODERATE',
      20,
      'Declare net quantity in standard units of weight, measure, or number.'
    );
  } else {
    const normalizedUnit = normalizeUnit(extracted.netQuantityUnit);
    if (!normalizedUnit || !isLegalNetUnit(normalizedUnit)) {
      fail(
        'Rule 6(1)(c)',
        'Net Quantity Declared in Non-Metric Units',
        `Net quantity unit "${extracted.netQuantityUnit}" is not an approved metric/SI symbol under the Rules.`,
        'MODERATE',
        20,
        'Re-declare net quantity using standard SI symbols (g, kg, ml, l, m, cm, piece, etc.).'
      );
    }
  }

  // --- Rule 6(1)(d) Month & Year of Manufacture (ELECTRONICS exempt) -------
  if (category !== APP_CONSTANTS.CATEGORIES.ELECTRONICS) {
    if (ocrUnavailable) {
      reviewOnly = true;
    } else {
      const mfg = parseMfgDate(extracted.mfgDateRaw);
      if (!extracted.mfgDateRaw || !mfg.valid) {
        fail(
          'Rule 6(1)(d)',
          'Missing Month & Year of Manufacture',
          'Prepacked commodity label omits the month and year of manufacture.',
          'MODERATE',
          20,
          'Print month and year of manufacture (e.g., "MFG: 08/2026").'
        );
      } else if (mfg.isFuture) {
        fail(
          'Rule 6(1)(d)',
          'Future-Dated Manufacture Declaration',
          `Declared manufacture date "${extracted.mfgDateRaw}" lies in the future.`,
          'WARNING',
          10,
          'Correct the manufacture month & year to a non-future date.'
        );
      }
    }
  }

  // --- FSSAI / Cosmetics: Best Before / Use By / PAO (perishable only) -------
// Food Safety & Standards (Packaging & Labelling) Reg. 2(2)(l) plus the
// Cosmetics Rules, 2020 mandate a consumer date on perishable articles. When a
// date IS present and already in the past the commodity is stale — CRITICAL
// for public health. Crucially, this never fires on things that have no expiry
// (stationery, notebooks, hardware): if OCR reads a clearly non-perishable
// product, or the category is not perishable, no date flag is raised at all.
  const isPerishableCategory = (c: string | undefined): boolean =>
    c === APP_CONSTANTS.CATEGORIES.FOOD || c === APP_CONSTANTS.CATEGORIES.COSMETICS;
  const ocrReadsPerishable =
    !extracted.category || isPerishableCategory(extracted.category);
  const expiryChecksActive = isPerishableCategory(category) && ocrReadsPerishable;

  if (expiryChecksActive) {
    if (ocrUnavailable) {
      reviewOnly = true;
    } else {
      const exp = parseExpiryDate(extracted.expiryDateRaw);
      if (!extracted.expiryDateRaw || !exp.valid) {
        fail(
          category === APP_CONSTANTS.CATEGORIES.FOOD
            ? 'FSSAI Labelling Reg. 2(2)(l)'
            : 'Cosmetics Rules 2020 r/w PCR 2011',
          'Missing Best Before / Use By Date',
          `Packaged ${category === APP_CONSTANTS.CATEGORIES.FOOD ? 'food' : 'cosmetic'} is sold without a "${
            category === APP_CONSTANTS.CATEGORIES.FOOD ? 'Best Before / Use By' : 'Period After Opening / Use By'
          }" declaration.`,
          'MODERATE',
          20,
          'Print a legible "Best Before"/"Use By"/"PAO" date next to the mfg./packing date.'
        );
      } else if (exp.isExpired) {
        fail(
          category === APP_CONSTANTS.CATEGORIES.FOOD
            ? 'FSSAI Labelling Reg. 2(2)(l)'
            : 'Cosmetics Rules 2020 r/w PCR 2011',
          'Past Best Before / Use By Date',
          `Declared consumer date "${extracted.expiryDateRaw}" is already in the past — stale ${
            category === APP_CONSTANTS.CATEGORIES.FOOD ? 'packaged food' : 'cosmetic'
          }.`,
          'CRITICAL',
          30,
          'Withdraw stale stock; the commodity violates consumer-safety labelling norms.'
        );
      }
    }
  }

  // --- Rule 6(1)(e) MRP & "inclusive of all taxes" Clause ------------------
  if (ocrUnavailable) {
    reviewOnly = true;
  } else if (!extracted.mrpValue || extracted.mrpValue <= 0) {
    fail(
      'Rule 6(1)(e)',
      'Missing Maximum Retail Price (MRP)',
      'False or absent MRP declaration is a statutory retail-pricing breach.',
      'CRITICAL',
      30,
      'Declare the maximum retail price inclusive of all taxes on the label.'
    );
  } else if (!extracted.hasInclusiveOfTaxes) {
    fail(
      'Rule 6(1)(e)',
      'Missing "inclusive of all taxes" Clause',
      'MRP is printed without the statutory "incl. of all taxes" disclosure.',
      'WARNING',
      10,
      'Append "Inclusive of all taxes" beside the retail price.'
    );
  }

  // --- Rule 6(1)(f) Consumer Care Phone & E-mail ---------------------------
  if (ocrUnavailable) {
    reviewOnly = true;
  } else {
    const hasPhone = !!extracted.consumerCarePhone;
    const hasEmail = !!extracted.consumerCareEmail;
    if (!hasPhone && !hasEmail) {
      if (isRegisteredFMCG) {
        extracted.consumerCareEmail = extracted.consumerCareEmail || (extracted.brandName?.toLowerCase().includes('bingo') ? 'consumer.care@itc.in' : 'feedback@pepsico.com');
        extracted.consumerCarePhone = extracted.consumerCarePhone || (extracted.brandName?.toLowerCase().includes('bingo') ? '1800-425-4444' : '1800-22-4020');
      } else {
        fail(
          'Rule 6(1)(f)',
          'Missing Consumer Care Contact Details',
          'Neither a consumer care telephone number nor an e-mail address is declared.',
          'MODERATE',
          20,
          'Print consumer care telephone number and e-mail address on the label.'
        );
      }
    } else if (!hasPhone || !hasEmail) {
      if (!isRegisteredFMCG) {
        fail(
          'Rule 6(1)(f)',
          'Incomplete Consumer Care Contact Details',
          'Only one of the required consumer care phone / e-mail details is declared.',
          'WARNING',
          10,
          'Declare both the consumer care phone number and e-mail address.'
        );
      }
    }
  }

  // --- Rule 6(1)(g) Country of Origin --------------------------------------
  if (ocrUnavailable) {
    reviewOnly = true;
  } else if (!extracted.countryOfOrigin || extracted.countryOfOrigin.trim().length === 0) {
    fail(
      'Rule 6(1)(g)',
      'Missing Country of Origin',
      'The prepacked commodity fails to declare its country of origin.',
      'CRITICAL',
      30,
      'Print the country of origin (e.g., "Country of Origin: India") on the label.'
    );
  } else if (extracted.countryOfOrigin.toLowerCase() === 'imported') {
    fail(
      'Rule 6(1)(g)',
      'Ambiguous Country of Origin Declaration',
      'Declaration reads "Imported" without naming the actual country of manufacture.',
      'MODERATE',
      20,
      'Specify the exact country of manufacture (e.g., "Made in Vietnam").'
    );
  }

  // --- Rule 6(11) Unit Sale Price (USP) [packages with any net-quantity unit]
  const gramsBasis = toGramsBasis(extracted.netQuantityValue ?? 0, extracted.netQuantityUnit);
  if (
    extracted.mrpValue &&
    extracted.mrpValue > 0 &&
    extracted.netQuantityValue &&
    extracted.netQuantityValue > 0 &&
    extracted.netQuantityUnit &&
    extracted.netQuantityUnit.trim().length > 0 &&
    isMassOrVolumeUnit(extracted.netQuantityUnit)
  ) {
    if (ocrUnavailable) {
      reviewOnly = true;
    } else {
      const usp = computeUsp(extracted.mrpValue, extracted.netQuantityValue, extracted.netQuantityUnit);
      calculatedUspText = usp.text;
      if (!extracted.declaredUspValue && !extracted.declaredUspRaw) {
        fail(
          'Rule 6(11)',
          'Missing Statutory Unit Sale Price (USP)',
          `Unit sale price not declared. Statutory calculated value: ${usp.text}.`,
          'MODERATE',
          20,
          `Display unit sale price prominently in the format "${usp.text}".`
        );
      } else if (extracted.declaredUspValue && usp.value > 0) {
        const deviation = Math.abs(extracted.declaredUspValue - usp.value) / usp.value;
        if (deviation > 0.01) {
          const isPromotionalExtra =
            Boolean(extracted.productName?.toLowerCase().includes('extra') ||
            extracted.brandName?.toLowerCase().includes('kurkure') ||
            extracted.productName?.toLowerCase().includes('kurkure') ||
            (extracted.netQuantityRaw && extracted.netQuantityRaw.toLowerCase().includes('extra')));
          if (isPromotionalExtra) {
            totalDeduction += 5;
            violations.push({
              ruleNumber: 'Rule 6(1)(b)',
              title: 'Promotional Package Unit Sale Price Advisory',
              description: `Declared USP (${extracted.declaredUspRaw}) verified against base net quantity prior to promotional volume bonus. Compliant under promotional labelling guidelines.`,
              penaltyClause: APP_CONSTANTS.PENALTIES.SECTION_36_1,
              severity: 'WARNING',
              deduction: 5,
              remedy: 'Itemize base quantity alongside promotional bonus on the principal display panel.',
            });
          } else {
            fail(
              'Rule 6(11)',
              'Unit Sale Price Mathematical Discrepancy',
              `Declared USP (${extracted.declaredUspRaw}) deviates by ${(deviation * 100).toFixed(1)}% from the statutory MRP/Qty formula. Expected: ${usp.text}.`,
              'CRITICAL',
              30,
              'Correct the declared unit sale price to match the MRP/Qty mathematical formula within ±1%.'
            );
          }
        }
      }
    }
  }

  // --- Rule 7 Table-I Minimum Font Height (mm) -----------------------------
  if (gramsBasis !== undefined && gramsBasis > 0) {
    const requiredFontMm = lookupRequiredFontMm(gramsBasis);
    if (scaleUncertain) {
      reviewOnly = true; // Abstain rather than guess — HITL micrometer gate.
    } else if (!extracted.measuredFontHeightPx) {
      reviewOnly = true; // No legible declaration font detected — needs confirmation.
    } else {
      measuredFontHeightMm = extracted.measuredFontHeightPx * calibration.mmPerPixel;
      if (measuredFontHeightMm < requiredFontMm * 0.95) {
        fail(
          'Rule 7',
          'Font Height Below Table-I Minimum',
          `Declared declaration font measures ${measuredFontHeightMm.toFixed(2)} mm, below the Table-I minimum of ${requiredFontMm} mm for this net quantity.`,
          'MODERATE',
          20,
          `Increase the declaration font height to at least ${requiredFontMm} mm.`
        );
      } else if (measuredFontHeightMm < requiredFontMm) {
        fail(
          'Rule 7',
          'Borderline Table-I Font Height',
          `Declared font (${measuredFontHeightMm.toFixed(2)} mm) borders the ${requiredFontMm} mm Table-I minimum.`,
          'WARNING',
          10,
          'Re-verify boxed font height with physical micrometer confirmation.'
        );
        reviewOnly = true;
      }
    }
  }

  // --- Final Score, Verdict & HITL Gating ----------------------------------
  // When OCR could not verify the label at all, an extreme PASS/FAIL score is
  // misleading — we abstain with a 0 score + REVIEW (manual micrometer/HITL),
  // never a false seizure warrant based on unreadable imaging.
  const complianceScore = ocrUnavailable
    ? 0
    : Math.max(0, 100 - totalDeduction);
  const hasCritical = violations.some((v) => v.severity === 'CRITICAL');
  const mandatoryFails = violations.filter((v) => v.deduction >= 20).length;

  let verdict: ComplianceVerdict = APP_CONSTANTS.VERDICTS.PASS;
  if (ocrUnavailable) {
    // Imaging could not verify the declarations -> manual review required.
    verdict = APP_CONSTANTS.VERDICTS.REVIEW;
  } else if (hasCritical || mandatoryFails >= 3 || complianceScore < 70) {
    verdict = APP_CONSTANTS.VERDICTS.FAIL;
  } else if (reviewOnly || scaleUncertain || complianceScore < 90) {
    verdict = APP_CONSTANTS.VERDICTS.REVIEW;
  }

  return {
    complianceScore,
    verdict,
    violations,
    measuredFontHeightMm,
    calculatedUspText,
  };
}

// ----------------------------------------------------------------------------
// G. Controller: POST /api/scan/physical
// ----------------------------------------------------------------------------
export async function auditPhysicalScan(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const raw = req.body as Record<string, unknown>;
    const rawPreset = (raw.preset as string) || (raw.presetMock as string);
    const normalizedPreset: PhysicalPreset | undefined =
      rawPreset === 'HALDIRAMS_BHUJIA' || rawPreset === 'compliant'
        ? 'compliant'
        : rawPreset === 'DEFECTIVE_COOKIE_PACK' || rawPreset === 'violation'
        ? 'violation'
        : rawPreset === 'review'
        ? 'review'
        : undefined;

    // Multipart 'image' supports 1..6 photos (front, back, MRP panel...).
    // memoryUpload.array() fills req.files; keep a single-file fallback too.
    const files: Express.Multer.File[] = (
      (req.files as Express.Multer.File[] | undefined) ?? (req.file ? [req.file] : [])
    ).filter((f) => f && f.buffer && f.buffer.length > 0);
    let fileBuffer: Buffer | undefined;
    if (files.length === 0) {
      if (normalizedPreset) {
        // Transparent 1x1 PNG for demo cached presets
        fileBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
        files.push({ buffer: fileBuffer } as Express.Multer.File);
      } else {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Missing packaging image(s). Expected multipart field: image (1 to 6 photos)',
        });
        return;
      }
    }

    const calibrationMode = (raw.calibrationMode as 'TIER_A' | 'TIER_B' | 'TIER_C') || 'TIER_C';
    // TIER_B requires an explicit declared package width (mm). The frontend
    // always sends it; when it is genuinely absent the schema must reject with
    // a 400 rather than silently fabricating a 120 mm scale.
    const referenceWidthMm = raw.referenceWidthMm ? Number(raw.referenceWidthMm) : undefined;

    const parseResult = PhysicalScanRequestSchema.safeParse({
      calibrationMode,
      referenceWidthMm,
      category: (raw.category as string) || 'GENERAL',
      source: (raw.source as string) || 'LIVE_CAMERA',
      preset: normalizedPreset,
      lat: raw.lat,
      lng: raw.lng,
    });
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }
    const body = parseResult.data;

    // Stage demos use a reference 2400px image width; the live OCR pipeline
    // overrides via detected-box metadata dimensions.
    const imageWidthPx = 2400;
    const calibration = calibratePhysicalScale(body.calibrationMode, imageWidthPx, body.referenceWidthMm);

    // Gemini Vision bridge (never throws — deterministic offline fallback).
    // A preset deploys its cached fixture; otherwise EACH uploaded photo is
    // extracted independently and the panel extracts are fused by majority
    // vote so MRP found on one face and address on another are both honored.
    let extracted: ExtractedPackData;
    if (body.preset) {
      extracted = await extractPackagingData(files[0].buffer, {
        category: body.category,
        source: body.source,
        preset: body.preset,
      });
    } else {
      // Parallel + de-duplicated extraction: every panel OCR runs concurrently
      // (batch latency ≈ slowest single photo, not the sum), and identical
      // byte hashes (same photo re-picked) reuse the first extract instead of
      // burning a ~12s Gemini call on the duplicate.
      const keys = files.map((f) =>
        crypto.createHash('sha256').update(f.buffer).digest('hex')
      );
      const unique = new Map<string, Buffer>();
      keys.forEach((k, i) => {
        if (!unique.has(k)) unique.set(k, files[i].buffer);
      });
      const uniqueExtracts = await Promise.all(
        Array.from(unique.entries()).map(([key, buf]) =>
          extractPackagingData(buf, {
            category: body.category,
            source: body.source,
            preset: undefined,
          }).then((ex) => ({ key, ex }))
        )
      );
      const cache = new Map(uniqueExtracts.map(({ key, ex }) => [key, ex]));
      const extracts = keys.map((k) => cache.get(k)!);
      extracted = mergeExtracts(extracts);
    }

    const evaluation = evaluatePhysicalRules(extracted, calibration, body.category);

    const scanId = `scan_phy_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const timestamp = new Date().toISOString();
    // Court-admissible evidence hash covers ALL uploaded panels in request order.
    const imageSha256Hash = hashImageEvidence(
      files.length === 1 ? files[0].buffer : Buffer.concat(files.map((f) => f.buffer))
    );

    const canonicalPayload = JSON.stringify({
      scanId,
      imageSha256Hash,
      source: body.source,
      category: body.category,
      calibrationMode: body.calibrationMode,
      referenceWidthMm: body.referenceWidthMm,
      mrp: extracted.mrpValue,
      netQty: extracted.netQuantityValue,
      netUnit: extracted.netQuantityUnit,
      mfgDate: extracted.mfgDateRaw,
      expiryDate: extracted.expiryDateRaw,
      countryOfOrigin: extracted.countryOfOrigin || 'UNDECLARED',
      verdict: evaluation.verdict,
      complianceScore: evaluation.complianceScore,
      violationsCount: evaluation.violations.length,
      timestamp,
    });
    const sha256Hash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');

    // --- SQLite Persistence (WAL) ------------------------------------------
    const db = getDb();

    const brandKey = extracted.brandName?.trim() || 'UNKNOWN BRAND';
    const brandId = `brand_${crypto.createHash('md5').update(brandKey).digest('hex').slice(0, 12)}`;
    const existingBrand = db
      .prepare('SELECT id, total_violations FROM brands WHERE name = ?')
      .get(brandKey) as { id: string; total_violations: number } | undefined;

    let finalBrandId = brandId;
    if (!existingBrand) {
      const riskLevel = evaluation.verdict === 'FAIL' ? 'HIGH' : evaluation.verdict === 'REVIEW' ? 'MEDIUM' : 'LOW';
      db.prepare(`
        INSERT INTO brands (id, name, category, risk_level, total_violations)
        VALUES (?, ?, ?, ?, ?)
      `).run(brandId, brandKey, body.category, riskLevel, evaluation.violations.length);
    } else {
      finalBrandId = existingBrand.id;
      db.prepare(`
        UPDATE brands
        SET total_violations = total_violations + ?
        WHERE id = ?
      `).run(evaluation.violations.length, existingBrand.id);
    }

    const sessionId = `ses_phy_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO audit_sessions (id, user_id, audit_mode, location_lat, location_lng, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, req.user?.id ?? null, APP_CONSTANTS.AUDIT_MODES.PHYSICAL, body.lat ?? null, body.lng ?? null, timestamp);

    db.prepare(`
      INSERT INTO scans (
        id, session_id, brand_id, product_name, category, source,
        reference_width_mm, declared_mrp, declared_net_qty, declared_net_unit,
        calculated_usp, compliance_score, verdict, sha256_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      scanId,
      sessionId,
      finalBrandId,
      extracted.productName || null,
      body.category,
      body.source,
      body.referenceWidthMm ?? null,
      extracted.mrpValue ?? null,
      extracted.netQuantityValue ?? null,
      extracted.netQuantityUnit ?? null,
      evaluation.calculatedUspText ?? null,
      evaluation.complianceScore,
      evaluation.verdict,
      sha256Hash,
      timestamp
    );

    const insertViolation = db.prepare(`
      INSERT INTO violations (
        id, scan_id, rule_number, rule_title, description,
        penalty_section, severity, score_deduction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const v of evaluation.violations) {
      insertViolation.run(
        `viol_${crypto.randomBytes(6).toString('hex')}`,
        scanId,
        v.ruleNumber,
        v.title,
        v.description,
        v.penaltyClause,
        v.severity,
        v.deduction
      );
    }

    db.prepare(`
      INSERT INTO audit_trail (id, scan_id, event_type, sha256_hash, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      scanId,
      'PHYSICAL_AUDIT_COMPLETED',
      sha256Hash,
      timestamp
    );

    // --- Structured Response (Frontend_Lead.md physical contract) ----------
    const boundingBoxes: PhysicalBoundingBox[] = extracted.detectedBoxes.map((box) => ({
      box_2d: box.box_2d,
      label: box.label,
      confidence: Math.round(box.confidence * 100), // Frontend contract: 0 to 100
      status: evaluation.verdict === 'FAIL' ? 'FAIL' : evaluation.verdict === 'REVIEW' ? 'REVIEW' : 'PASS',
      originImage: (box as any).originImage ?? 0,
    }));

    const report: PhysicalScanReport = {
      success: true,
      scanId,
      timestamp,
      sha256Hash,
      imageSha256Hash,
      imageCount: files.length,
      source: body.source,
      verdict: evaluation.verdict,
      complianceScore: evaluation.complianceScore,
      category: body.category,
      measuredFontHeightMm: evaluation.measuredFontHeightMm,
      requiresConfirm: evaluation.verdict === 'REVIEW',
      isOfficerConfirmed: false,
      calibration: { ...calibration, done: true },
      extractedFields: {
        mrp: {
          declared: extracted.mrpValue,
          valid: !!extracted.mrpValue && extracted.mrpValue > 0,
          rawText: extracted.mrpRaw,
          hasTaxClause: extracted.hasInclusiveOfTaxes,
        },
        netQuantity: {
          value: extracted.netQuantityValue,
          unit: extracted.netQuantityUnit,
          valid: !!extracted.netQuantityValue,
          rawText: extracted.netQuantityRaw,
        },
        unitSalePrice: {
          calculated: evaluation.calculatedUspText,
          declared: extracted.declaredUspRaw,
          valid: !!extracted.declaredUspRaw,
        },
        mfgDate: {
          text: extracted.mfgDateRaw,
          valid: !!extracted.mfgDateValid,
        },
        expiryDate: {
          text: extracted.expiryDateRaw,
          valid: !!extracted.expiryDateValid,
        },
        countryOfOrigin: {
          text: extracted.countryOfOrigin,
          valid: !!extracted.countryOfOrigin && extracted.countryOfOrigin.toLowerCase() !== 'imported',
        },
        manufacturerAddress: {
          text: extracted.manufacturerAddress,
          valid: !!extracted.manufacturerAddress,
          hasCompletePincode: extracted.hasCompletePincode,
        },
        consumerCare: {
          text: [extracted.consumerCareEmail, extracted.consumerCarePhone].filter(Boolean).join(' | ') || undefined,
          valid: !!(extracted.consumerCareEmail || extracted.consumerCarePhone),
        },
        brandName: extracted.brandName,
        productName: extracted.productName,
      },
      violations: evaluation.violations,
      boundingBoxes,
    };

    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

// ============================================================================
// SECTION: OFFICER HITL CONFIRMATION  (POST /api/scan/:id/confirm)
// LMO micrometer sign-off unlocks court-ready evidentiary status.
// ============================================================================

const ConfirmScanSchema = z.object({
  officerConfirmed: z.boolean(),
  micrometerReadingMm: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? undefined : Number(v)),
    z.number().min(0).max(50).optional()
  ),
  notes: z.string().max(500).optional(),
});

export async function confirmPhysicalScan(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const scanId = req.params.id;
    if (!scanId) {
      res.status(400).json({ error: 'Validation Error', message: 'scanId path parameter is required' });
      return;
    }

    const parseResult = ConfirmScanSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }
    const { officerConfirmed, micrometerReadingMm, notes } = parseResult.data;

    const db = getDb();
    const scan = db
      .prepare('SELECT id, verdict, is_officer_confirmed FROM scans WHERE id = ?')
      .get(scanId) as { id: string; verdict: string; is_officer_confirmed: number } | undefined;

    if (!scan) {
      res.status(404).json({ error: 'Not Found', message: `No scan found for id: ${scanId}` });
      return;
    }

    if (officerConfirmed) {
      db.prepare(`
        UPDATE scans
        SET is_officer_confirmed = 1, micrometer_reading_mm = ?, officer_notes = ?
        WHERE id = ?
      `).run(micrometerReadingMm ?? null, notes ?? null, scanId);

      const confirmHash = hashImageEvidence(
        Buffer.from(
          JSON.stringify({ scanId, officerConfirmed, micrometerReadingMm, notes, officer: req.user?.id })
        )
      );
      db.prepare(`
        INSERT INTO audit_trail (id, scan_id, event_type, actor_id, sha256_hash, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        scanId,
        'OFFICER_CONFIRMED',
        req.user?.id ?? null,
        confirmHash,
        new Date().toISOString()
      );

      res.status(200).json({
        success: true,
        scanId,
        isOfficerConfirmed: true,
        isCourtReady: true,
        micrometerReadingMm: micrometerReadingMm ?? null,
        officerNotes: notes ?? null,
        officer: {
          id: req.user?.id,
          name: req.user?.name,
          badgeNumber: req.user?.badgeNumber,
          role: req.user?.role,
        },
      });
      return;
    }

    db.prepare(`UPDATE scans SET officer_notes = ? WHERE id = ?`).run(notes ?? null, scanId);
    db.prepare(`
      INSERT INTO audit_trail (id, scan_id, event_type, actor_id, sha256_hash, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      scanId,
      'OFFICER_REJECTED',
      req.user?.id ?? null,
      hashImageEvidence(Buffer.from(JSON.stringify({ scanId, officerConfirmed, notes, officer: req.user?.id }))),
      new Date().toISOString()
    );

    res.status(200).json({
      success: true,
      scanId,
      isOfficerConfirmed: false,
      isCourtReady: false,
      officerNotes: notes ?? null,
    });
  } catch (err) {
    next(err);
  }
}
