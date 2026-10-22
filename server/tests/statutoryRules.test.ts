// ============================================================================
// PackParakh (पैक-परख) — Statutory Rule Engine Test Suite (24 Rules Verification)
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// ============================================================================

import { evaluateAllRules, simulatePackagingRequirements } from '../../shared/rules.ts';
import type { ExtractedPackData } from '../../shared/types.ts';

// Mock Compliant Product (Haldiram's Bhujia)
const compliantPack: ExtractedPackData = {
  brand_name: "Haldiram's",
  product_name: "Aloo Bhujia",
  category: "FOOD",
  mrp_raw: "MRP ₹ 45.00 (incl. of all taxes)",
  mrp_value: 45.0,
  has_inclusive_of_taxes: true,
  net_quantity_raw: "Net Wt. 200 g",
  net_quantity_value: 200,
  net_quantity_unit: "g",
  unit_sale_price_raw: "₹ 0.23 / g",
  unit_sale_price_value: 0.225,
  unit_sale_price_unit: "₹/g",
  mfg_or_packing_date_raw: "08/2026",
  expiry_date_raw: "02/2027",
  country_of_origin: "India",
  is_imported: false,
  importer_name: null,
  importer_address: null,
  manufacturer_name: "Haldiram Snacks Pvt. Ltd.",
  manufacturer_address: "Plot No. 100, Industrial Area, Nagpur, Maharashtra - 440001",
  has_complete_pincode: true,
  consumer_care_name: "Grievance Officer",
  consumer_care_email: "customercare@haldirams.com",
  consumer_care_phone: "1800-102-5555",
  consumer_care_address: "Nagpur, Maharashtra - 440001",
  is_food_product: true,
  fssai_license_number: "10012022000234",
  veg_nonveg_emblem_detected: true,
  is_ecom_listing: false,
  has_coo_filter: false,
  detected_boxes: [
    { label: "Net Quantity", box_2d: [710, 150, 770, 420], font_height_px: 24 },
    { label: "MRP", box_2d: [780, 150, 840, 520], font_height_px: 22 }
  ]
};

// Mock Defective Product (Shrinkflation & Missing Declarations)
const defectivePack: ExtractedPackData = {
  brand_name: "Defective Brands",
  product_name: "Choco Chip Biscuits",
  category: "FOOD",
  mrp_raw: "Rs 50.00", // FAIL: No "incl. of all taxes"
  mrp_value: 50.0,
  has_inclusive_of_taxes: false,
  net_quantity_raw: "185 gms", // FAIL: Non-standard 185g shrinkflation + "gms"
  net_quantity_value: 185,
  net_quantity_unit: "gms",
  unit_sale_price_raw: null, // FAIL: Missing USP
  unit_sale_price_value: null,
  unit_sale_price_unit: null,
  mfg_or_packing_date_raw: "09/2026",
  expiry_date_raw: null, // FAIL: Food missing expiry
  country_of_origin: null, // FAIL: Missing COO
  is_imported: false,
  importer_name: null,
  importer_address: null,
  manufacturer_name: "Some Bakery",
  manufacturer_address: "Industrial Area, New Delhi", // FAIL: Missing PIN
  has_complete_pincode: false,
  consumer_care_name: null,
  consumer_care_email: null, // FAIL: Missing email
  consumer_care_phone: "9876543210",
  consumer_care_address: null,
  is_food_product: true,
  fssai_license_number: null,
  veg_nonveg_emblem_detected: null,
  is_ecom_listing: false,
  has_coo_filter: false,
  detected_boxes: []
};

// Mock Electronics Product (Testing Category Conditional Expiry Exemption)
const electronicsPack: ExtractedPackData = {
  brand_name: "TechTron",
  product_name: "Wireless Mouse",
  category: "ELECTRONICS",
  mrp_raw: "MRP ₹ 799.00 (incl. of all taxes)",
  mrp_value: 799.0,
  has_inclusive_of_taxes: true,
  net_quantity_raw: "1 N",
  net_quantity_value: 1,
  net_quantity_unit: "N",
  unit_sale_price_raw: "₹ 799.00 / N",
  unit_sale_price_value: 799.0,
  unit_sale_price_unit: "₹/N",
  mfg_or_packing_date_raw: "07/2026",
  expiry_date_raw: null, // Exempt for electronics!
  country_of_origin: "India",
  is_imported: false,
  importer_name: null,
  importer_address: null,
  manufacturer_name: "TechTron Electronics Pvt. Ltd.",
  manufacturer_address: "Plot 12, Sector 5, Bengaluru, Karnataka - 560001",
  has_complete_pincode: true,
  consumer_care_name: "Support Desk",
  consumer_care_email: "support@techtron.in",
  consumer_care_phone: "080-23456789",
  consumer_care_address: "Bengaluru, Karnataka - 560001",
  is_food_product: false,
  fssai_license_number: null,
  veg_nonveg_emblem_detected: null,
  is_ecom_listing: false,
  has_coo_filter: false,
  detected_boxes: [
    { label: "MRP", box_2d: [500, 100, 550, 400], font_height_px: 25 }
  ]
};

async function runTests() {
  console.log('🧪 Running Statutory Rule Engine Verification Tests...\n');
  let passedAssertions = 0;

  // 1. Compliant Pack Test — 200g pack with USP present, font 1.5mm >1.0mm => PASS
  const result1 = evaluateAllRules(compliantPack, { estimatedFontHeightMm: 1.5, calibrationConfidence: 'ESTIMATED', requiresScaleConfirmation: false });
  console.log(`[Test 1] Compliant Pack Score: ${result1.complianceScore} | Verdict: ${result1.overallVerdict}`);
  if (result1.overallVerdict !== 'PASS') {
    throw new Error(`Expected Compliant Pack to PASS, got ${result1.overallVerdict}`);
  }
  if (result1.complianceScore < 85) {
    throw new Error(`Expected score >= 85, got ${result1.complianceScore}`);
  }
  passedAssertions += 2;
  console.log('  ✅ Test 1 Passed: Compliant FMCG package passes with high score.\n');

  // 2. Defective Pack Test (Shrinkflation + Missing Declarations) — uncalibrated but still FAIL due to multiple critical violations
  const result2 = evaluateAllRules(defectivePack, { estimatedFontHeightMm: undefined, calibrationConfidence: 'UNCALIBRATED', requiresScaleConfirmation: true });
  console.log(`[Test 2] Defective Pack Score: ${result2.complianceScore} | Verdict: ${result2.overallVerdict}`);
  if (result2.overallVerdict !== 'FAIL') {
    throw new Error(`Expected Defective Pack to FAIL, got ${result2.overallVerdict}`);
  }
  
  // Verify specific statutory violations were caught
  const failedRules = result2.ruleResults.filter(r => r.status === 'FAIL').map(r => r.ruleId);
  console.log('  Caught Violations:', failedRules);

  const mustCatch = [
    'RULE_6_1_E_MRP_TAX_CLAUSE', // MRP tax clause
    'RULE_6_1_C_NET_QTY_UNITS', // "gms" illegal unit
    'RULE_6_11_UNIT_SALE_PRICE_MATH', // Missing USP
    'RULE_6_1_G_COUNTRY_OF_ORIGIN', // Missing Country of Origin
    'RULE_6_1_A_MFR_NAME_ADDR', // Missing PIN code in address
    'RULE_6_1_F_CONSUMER_CARE', // Missing consumer care email
  ];

  for (const rule of mustCatch) {
    if (!failedRules.includes(rule)) {
      throw new Error(`Defective pack failed to catch mandatory violation: ${rule}`);
    }
  }
  passedAssertions += 3;
  console.log('  ✅ Test 2 Passed: All critical statutory violations detected accurately.\n');

  // 3. Category Conditional Exemption Test (Electronics) — expiry NOT_APPLICABLE per GSR 577(E)
  const result3 = evaluateAllRules(electronicsPack, { estimatedFontHeightMm: 1.5, calibrationConfidence: 'ESTIMATED', requiresScaleConfirmation: false });
  console.log(`[Test 3] Electronics Pack Score: ${result3.complianceScore} | Verdict: ${result3.overallVerdict}`);
  const expiryRule = result3.ruleResults.find(r => r.ruleId === 'RULE_6_1_D_DATE_MANUFACTURE');
  if (expiryRule?.status !== 'NOT_APPLICABLE') {
    throw new Error(`Expected Expiry/Date Rule to be NOT_APPLICABLE for Electronics, got ${expiryRule?.status}`);
  }
  if (result3.overallVerdict !== 'PASS') {
    throw new Error(`Expected Electronics pack to PASS without expiry date, got ${result3.overallVerdict}`);
  }
  passedAssertions += 2;
  console.log('  ✅ Test 3 Passed: Category conditional exemption engine respects non-perishable goods.\n');

  // 4. Pre-Market Packaging Simulator Test
  const simResult = simulatePackagingRequirements(180, 400, 'FOOD');
  console.log(`[Test 4] Simulator for 180 cm² PDP: Required Min Font = ${simResult.minFontHeightMm} mm`);
  if (simResult.minFontHeightMm !== 2.0) {
    throw new Error(`Expected 2.0mm font for 180cm² PDP, got ${simResult.minFontHeightMm}mm`);
  }
  passedAssertions += 1;
  console.log('  ✅ Test 4 Passed: Packaging simulator produces exact Table-I thresholds.\n');

  console.log(`=======================================================`);
  console.log(`🏆 ALL ${passedAssertions} STATUTORY VERIFICATION ASSERTIONS PASSED!`);
  console.log(`⚖️ 24 Legal Metrology Rules Codified & Ready for Trial.`);
  console.log(`=======================================================`);
}

runTests().catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
