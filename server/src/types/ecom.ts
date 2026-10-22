

import { z } from 'zod';
import { ComplianceVerdict, ScanSource } from '../config/constants';

// Zod Schema for incoming E-Commerce scan request
export const EcomScanRequestSchema = z.object({
  url: z.string().url('A valid product listing URL is required'),
  platform: z.preprocess((v) => {
    if (typeof v === 'string') {
      const lower = v.toLowerCase();
      if (lower.includes('amazon') || lower.includes('amzn')) return 'Amazon';
      if (lower.includes('blinkit')) return 'Blinkit';
      if (lower.includes('zepto')) return 'Zepto';
      if (lower.includes('flipkart')) return 'Flipkart';
    }
    return v;
  }, z.enum(['Amazon', 'Blinkit', 'Zepto', 'Flipkart', 'Other']).optional()),
  category: z.enum(['FOOD', 'COSMETICS', 'ELECTRONICS', 'GENERAL']).default('GENERAL'),
});

export type EcomScanRequest = z.infer<typeof EcomScanRequestSchema>;

// Extracted product metadata from digital marketplace listing
export interface ScrapedProductData {
  productName: string;
  brandName: string;
  category: 'FOOD' | 'COSMETICS' | 'ELECTRONICS' | 'GENERAL';
  platform: 'Amazon' | 'Blinkit' | 'Zepto' | 'Flipkart' | 'Other';
  productUrl: string;
  asinSku?: string;
  declaredMrpRaw?: string;
  declaredMrpValue: number;
  hasInclusiveOfTaxes: boolean;
  declaredNetQuantityRaw?: string;
  declaredNetQuantityValue?: number;
  declaredNetQuantityUnit?: string;
  declaredUspRaw?: string;
  declaredUspValue?: number;
  declaredUspUnit?: string;
  countryOfOrigin?: string;
  sellerName?: string;
  manufacturerAddress?: string;
  consumerCareEmail?: string;
  consumerCarePhone?: string;
  cooFilterPresent: boolean;     // Feb 2026 COO search filter mandate
  aeoBondedDeclared: boolean;    // GSR 418(E) Rule 4 Exp-2 customs warehouse
  images: string[];
  isOfflineFixture: boolean;
}

// Single statutory violation item
export interface EcomViolation {
  ruleNumber: string;
  title: string;
  description: string;
  penaltyClause: string;
  severity: 'CRITICAL' | 'MODERATE' | 'WARNING';
  deduction: number;
  remedy: string;
}

// Complete E-Commerce verification report returned to client
export interface EcomVerificationReport {
  success: boolean;
  scanId: string;
  timestamp: string;
  sha256Hash: string;
  source: ScanSource;
  platform: string;
  productUrl: string;
  productName: string;
  brandName: string;
  category: string;
  verdict: ComplianceVerdict;
  complianceScore: number;
  calculatedUspText?: string;
  extractedFields: {
    mrp: { declared: number; valid: boolean; rawText?: string; hasTaxClause: boolean };
    netQuantity: { value?: number; unit?: string; valid: boolean; rawText?: string };
    unitSalePrice: { declared?: string; calculated: string; valid: boolean };
    countryOfOrigin: { text?: string; valid: boolean };
    sellerName: { text?: string; valid: boolean };
    cooFilterPresent: boolean;
    aeoBondedDeclared: boolean;
  };
  violations: EcomViolation[];
  images?: string[];
  ecomMetadata: {
    id: string;
    platform: string;
    asinSku?: string;
    sellerName?: string;
    cooDeclared: boolean;
    cooFilterPresent: boolean;
    aeoBondedDeclared: boolean;
  };
}
