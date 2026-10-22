// ============================================================================
// PackParakh (पैक-परख) — System Controller (Swetakshi-owned per 3-Day Plan)
// 1. POST /api/rules/simulate — Pre-market packaging simulator (Rule 7 Table-I)
//    Deterministic TypeScript output (no AI) used by MSME self-audits.
// 2. GET /api/system/status — GovTech operational banner telemetry powering
//    the 28px top status bar on every client screen.
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { APP_CONSTANTS } from '../config/constants';
import { getDb } from '../database/db';

// ----------------------------------------------------------------------------
// 1. Simulator Input Validation
// ----------------------------------------------------------------------------

const SimulateRuleSchema = z.object({
  pdpAreaCm2: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? undefined : Number(v)),
    z.number().min(1).max(100000)
  ),
  netQuantityValue: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? undefined : Number(v)),
    z.number().min(0).positive().optional()
  ),
  netQuantityUnit: z.string().trim().max(20).optional(),
});

// ----------------------------------------------------------------------------
// 2. Helpers — unit normalization & Rule 7 Table-I lookup
// ----------------------------------------------------------------------------

function toGramsBasis(value: number, unit?: string): number | undefined {
  if (!unit || value <= 0) return undefined;
  const u = unit.trim().toLowerCase().replace(/\.+$/, '').replace(/\s+/g, '');
  if (['g', 'gm', 'gram', 'grams'].includes(u)) return value;
  if (['kg', 'kilo', 'kgs'].includes(u)) return value * 1000;
  if (['ml', 'millilitre', 'millilitres'].includes(u)) return value;
  if (['l', 'litre', 'litres'].includes(u)) return value * 1000;
  return undefined;
}

// Deterministic Rule 7 Table-I minimum font height (mm) based on net quantity.
function fontHeightByNetQuantity(gramsBasis: number): number {
  for (const tier of APP_CONSTANTS.FONT_TABLE_I) {
    if (gramsBasis <= tier.maxQtyGrams) return tier.minFontMm;
  }
  return APP_CONSTANTS.FONT_TABLE_I[APP_CONSTANTS.FONT_TABLE_I.length - 1].minFontMm;
}

// Heuristic fallback when net quantity is unknown (Table-II PDP-area font bands,
// Legal Metrology (Packaged Commodities) Rules 2011).
function fontHeightByPdpArea(pdpAreaCm2: number): number {
  if (pdpAreaCm2 <= 50) return 1.0;
  if (pdpAreaCm2 <= 100) return 1.5;
  if (pdpAreaCm2 <= 200) return 2.0;
  if (pdpAreaCm2 <= 500) return 3.0;
  if (pdpAreaCm2 <= 1000) return 4.0;
  return 6.0;
}

// Expected dual-unit presentation (e.g. 1000 g -> "1.00 kg (1000 g)").
function requiredDualUnit(value: number, unit?: string): string {
  if (!unit || value <= 0) return 'Standard SI symbol (g, kg, ml, l, etc.)';
  const u = unit.trim().toLowerCase().replace(/\.+$/, '').replace(/\s+/g, '');
  if (['g', 'gm', 'gram', 'grams'].includes(u) && value >= 1000) {
    return `${(value / 1000).toFixed(2)} kg (${value} g)`;
  }
  if (['ml', 'millilitre', 'millilitres'].includes(u) && value >= 1000) {
    return `${(value / 1000).toFixed(2)} L (${value} ml)`;
  }
  return `${value} ${u}`;
}

// ----------------------------------------------------------------------------
// 3. Controller: POST /api/rules/simulate
// ----------------------------------------------------------------------------

export interface SimulateRuleReport {
  success: boolean;
  pdpAreaCm2: number;
  netQuantityValue?: number;
  netQuantityUnit?: string;
  minFontHeightMm: number;
  fontHeightBasedOn: 'NET_QUANTITY' | 'PDP_AREA';
  requiredDualUnitFormat: string;
  mandatoryDeclarations: string[];
  references: string[];
}

export function simulatePackagingRules(req: Request, res: Response, next: NextFunction): void {
  try {
    const parseResult = SimulateRuleSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }
    const { pdpAreaCm2, netQuantityValue, netQuantityUnit } = parseResult.data;

    const gramsBasis = toGramsBasis(netQuantityValue ?? 0, netQuantityUnit);
    const basedOnNetQty = gramsBasis !== undefined;

    const report: SimulateRuleReport = {
      success: true,
      pdpAreaCm2,
      netQuantityValue: netQuantityValue ?? undefined,
      netQuantityUnit: netQuantityUnit ?? undefined,
      minFontHeightMm: basedOnNetQty
        ? fontHeightByNetQuantity(gramsBasis as number)
        : fontHeightByPdpArea(pdpAreaCm2),
      fontHeightBasedOn: basedOnNetQty ? 'NET_QUANTITY' : 'PDP_AREA',
      requiredDualUnitFormat: requiredDualUnit(netQuantityValue ?? -1, netQuantityUnit),
      mandatoryDeclarations: [
        'Maximum Retail Price (MRP) inclusive of all taxes — Rule 6(1)(e)',
        'Unit Sale Price (USP) in ₹/unit of net quantity — Rule 6(11)',
        'Net quantity in standard SI units of measure — Rule 6(1)(c)',
        'Month & year of manufacture / batch — Rule 6(1)(d)',
        'Country of Origin — Rule 6(1)(g)',
        'Name & complete address of manufacturer/packer with PIN — Rule 6(1)(b)',
        'Consumer care e-mail address & telephone number — Rule 6(1)(f)',
        'Generic / common name of the commodity — Rule 6(1)(a)',
        'Declaration font height at or above Rule 7 Table-I minimum — Rule 7',
      ],
      references: [
        'Legal Metrology (Packaged Commodities) Rules, 2011 (as amended)',
        'Rule 7 Table-I — Minimum font height by net quantity value',
        'Section 36(1) Legal Metrology Act, 2009 — penalty trigger',
      ],
    };

    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

// ----------------------------------------------------------------------------
// 4. Controller: GET /api/system/status — GovTech Operational Banner Telemetry
// Contract (Backend_Lead.md / 3-Day Plan): { status: "OPERATIONAL",
// ruleEngineVersion, rulesActive, database, totalScansProcessed }
// ----------------------------------------------------------------------------

export function getSystemStatus(_req: Request, res: Response): void {
  try {
    const db = getDb();
    const countRow = db
      .prepare('SELECT COUNT(*) as count FROM scans')
      .get() as { count: number } | undefined;
    const totalScansProcessed = countRow ? countRow.count : 0;

    res.status(200).json({
      status: APP_CONSTANTS.SYSTEM_STATUS,
      ruleEngineVersion: APP_CONSTANTS.RULE_ENGINE_VERSION,
      rulesActive: APP_CONSTANTS.TOTAL_RULES_ACTIVE,
      database: 'CONNECTED (WAL Mode)',
      totalScansProcessed,
      serverTime: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'DEGRADED',
      error: err instanceof Error ? err.message : 'Unknown database error',
    });
  }
}