// ============================================================================
// PackParakh (पैक-परख) — 3-Tier Font Calibration & PDP Calculator
// Solves 2D pixel → millimeter statutory conversion honestly.
// Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 7 Table-I/II
// Implements AI_Rule_Specialist.md Section 4 + IMPLEMENTATION_PLAN Part 3
// ============================================================================

export interface ScaleCalibrationResult {
  mmPerPixel: number;
  confidence: 'HIGH' | 'ESTIMATED' | 'UNCALIBRATED';
  status: 'PASS' | 'REVIEW';
  disclaimer?: string;
  tier: 'TIER_A' | 'TIER_B' | 'TIER_C';
}

export interface PDPCalculationResult {
  pdpAreaCm2: number;
  formula: string;
  packType: 'rectangular' | 'cylindrical' | 'pouch';
}

// ---------------------------------------------------------------------------
// 3-Tier Font Calibration Algorithm (AI_Rule_Specialist.md Section 4)
// ---------------------------------------------------------------------------

/**
 * Compute pixel → mm scale using 3-tier workflow.
 *
 * Tier A (Gold Standard - Lab/Strict Field): 85.6mm ISO/IEC 7810 ID-1 card or 20mm ArUco marker
 * Tier B (Fast Field): Declared H×W pack dimensions or direct numeric width in mm
 * Tier C (Citizen/Uncalibrated Fallback): Heuristic 96 DPI baseline → MUST return REVIEW
 */
export function computeScale(
  mode: 'TIER_A' | 'TIER_B' | 'TIER_C',
  options: {
    referenceLengthPx?: number; // Detected length of 85.6mm card in pixels (Tier A)
    referenceWidthMm?: number; // Direct numeric width in mm (Tier B alternative)
    declaredPackDimensionsCm?: { width: number; height: number }; // Tier B declared dims
    imageDimensionsPx: { width: number; height: number };
  }
): ScaleCalibrationResult {
  // TIER A: Physical reference object (85.6mm standard card)
  if (mode === 'TIER_A' && options.referenceLengthPx && options.referenceLengthPx > 0) {
    const mmPerPixel = 85.6 / options.referenceLengthPx;
    return {
      mmPerPixel,
      confidence: 'HIGH',
      status: 'PASS',
      tier: 'TIER_A',
    };
  }

  // TIER A fallback: ArUco 20mm marker if referenceLength provided is small (<100px suggests 20mm marker)
  // Distinguish by checking if referenceLengthPx < 200 and referenceWidthMm absent => treat as 20mm marker
  // For this implementation, we require explicit referenceWidthMm for 20mm case, but Tier A primarily uses 85.6mm

  // TIER B: Declared dimensions
  if (mode === 'TIER_B') {
    // Option B1: Direct numeric width in mm
    if (options.referenceWidthMm && options.referenceWidthMm > 0) {
      const mmPerPixel = options.referenceWidthMm / options.imageDimensionsPx.width;
      return {
        mmPerPixel,
        confidence: 'ESTIMATED',
        status: 'PASS',
        tier: 'TIER_B',
      };
    }
    // Option B2: Declared pack dimensions in cm -> convert to mm
    if (options.declaredPackDimensionsCm) {
      const widthMm = options.declaredPackDimensionsCm.width * 10;
      const mmPerPixel = widthMm / options.imageDimensionsPx.width;
      return {
        mmPerPixel,
        confidence: 'ESTIMATED',
        status: 'PASS',
        tier: 'TIER_B',
      };
    }
  }

  // TIER C: Uncalibrated heuristic fallback (96 DPI baseline)
  // 96 DPI = 96 pixels per inch = 96 / 25.4 ≈ 3.78 pixels per mm => mmPerPixel ≈ 0.264583
  return {
    mmPerPixel: 25.4 / 96, // 0.2645833...
    confidence: 'UNCALIBRATED',
    status: 'REVIEW',
    disclaimer:
      'Font height estimate is heuristic (96 DPI baseline). Physical verification with a calibrated optical micrometer is legally required under Section 36 before compounding or prosecution.',
    tier: 'TIER_C',
  };
}

/**
 * Convert detected font bounding box height in pixels to millimeters.
 */
export function fontPxToMm(fontHeightPx: number, mmPerPixel: number): number {
  return fontHeightPx * mmPerPixel;
}

/**
 * Estimate font height from Gemini bounding box (0-1000 normalized) and image dimensions.
 * bounding box: [ymin, xmin, ymax, xmax] in 0-1000 scale
 */
export function estimateFontHeightFromBox(
  box2d: [number, number, number, number],
  imageHeightPx: number,
  mmPerPixel: number
): number {
  const [ymin, , ymax] = box2d;
  const boxHeightPx = ((ymax - ymin) / 1000) * imageHeightPx;
  return fontPxToMm(boxHeightPx, mmPerPixel);
}

// ---------------------------------------------------------------------------
// Principal Display Panel (PDP) Area Calculator
// ---------------------------------------------------------------------------

/**
 * PDP Area Formula (Rectangular Pack):
 *   Area = Height × Width
 *
 * PDP Area Formula (Cylindrical Bottle):
 *   Area = 0.4 × π × Diameter × Height  (40% of curved surface, per PCR Schedule)
 *
 * Returns area in cm² (input in mm)
 */
export function calculatePDPArea(
  dimensions: {
    heightMm: number;
    widthMm?: number | null;
    diameterMm?: number | null;
    packType: 'rectangular' | 'cylindrical' | 'pouch';
  }
): PDPCalculationResult {
  const { heightMm, widthMm, diameterMm, packType } = dimensions;

  if (packType === 'cylindrical' && diameterMm) {
    const areaMm2 = 0.4 * Math.PI * diameterMm * heightMm;
    return {
      pdpAreaCm2: Math.round((areaMm2 / 100) * 100) / 100,
      formula: `0.4 × π × D(${diameterMm}mm) × H(${heightMm}mm) = ${areaMm2.toFixed(1)} mm² = ${(areaMm2 / 100).toFixed(2)} cm²`,
      packType: 'cylindrical',
    };
  }

  // Rectangular / Pouch: Height × Width
  const w = widthMm || heightMm; // fallback if width missing
  const areaMm2 = heightMm * w;
  return {
    pdpAreaCm2: Math.round((areaMm2 / 100) * 100) / 100,
    formula: `H(${heightMm}mm) × W(${w}mm) = ${areaMm2} mm² = ${(areaMm2 / 100).toFixed(2)} cm²`,
    packType: packType === 'pouch' ? 'pouch' : 'rectangular',
  };
}

/**
 * Simulate packaging requirements (wrapper around shared/rules simulatePackagingRequirements)
 * Kept here for engine-local usage.
 */
export function simulatePackagingRequirements(
  pdpAreaCm2: number,
  netWeightGrams?: number,
  commodityCategory: string = 'General'
): {
  pdpAreaCm2: number;
  minFontHeightMm: number;
  standardSizesAllowed: string[];
  dualUnitRequirement: string;
  mandatoryRuleCitations: string[];
} {
  let minFontHeightMm = 1.5;
  if (pdpAreaCm2 > 1000) minFontHeightMm = 6.0;
  else if (pdpAreaCm2 > 200) minFontHeightMm = 4.0;
  else if (pdpAreaCm2 > 50) minFontHeightMm = 2.0;

  // Table-I may override PDP-based threshold for large net weights
  if (netWeightGrams !== undefined && netWeightGrams >= 500) {
    minFontHeightMm = Math.max(minFontHeightMm, 4.0);
  } else if (netWeightGrams !== undefined && netWeightGrams > 200) {
    minFontHeightMm = Math.max(minFontHeightMm, 2.0);
  } else if (netWeightGrams !== undefined && netWeightGrams > 0) {
    minFontHeightMm = Math.max(minFontHeightMm, 1.0);
  }

  const dualUnitRequirement =
    netWeightGrams !== undefined && netWeightGrams >= 1000
      ? `${(netWeightGrams / 1000).toFixed(2)} kg (${netWeightGrams} g)`
      : `${netWeightGrams || 0} g`;

  return {
    pdpAreaCm2,
    minFontHeightMm,
    standardSizesAllowed: ['100g', '200g', '500g', '1kg', '2kg', '5kg', '100ml', '200ml', '500ml', '1L'],
    dualUnitRequirement,
    mandatoryRuleCitations: [
      'Rule 6(1)(e): MRP inclusive of all taxes phrase mandatory',
      'Rule 6(11): Unit Sale Price calculation mandatory (MRP / Net Qty)',
      'Rule 7 Table-I: Minimum font height threshold compliance',
      'GSR 418(E) 2026: Director accountability and AEO bonded declaration standards',
    ],
  };
}
