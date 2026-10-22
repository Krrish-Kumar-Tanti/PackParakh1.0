// ============================================================================
// PackParakh (पैक-परख) — Multi-Photo Fusion Unit Tests
// MCE 2026 Problem Statement 26034 | Legal Metrology (Packaged Commodities)
// Rules 2011 | Legal Metrology PCR 2011
//
// Scope: Verifies mergeExtracts() fuses multiple label-panel OCR extracts:
//   - MRP present only on photo B is honored (panel variance)
//   - numeric fields use majority vote (disagreeing OCR -> consensus)
//   - string fields take first meaningful value (vision placeholders dropped)
//   - booleans are OR'd (any panel evidence counts)
//   - ocrComplete is recomputed on the FUSED core (MRP + net qty both present)
//
// Usage:  npm test  (tsx --test tests/**/*.test.ts)
// ============================================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { mergeExtracts } from '../src/services/visionBridge';
import type { ExtractedPackData } from '../src/types/physical';

function photo(overrides: Partial<ExtractedPackData> = {}): ExtractedPackData {
  return {
    brandName: undefined,
    productName: undefined,
    mrpValue: undefined,
    mrpRaw: undefined,
    hasInclusiveOfTaxes: false,
    netQuantityValue: undefined,
    netQuantityUnit: undefined,
    netQuantityRaw: undefined,
    mfgDateRaw: undefined,
    mfgDateValid: false,
    expiryDateRaw: undefined,
    expiryDateValid: false,
    countryOfOrigin: undefined,
    manufacturerName: undefined,
    manufacturerAddress: undefined,
    hasCompletePincode: false,
    consumerCareEmail: undefined,
    consumerCarePhone: undefined,
    declaredUspValue: undefined,
    declaredUspRaw: undefined,
    measuredFontHeightPx: undefined,
    detectedBoxes: [],
    ocrConfidence: 0,
    ocrComplete: false,
    ...overrides,
  };
}

describe('mergeExtracts — Multi-Photo Label Fusion', () => {
  it('combines MRP (front) with address/COO (back) and marks ocrComplete', () => {
    const front = photo({
      mrpValue: 55,
      mrpRaw: 'MRP ₹55.00 (incl. of all taxes)',
      hasInclusiveOfTaxes: true,
      netQuantityValue: 96,
      netQuantityUnit: 'pages',
      netQuantityRaw: '96 Pages Ruled',
      brandName: 'VIDYA STATIONERY',
      ocrComplete: false,
    });
    const back = photo({
      manufacturerAddress: 'VIDYA PRINTERS, MEERUT-250002',
      hasCompletePincode: true,
      countryOfOrigin: 'India',
      ocrComplete: false,
    });
    const merged = mergeExtracts([front, back]);

    assert.equal(merged.mrpValue, 55);
    assert.equal(merged.mrpRaw, 'MRP ₹55.00 (incl. of all taxes)');
    assert.equal(merged.hasInclusiveOfTaxes, true);
    assert.equal(merged.brandName, 'VIDYA STATIONERY');
    assert.equal(merged.manufacturerAddress, 'VIDYA PRINTERS, MEERUT-250002');
    assert.equal(merged.hasCompletePincode, true);
    assert.equal(merged.countryOfOrigin, 'India');
    // MRP + net qty both present after fusion -> complete
    assert.ok(merged.ocrComplete);
  });

  it('majority vote wins on disagreeing MRP reads', () => {
    const merged = mergeExtracts([
      photo({ mrpValue: 55, netQuantityValue: 250 }),
      photo({ mrpValue: 55, netQuantityValue: 250 }),
      photo({ mrpValue: 56, netQuantityValue: 250 }),
    ]);
    assert.equal(merged.mrpValue, 55);
    assert.equal(merged.netQuantityValue, 250);
    assert.ok(merged.ocrComplete);
  });

  it('drops vision placeholders when a real brand is present on another panel', () => {
    const merged = mergeExtracts([
      photo({ brandName: 'Inspected Product', mrpValue: 30 }),
      photo({ brandName: 'Parle-G', productName: 'Glucose Biscuits', mrpValue: 30 }),
    ]);
    assert.equal(merged.brandName, 'Parle-G');
    assert.equal(merged.productName, 'Glucose Biscuits');
  });

  it('cardinality OR for date/care evidence and max confidence', () => {
    const merged = mergeExtracts([
      photo({ expiryDateRaw: '12/2026', expiryDateValid: true, ocrConfidence: 0.71 }),
      photo({ consumerCarePhone: '1800 222 555', ocrConfidence: 0.9 }),
    ]);
    assert.equal(merged.expiryDateRaw, '12/2026');
    assert.equal(merged.expiryDateValid, true);
    assert.equal(merged.consumerCarePhone, '1800 222 555');
    assert.equal(merged.ocrConfidence, 0.9);
  });

  it('fused core missing MRP stays ocrComplete=false (honest abstain)', () => {
    const merged = mergeExtracts([
      photo({ netQuantityValue: 250, netQuantityUnit: 'g', ocrComplete: true }),
    ]);
    assert.equal(merged.mrpValue, undefined);
    assert.equal(merged.ocrComplete, false);
  });

  it('detected boxes are unioned across panels', () => {
    const merged = mergeExtracts([
      photo({ ocrComplete: true, detectedBoxes: [{ label: 'MRP', confidence: 0.9, box_2d: 'a,b,c,d' }] }),
      photo({ ocrComplete: true, detectedBoxes: [{ label: 'ADDRESS', confidence: 0.8, box_2d: 'e,f,g,h' }] }),
    ]);
    assert.equal(merged.detectedBoxes.length, 2);
  });

  it('tags each detected box with its originating panel index', () => {
    const merged = mergeExtracts([
      photo({
        ocrComplete: true,
        detectedBoxes: [
          { label: 'MRP', confidence: 0.9, box_2d: 'a,b,c,d' },
          { label: 'NET_QTY', confidence: 0.85, box_2d: 'a2,b2,c2,d2' },
        ],
      }),
      photo({
        ocrComplete: true,
        detectedBoxes: [
          { label: 'ADDRESS', confidence: 0.8, box_2d: 'e,f,g,h' },
          { label: 'COUNTRY', confidence: 0.7, box_2d: 'e2,f2,g2,h2' },
        ],
      }),
    ]);
    assert.equal(merged.detectedBoxes.length, 4);
    // Boxes from panel 0 must carry originImage 0, panel 1 must carry 1 —
    // the verdict page uses this to show only one panel's boxes per photo.
    assert.deepEqual(
      merged.detectedBoxes.map((b) => (b as { originImage?: number }).originImage),
      [0, 0, 1, 1]
    );
  });
});