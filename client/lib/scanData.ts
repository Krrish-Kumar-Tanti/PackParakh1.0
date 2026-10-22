export interface BoundingBox {
  box_2d: [number, number, number, number]; // [top, left, bottom, right] normalized 0-100
  label: string;
  confidence: number;
  status: "PASS" | "FAIL" | "REVIEW";
  measuredMm?: number;
  expectedMinMm?: number;
  originImage?: number;
}

export interface Violation {
  ruleNumber: string;
  title: string;
  description: string;
  penaltyClause: string;
  severity: "CRITICAL" | "MODERATE" | "WARNING";
  deduction: number;
  recommendation: string;
}

export interface ScanResult {
  scanId: string;
  timestamp: string;
  sha256Hash: string;
  source: "LIVE_CAMERA" | "DEMO_CACHED" | "SAMPLE_SEED" | "ECOM_SCRAPER" | "PREPRINT_VECTOR";
  verdict: "PASS" | "FAIL" | "REVIEW";
  complianceScore: number;
  measuredFontHeightMm?: number;
  productName: string;
  brandName: string;
  category: "FOOD" | "COSMETICS" | "ELECTRONICS" | "GENERAL";
  calibrationMode: "TIER_A" | "TIER_B" | "TIER_C";
  referenceWidthMm?: number;
  officerBadgeNo?: string;
  jurisdictionState?: string;
  extractedFields: {
    mrp: { declared: number; text: string; valid: boolean };
    netQuantity: { value: number; unit: string; valid: boolean };
    unitSalePrice: { calculated: string; declared: string; valid: boolean };
    mfgDate: { text: string; valid: boolean };
    expiryDate: { text: string; valid: boolean };
    countryOfOrigin: { text: string; valid: boolean };
    manufacturerAddress: { text: string; valid: boolean };
    consumerCare: { text: string; valid: boolean };
  };
  violations: Violation[];
  boundingBoxes: BoundingBox[];
  capturedImage?: string;
  capturedImages?: string[];
}

export const DEMO_PRESETS: Record<"compliant" | "review" | "violation", ScanResult> = {
  compliant: {
    scanId: "SCAN-DL-2026-COMPLIANT-991A",
    timestamp: new Date().toISOString(),
    sha256Hash: "e89b4f2c019d384029471b84920c5d9eb3214a51e604f81c9a0937a4c7402601",
    source: "SAMPLE_SEED",
    verdict: "PASS",
    complianceScore: 100,
    measuredFontHeightMm: 4.2,
    productName: "Royal Chai Masala Tea 500g",
    brandName: "Royal Heritage Beverages Pvt Ltd",
    category: "FOOD",
    calibrationMode: "TIER_A",
    referenceWidthMm: 140,
    officerBadgeNo: "DL-LMO-2026-0842",
    jurisdictionState: "Delhi (NCT)",
    extractedFields: {
      mrp: { declared: 240.0, text: "₹ 240.00 (incl. of all taxes)", valid: true },
      netQuantity: { value: 500, unit: "g (0.5 kg)", valid: true },
      unitSalePrice: { calculated: "₹ 0.48 / g", declared: "₹ 0.48 / g", valid: true },
      mfgDate: { text: "08/2026", valid: true },
      expiryDate: { text: "02/2027", valid: true },
      countryOfOrigin: { text: "India", valid: true },
      manufacturerAddress: { text: "Plot 42, Okhla Industrial Area Ph-III, New Delhi 110020", valid: true },
      consumerCare: { text: "care@royalchai.in / 1800-11-2026", valid: true },
    },
    violations: [],
    boundingBoxes: [
      {
        box_2d: [15, 10, 32, 90],
        label: "Rule 6(1)(e): MRP ₹ 240 (incl. taxes)",
        confidence: 99.2,
        status: "PASS",
      },
      {
        box_2d: [38, 10, 54, 90],
        label: "Rule 6(11): USP ₹ 0.48 / g",
        confidence: 98.4,
        status: "PASS",
      },
      {
        box_2d: [60, 10, 78, 90],
        label: "Rule 7 Table-I: Font 4.2mm (Min 4.0mm)",
        confidence: 96.8,
        status: "PASS",
        measuredMm: 4.2,
        expectedMinMm: 4.0,
      },
      {
        box_2d: [82, 10, 95, 90],
        label: "Rule 6(1)(g): Origin: India",
        confidence: 99.5,
        status: "PASS",
      },
    ],
  },

  review: {
    scanId: "SCAN-MH-2026-REVIEW-410C",
    timestamp: new Date().toISOString(),
    sha256Hash: "b421a998c56e7192305a4e109d948123fa34c012891bb231908aa34109849201",
    source: "LIVE_CAMERA",
    verdict: "REVIEW",
    complianceScore: 78,
    measuredFontHeightMm: 1.8,
    productName: "Himalayan Organic Green Tea 100g",
    brandName: "Himalayan Herbal Health Ltd",
    category: "FOOD",
    calibrationMode: "TIER_C",
    referenceWidthMm: undefined,
    officerBadgeNo: "MH-LMO-2026-1102",
    jurisdictionState: "Maharashtra",
    extractedFields: {
      mrp: { declared: 185.0, text: "MRP ₹ 185.00 incl. of taxes", valid: true },
      netQuantity: { value: 100, unit: "g", valid: true },
      unitSalePrice: { calculated: "₹ 1.85 / g", declared: "₹ 1.85 / g", valid: true },
      mfgDate: { text: "07/2026", valid: true },
      expiryDate: { text: "01/2027", valid: true },
      countryOfOrigin: { text: "India", valid: true },
      manufacturerAddress: { text: "MIDC Industrial Estate, Pune 411018", valid: true },
      consumerCare: { text: "support@himalayanherbal.com", valid: true },
    },
    violations: [
      {
        ruleNumber: "Rule 7 Table-I",
        title: "Font Height Scale Uncalibrated / Heuristic Caveat",
        description: "Measured font height is 1.8 mm against statutory threshold 2.0 mm under Tier C (uncalibrated heuristic scale). Legal compounding requires physical optical micrometer confirmation.",
        penaltyClause: "Section 36(1) LM Act / Rule 7(1)",
        severity: "WARNING",
        deduction: 22,
        recommendation: "Re-scan with Tier A (ArUco / ID Card) or calibrate via physical micrometer before court filing.",
      },
    ],
    boundingBoxes: [
      {
        box_2d: [15, 10, 32, 90],
        label: "Rule 6(1)(e): MRP ₹ 185 (Valid)",
        confidence: 97.0,
        status: "PASS",
      },
      {
        box_2d: [38, 10, 54, 90],
        label: "Rule 6(11): USP ₹ 1.85 / g (Valid)",
        confidence: 95.5,
        status: "PASS",
      },
      {
        box_2d: [60, 10, 78, 90],
        label: "Rule 7 Table-I: Font 1.8mm vs 2.0mm (Uncalibrated)",
        confidence: 68.2,
        status: "REVIEW",
        measuredMm: 1.8,
        expectedMinMm: 2.0,
      },
    ],
  },

  violation: {
    scanId: "SCAN-UP-2026-BREACH-804D",
    timestamp: new Date().toISOString(),
    sha256Hash: "fa772c9182390a1b2488e01082c940291ba4810928bb01948820c71049182903",
    source: "LIVE_CAMERA",
    verdict: "FAIL",
    complianceScore: 45,
    measuredFontHeightMm: 1.2,
    productName: "Crunchy Namkeen Masala Mixture",
    brandName: "Desi Snacks Confectionery Pvt Ltd",
    category: "FOOD",
    calibrationMode: "TIER_B",
    referenceWidthMm: 120,
    officerBadgeNo: "UP-LMO-2026-3041",
    jurisdictionState: "Uttar Pradesh",
    extractedFields: {
      mrp: { declared: 45.0, text: "MRP ₹ 45", valid: false }, // missing tax clause!
      netQuantity: { value: 200, unit: "200 gms", valid: false }, // illegal unit 'gms'!
      unitSalePrice: { calculated: "₹ 0.225 / g", declared: "", valid: false }, // missing USP!
      mfgDate: { text: "Pkd: 06/26", valid: true },
      expiryDate: { text: "", valid: false },
      countryOfOrigin: { text: "", valid: false }, // missing COO!
      manufacturerAddress: { text: "Kanpur Industrial Area, UP", valid: true },
      consumerCare: { text: "No contact info printed", valid: false },
    },
    violations: [
      {
        ruleNumber: "Rule 6(11)",
        title: "Missing Unit Sale Price (USP)",
        description: "Package exceeds 100g/ml but fails to display statutory Unit Sale Price alongside MRP in bold. Mandatory under GSR 226(E).",
        penaltyClause: "Section 36(1) Legal Metrology Act, 2009",
        severity: "CRITICAL",
        deduction: 25,
        recommendation: "Print 'Unit Sale Price: ₹ 0.23 / g' adjacent to declared MRP.",
      },
      {
        ruleNumber: "Rule 12",
        title: "Non-Metric Unit Representation ('gms')",
        description: "Symbol 'gms' is non-standard. Section 11 of the LM Act strictly mandates 'g' for gram symbols.",
        penaltyClause: "Section 29 Legal Metrology Act, 2009",
        severity: "MODERATE",
        deduction: 15,
        recommendation: "Replace '200 gms' with statutory standard '200 g'.",
      },
      {
        ruleNumber: "Rule 6(1)(e)",
        title: "Missing Mandatory Tax Phrase",
        description: "MRP is declared without the mandatory phrase '(inclusive of all taxes)' or 'incl. of all taxes'.",
        penaltyClause: "Section 36(1) Legal Metrology Act, 2009",
        severity: "CRITICAL",
        deduction: 15,
        recommendation: "Append '(incl. of all taxes)' immediately following the MRP figure.",
      },
    ],
    boundingBoxes: [
      {
        box_2d: [15, 10, 32, 90],
        label: "Rule 6(1)(e): Missing 'incl. of taxes'",
        confidence: 94.0,
        status: "FAIL",
      },
      {
        box_2d: [38, 10, 54, 90],
        label: "Rule 6(11): Missing Unit Sale Price",
        confidence: 96.5,
        status: "FAIL",
      },
      {
        box_2d: [60, 10, 78, 90],
        label: "Rule 12: Illegal 'gms' instead of 'g'",
        confidence: 98.1,
        status: "FAIL",
      },
    ],
  },
};

const STORAGE_KEY = "packparakh_current_scan";

export function saveCurrentScan(scan: ScanResult): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scan));
  }
}

export function getCurrentScan(): ScanResult {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved scan, using compliant preset", e);
      }
    }
  }
  return DEMO_PRESETS.compliant;
}
