import crypto from 'crypto';
import { getDb, initDb, closeDb } from './db';

/**
 * Generate a deterministic SHA-256 evidence hash for compliance records
 */
function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Seed Database with Initial Test Data for PackParakh:
 * 1. Test Users (LMO Officer, MSME Brand Lead, Citizen, DoCA Admin)
 * 2. 15 Leading Indian FMCG Brands with Director Accountability (Rule 27 GSR 418(E) 2026)
 * 3. 20 Realistic FMCG Scans with Real PCR-2011 Rule Engine Violations
 * 4. Audit Sessions, E-Com Metadata, Form-V Seizure Memos, Audit Trail & Acknowledgements
 */
export function seedDatabase(): void {
  console.log('=======================================================');
  console.log('🌱 PackParakh (पैक-परख) — Seeding Master Database');
  console.log('=======================================================');

  initDb();
  const db = getDb();

  // Execute in a single transaction for maximum speed and integrity
  const transaction = db.transaction(() => {
    // ------------------------------------------------------------------------
    // 1. Seed Users (4 Roles)
    // ------------------------------------------------------------------------
    console.log('[Seed] Populating 4 default users across all roles...');
    const users = [
      {
        id: 'usr-lmo-01',
        name: 'Inspector Rajesh Kumar',
        role: 'LMO',
        badge_number: 'LMO-DL-2026-44',
        state: 'Delhi',
        district: 'New Delhi',
      },
      {
        id: 'usr-msme-01',
        name: 'Priya Sharma (MSME Packaging Lead)',
        role: 'MSME',
        badge_number: 'GSTIN07AAAAA0000A1Z5',
        state: 'Maharashtra',
        district: 'Mumbai',
      },
      {
        id: 'usr-cit-01',
        name: 'Aakash Verma (Consumer Inspector)',
        role: 'CITIZEN',
        badge_number: 'PUBLIC-GUEST',
        state: 'Karnataka',
        district: 'Bengaluru',
      },
      {
        id: 'usr-adm-01',
        name: 'National Director (DoCA Directorate HQ)',
        role: 'ADMIN',
        badge_number: 'DOCA-HQ-01',
        state: 'Delhi',
        district: 'Central Delhi',
      },
    ];

    const insertUser = db.prepare(`
      INSERT OR REPLACE INTO users (id, name, role, badge_number, state, district)
      VALUES (@id, @name, @role, @badge_number, @state, @district)
    `);

    for (const u of users) {
      insertUser.run(u);
    }

    // ------------------------------------------------------------------------
    // 2. Seed Brands (15 Major FMCG Brands with Director Accountability)
    // ------------------------------------------------------------------------
    console.log('[Seed] Populating 15 FMCG Brands with Director Accountability...');
    const brands = [
      {
        id: 'brd-nestle',
        name: 'Nestle India Ltd',
        registration_no: 'REG-FMCG-1001',
        director_name: 'Suresh Narayanan',
        category: 'FOOD',
        risk_level: 'HIGH',
        total_violations: 0,
      },
      {
        id: 'brd-britannia',
        name: 'Britannia Industries Ltd',
        registration_no: 'REG-FMCG-1002',
        director_name: 'Varun Berry',
        category: 'FOOD',
        risk_level: 'MEDIUM',
        total_violations: 0,
      },
      {
        id: 'brd-parle',
        name: 'Parle Products Pvt Ltd',
        registration_no: 'REG-FMCG-1003',
        director_name: 'Vijay Chauhan',
        category: 'FOOD',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-itc',
        name: 'ITC Limited',
        registration_no: 'REG-FMCG-1004',
        director_name: 'Sanjiv Puri',
        category: 'FOOD',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-dabur',
        name: 'Dabur India Ltd',
        registration_no: 'REG-FMCG-1005',
        director_name: 'Mohit Malhotra',
        category: 'GENERAL',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-hul',
        name: 'Hindustan Unilever Ltd',
        registration_no: 'REG-FMCG-1006',
        director_name: 'Rohit Jawa',
        category: 'COSMETICS',
        risk_level: 'HIGH',
        total_violations: 0,
      },
      {
        id: 'brd-amul',
        name: 'Gujarat Co-operative Milk Marketing Federation (Amul)',
        registration_no: 'REG-FMCG-1007',
        director_name: 'Jayen Mehta',
        category: 'FOOD',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-tata',
        name: 'Tata Consumer Products Ltd',
        registration_no: 'REG-FMCG-1008',
        director_name: "Sunil D'Souza",
        category: 'FOOD',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-marico',
        name: 'Marico Limited',
        registration_no: 'REG-FMCG-1009',
        director_name: 'Saugata Gupta',
        category: 'COSMETICS',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-haldiram',
        name: 'Haldiram Snacks Pvt Ltd',
        registration_no: 'REG-FMCG-1010',
        director_name: 'Manohar Lal Agarwal',
        category: 'FOOD',
        risk_level: 'MEDIUM',
        total_violations: 0,
      },
      {
        id: 'brd-colgate',
        name: 'Colgate-Palmolive India Ltd',
        registration_no: 'REG-FMCG-1011',
        director_name: 'Prabha Narasimhan',
        category: 'COSMETICS',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-reckitt',
        name: 'Reckitt Benckiser India Pvt Ltd',
        registration_no: 'REG-FMCG-1012',
        director_name: 'Gaurav Jain',
        category: 'GENERAL',
        risk_level: 'HIGH',
        total_violations: 0,
      },
      {
        id: 'brd-fortune',
        name: 'Adani Wilmar Limited (Fortune)',
        registration_no: 'REG-FMCG-1013',
        director_name: 'Angshu Mallick',
        category: 'FOOD',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-everest',
        name: 'Everest Food Products Pvt Ltd',
        registration_no: 'REG-FMCG-1014',
        director_name: 'Sanjeev Shah',
        category: 'FOOD',
        risk_level: 'LOW',
        total_violations: 0,
      },
      {
        id: 'brd-mondelez',
        name: 'Mondelez India Foods Pvt Ltd',
        registration_no: 'REG-FMCG-1015',
        director_name: 'Samir Jain',
        category: 'FOOD',
        risk_level: 'MEDIUM',
        total_violations: 0,
      },
    ];

    const insertBrand = db.prepare(`
      INSERT OR REPLACE INTO brands (id, name, registration_no, director_name, category, risk_level, total_violations)
      VALUES (@id, @name, @registration_no, @director_name, @category, @risk_level, @total_violations)
    `);

    for (const b of brands) {
      insertBrand.run(b);
    }

    // ------------------------------------------------------------------------
    // 3. Seed Audit Sessions
    // ------------------------------------------------------------------------
    console.log('[Seed] Populating Audit Sessions...');
    const sessions = [
      {
        id: 'ses-del-01',
        user_id: 'usr-lmo-01',
        audit_mode: 'PHYSICAL',
        location_lat: 28.6139,
        location_lng: 77.209,
      },
      {
        id: 'ses-mum-02',
        user_id: 'usr-msme-01',
        audit_mode: 'ARTWORK',
        location_lat: 19.076,
        location_lng: 72.8777,
      },
      {
        id: 'ses-blr-03',
        user_id: 'usr-cit-01',
        audit_mode: 'PHYSICAL',
        location_lat: 12.9716,
        location_lng: 77.5946,
      },
      {
        id: 'ses-ecom-04',
        user_id: 'usr-lmo-01',
        audit_mode: 'ECOM',
        location_lat: 28.6304,
        location_lng: 77.2177,
      },
    ];

    const insertSession = db.prepare(`
      INSERT OR REPLACE INTO audit_sessions (id, user_id, audit_mode, location_lat, location_lng)
      VALUES (@id, @user_id, @audit_mode, @location_lat, @location_lng)
    `);

    for (const s of sessions) {
      insertSession.run(s);
    }

    // ------------------------------------------------------------------------
    // 4. Seed 20 Realistic FMCG Scans & Violations
    // ------------------------------------------------------------------------
    console.log('[Seed] Populating 20 real FMCG test products with statutory compliance records...');

    interface ScanSeedData {
      id: string;
      session_id: string;
      brand_id: string;
      product_name: string;
      category: 'FOOD' | 'COSMETICS' | 'ELECTRONICS' | 'GENERAL';
      source: 'SAMPLE_SEED';
      reference_width_mm: number;
      image_url: string;
      declared_mrp: number;
      declared_net_qty: number;
      declared_net_unit: string;
      calculated_usp: string;
      compliance_score: number;
      verdict: 'PASS' | 'FAIL' | 'REVIEW';
      is_officer_confirmed: number;
      micrometer_reading_mm?: number;
      officer_notes?: string;
      violations: Array<{
        id: string;
        rule_number: string;
        rule_title: string;
        description: string;
        penalty_section: string;
        severity: 'WARNING' | 'MODERATE' | 'CRITICAL';
        score_deduction: number;
      }>;
      ecom?: {
        platform: string;
        product_url: string;
        asin_sku: string;
        seller_name: string;
        coo_declared: number;
        coo_filter_present: number;
        aeo_bonded_declared: number;
      };
      seizureMemo?: {
        memo_number: string;
        premises_name: string;
        trader_name: string;
        witness_name: string;
        status: 'DRAFTED' | 'ISSUED' | 'COMPOUNDED' | 'COURT_FILED';
      };
    }

    const testScans: ScanSeedData[] = [
      // 1. Parle-G (PASS - Score 100)
      {
        id: 'scn-fmcg-01',
        session_id: 'ses-del-01',
        brand_id: 'brd-parle',
        product_name: 'Parle-G Glucose Biscuits (80g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 120,
        image_url: '/uploads/samples/parle_g_80g.jpg',
        declared_mrp: 10.0,
        declared_net_qty: 80.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.125 / g',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 2. Maggi 2-Minute Noodles (FAIL - Score 50)
      {
        id: 'scn-fmcg-02',
        session_id: 'ses-del-01',
        brand_id: 'brd-nestle',
        product_name: 'Maggi 2-Minute Masala Noodles (70g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 135,
        image_url: '/uploads/samples/maggi_70g.jpg',
        declared_mrp: 14.0,
        declared_net_qty: 70.0,
        declared_net_unit: 'gms', // Non-standard unit breach
        calculated_usp: '₹0.20 / g',
        compliance_score: 50,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-02-1',
            rule_number: 'Rule 6(1)(c)',
            rule_title: 'Non-Standard SI Unit Symbol',
            description: "Illegal unit declaration 'gms' used instead of statutory SI symbol 'g' under Rule 6(1)(c).",
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 20,
          },
          {
            id: 'viol-02-2',
            rule_number: 'Rule 6(11)',
            rule_title: 'Missing Unit Sale Price (USP)',
            description: 'Unit Sale Price (USP) per gram completely omitted on retail packaging.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 30,
          },
        ],
        seizureMemo: {
          memo_number: 'MEMO-2026-DL-001',
          premises_name: 'Gupta Kirana & General Store, Connaught Place',
          trader_name: 'Rameshwar Gupta',
          witness_name: 'Anand Prakash (Local Trader)',
          status: 'ISSUED',
        },
      },
      // 3. Britannia Good Day Cookies (FAIL - Score 60)
      {
        id: 'scn-fmcg-03',
        session_id: 'ses-del-01',
        brand_id: 'brd-britannia',
        product_name: 'Britannia Good Day Butter Cookies (66g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 110,
        image_url: '/uploads/samples/good_day_66g.jpg',
        declared_mrp: 20.0,
        declared_net_qty: 66.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.303 / g',
        compliance_score: 60,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-03-1',
            rule_number: 'Rule 5',
            rule_title: 'Non-Standard Quantity Pack (Shrinkflation)',
            description: 'Non-standard weight pack of 66g violates Second Schedule standard sizes (75g / 100g).',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 20,
          },
          {
            id: 'viol-03-2',
            rule_number: 'Rule 6(1)(b)',
            rule_title: 'Incomplete Manufacturer Address',
            description: 'Registered manufacturer address missing 6-digit postal PIN code.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'MODERATE',
            score_deduction: 20,
          },
        ],
      },
      // 4. Amul Taaza Toned Milk (PASS - Score 100)
      {
        id: 'scn-fmcg-04',
        session_id: 'ses-blr-03',
        brand_id: 'brd-amul',
        product_name: 'Amul Taaza Homogenised Toned Milk (1L)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 95,
        image_url: '/uploads/samples/amul_taaza_1l.jpg',
        declared_mrp: 54.0,
        declared_net_qty: 1000.0,
        declared_net_unit: 'ml',
        calculated_usp: '₹0.054 / ml (₹54.00 / L)',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 5. Tata Salt (PASS - Score 100)
      {
        id: 'scn-fmcg-05',
        session_id: 'ses-del-01',
        brand_id: 'brd-tata',
        product_name: 'Tata Salt Vacuum Evaporated (1kg)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 150,
        image_url: '/uploads/samples/tata_salt_1kg.jpg',
        declared_mrp: 28.0,
        declared_net_qty: 1.0,
        declared_net_unit: 'kg',
        calculated_usp: '₹28.00 / kg',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 6. Aashirvaad Superior MP Atta (PASS - Score 100)
      {
        id: 'scn-fmcg-06',
        session_id: 'ses-blr-03',
        brand_id: 'brd-itc',
        product_name: 'Aashirvaad Superior MP Atta (5kg)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 240,
        image_url: '/uploads/samples/aashirvaad_atta_5kg.jpg',
        declared_mrp: 275.0,
        declared_net_qty: 5.0,
        declared_net_unit: 'kg',
        calculated_usp: '₹55.00 / kg',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 7. Dabur Honey (REVIEW - Score 80)
      {
        id: 'scn-fmcg-07',
        session_id: 'ses-del-01',
        brand_id: 'brd-dabur',
        product_name: 'Dabur Honey 100% Pure (250g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 85,
        image_url: '/uploads/samples/dabur_honey_250g.jpg',
        declared_mrp: 120.0,
        declared_net_qty: 250.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.48 / g',
        compliance_score: 80,
        verdict: 'REVIEW',
        is_officer_confirmed: 0,
        micrometer_reading_mm: 1.85,
        officer_notes: 'Tier-C optical scale. Requires physical micrometer check for Table-I font compliance.',
        violations: [
          {
            id: 'viol-07-1',
            rule_number: 'Rule 7',
            rule_title: 'Table-I Minimum Font Height Borderline',
            description: 'Optical reading estimated 1.85mm vs statutory 2.0mm threshold; pending HITL confirmation.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'WARNING',
            score_deduction: 20,
          },
        ],
      },
      // 8. Lay's India's Magic Masala (FAIL - Score 50)
      {
        id: 'scn-fmcg-08',
        session_id: 'ses-ecom-04',
        brand_id: 'brd-parle',
        product_name: "Lay's India's Magic Masala Chips (42g)",
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 140,
        image_url: '/uploads/samples/lays_masala_42g.jpg',
        declared_mrp: 20.0,
        declared_net_qty: 42.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.476 / g',
        compliance_score: 50,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-08-1',
            rule_number: 'Rule 6(1)(e)',
            rule_title: 'Missing Tax Inclusion Declaration',
            description: "MRP declaration omitted mandatory statutory phrase 'inclusive of all taxes'.",
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 20,
          },
          {
            id: 'viol-08-2',
            rule_number: 'Rule 6(11)',
            rule_title: 'USP Mathematical Discrepancy',
            description: 'Declared USP does not match mathematical MRP / Net Quantity calculation within 1% tolerance.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 30,
          },
        ],
        ecom: {
          platform: 'Blinkit',
          product_url: 'https://blinkit.com/prn/lays-chips-magic-masala/prid/12984',
          asin_sku: 'BLINK-LAYS-42G',
          seller_name: 'Supercom Retail Services Pvt Ltd',
          coo_declared: 1,
          coo_filter_present: 1,
          aeo_bonded_declared: 0,
        },
      },
      // 9. Cadbury Dairy Milk Chocolate (FAIL - Score 65)
      {
        id: 'scn-fmcg-09',
        session_id: 'ses-del-01',
        brand_id: 'brd-mondelez',
        product_name: 'Cadbury Dairy Milk Chocolate (50g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 105,
        image_url: '/uploads/samples/cadbury_dairy_milk_50g.jpg',
        declared_mrp: 40.0,
        declared_net_qty: 50.0,
        declared_net_unit: 'GMS', // Uppercase GMS breach
        calculated_usp: '₹0.80 / g',
        compliance_score: 65,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-09-1',
            rule_number: 'Rule 6(1)(c)',
            rule_title: 'Non-Standard Unit Casing',
            description: "Net quantity declared with non-statutory uppercase 'GMS' rather than statutory 'g'.",
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'MODERATE',
            score_deduction: 20,
          },
          {
            id: 'viol-09-2',
            rule_number: 'Rule 6(1)(f)',
            rule_title: 'Missing Consumer Care Email',
            description: 'Customer grievance redressal section lacks mandatory official email address.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'WARNING',
            score_deduction: 15,
          },
        ],
      },
      // 10. Haldiram's Nagpur Bhujia Sev (FAIL - Score 60)
      {
        id: 'scn-fmcg-10',
        session_id: 'ses-del-01',
        brand_id: 'brd-haldiram',
        product_name: "Haldiram's Nagpur Bhujia Sev (150g)",
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 160,
        image_url: '/uploads/samples/haldiram_bhujia_150g.jpg',
        declared_mrp: 55.0,
        declared_net_qty: 150.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.367 / g',
        compliance_score: 60,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-10-1',
            rule_number: 'Rule 6(1)(d)',
            rule_title: 'Invalid Packing Date Format',
            description: 'Packing date missing statutory MM/YYYY format notation.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 25,
          },
          {
            id: 'viol-10-2',
            rule_number: 'Rule 6(1)(f)',
            rule_title: 'Missing Consumer Care Telephone',
            description: 'Customer grievance details missing mandatory functioning telephone/toll-free number.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'WARNING',
            score_deduction: 15,
          },
        ],
      },
      // 11. Dettol Liquid Handwash Refill (FAIL - Score 50)
      {
        id: 'scn-fmcg-11',
        session_id: 'ses-del-01',
        brand_id: 'brd-reckitt',
        product_name: 'Dettol Original Liquid Handwash Refill (175ml)',
        category: 'GENERAL',
        source: 'SAMPLE_SEED',
        reference_width_mm: 115,
        image_url: '/uploads/samples/dettol_handwash_175ml.jpg',
        declared_mrp: 49.0,
        declared_net_qty: 175.0,
        declared_net_unit: 'ml',
        calculated_usp: '₹0.28 / ml',
        compliance_score: 50,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-11-1',
            rule_number: 'Rule 6(1)(g)',
            rule_title: 'Missing Country of Origin (COO)',
            description: 'Country of Origin (COO) completely missing from front Principal Display Panel.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 20,
          },
          {
            id: 'viol-11-2',
            rule_number: 'Rule 6(11)',
            rule_title: 'Missing Unit Sale Price (USP)',
            description: 'Package exceeds 100ml but fails to display statutory Unit Sale Price per ml.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 30,
          },
        ],
        seizureMemo: {
          memo_number: 'MEMO-2026-DL-002',
          premises_name: 'Rajdhani Mega Mart, Karol Bagh',
          trader_name: 'Surender Mohan',
          witness_name: 'Pankaj Tyagi',
          status: 'ISSUED',
        },
      },
      // 12. Colgate Strong Teeth Toothpaste (PASS - Score 100)
      {
        id: 'scn-fmcg-12',
        session_id: 'ses-mum-02',
        brand_id: 'brd-colgate',
        product_name: 'Colgate Strong Teeth Toothpaste (100g)',
        category: 'COSMETICS',
        source: 'SAMPLE_SEED',
        reference_width_mm: 180,
        image_url: '/uploads/samples/colgate_100g.jpg',
        declared_mrp: 62.0,
        declared_net_qty: 100.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.62 / g',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 13. Fortune Sunlite Refined Sunflower Oil (PASS - Score 100)
      {
        id: 'scn-fmcg-13',
        session_id: 'ses-del-01',
        brand_id: 'brd-fortune',
        product_name: 'Fortune Sunlite Refined Sunflower Oil (1L)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 130,
        image_url: '/uploads/samples/fortune_oil_1l.jpg',
        declared_mrp: 145.0,
        declared_net_qty: 1000.0,
        declared_net_unit: 'ml',
        calculated_usp: '₹145.00 / L',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 14. Surf Excel Easy Wash Detergent (FAIL - Score 60)
      {
        id: 'scn-fmcg-14',
        session_id: 'ses-del-01',
        brand_id: 'brd-hul',
        product_name: 'Surf Excel Easy Wash Detergent Powder (1kg)',
        category: 'GENERAL',
        source: 'SAMPLE_SEED',
        reference_width_mm: 190,
        image_url: '/uploads/samples/surf_excel_1kg.jpg',
        declared_mrp: 135.0,
        declared_net_qty: 1.0,
        declared_net_unit: 'kg',
        calculated_usp: '₹135.00 / kg',
        compliance_score: 60,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-14-1',
            rule_number: 'Rule 6(1)(b)',
            rule_title: 'Incomplete Manufacturing Facility Address',
            description: 'Pack fails to identify specific manufacturing factory location among multiple units.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'MODERATE',
            score_deduction: 20,
          },
          {
            id: 'viol-14-2',
            rule_number: 'Rule 7',
            rule_title: 'Undersized Font Height on Table 1',
            description: 'Net weight numeral height measured at 1.2mm, below the 2.0mm statutory Table 1 requirement.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'MODERATE',
            score_deduction: 20,
          },
        ],
        seizureMemo: {
          memo_number: 'MEMO-2026-DL-003',
          premises_name: 'Chawla Superstore, Rohini Sector 7',
          trader_name: 'Davinder Chawla',
          witness_name: 'Harish Sethi',
          status: 'DRAFTED',
        },
      },
      // 15. Parachute Coconut Oil (REVIEW - Score 75)
      {
        id: 'scn-fmcg-15',
        session_id: 'ses-blr-03',
        brand_id: 'brd-marico',
        product_name: 'Parachute 100% Pure Coconut Oil (200ml)',
        category: 'COSMETICS',
        source: 'SAMPLE_SEED',
        reference_width_mm: 65,
        image_url: '/uploads/samples/parachute_oil_200ml.jpg',
        declared_mrp: 75.0,
        declared_net_qty: 200.0,
        declared_net_unit: 'ml',
        calculated_usp: '₹0.375 / ml',
        compliance_score: 75,
        verdict: 'REVIEW',
        is_officer_confirmed: 0,
        officer_notes: 'Cylindrical bottle surface curvature causing OCR reflection. Officer confirmation required.',
        violations: [
          {
            id: 'viol-15-1',
            rule_number: 'Rule 6(1)(b)',
            rule_title: 'Curvature Glare on Manufacturer Address',
            description: 'Optical OCR confidence <70% on manufacturer address line due to surface reflection.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'WARNING',
            score_deduction: 25,
          },
        ],
      },
      // 16. Saffola Gold Pro Healthy Oil (PASS - Score 100)
      {
        id: 'scn-fmcg-16',
        session_id: 'ses-mum-02',
        brand_id: 'brd-marico',
        product_name: 'Saffola Gold Pro Healthy Lifestyle Oil (1L)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 125,
        image_url: '/uploads/samples/saffola_gold_1l.jpg',
        declared_mrp: 165.0,
        declared_net_qty: 1000.0,
        declared_net_unit: 'ml',
        calculated_usp: '₹165.00 / L',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 17. Knorr Classic Mixed Veg Soup (FAIL - Score 60)
      {
        id: 'scn-fmcg-17',
        session_id: 'ses-ecom-04',
        brand_id: 'brd-hul',
        product_name: 'Knorr Classic Mixed Vegetable Soup (45g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 110,
        image_url: '/uploads/samples/knorr_soup_45g.jpg',
        declared_mrp: 35.0,
        declared_net_qty: 45.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.778 / g',
        compliance_score: 60,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-17-1',
            rule_number: 'Rule 6(1)(e)',
            rule_title: 'Missing Inclusive of All Taxes Statement',
            description: "MRP price panel does not state 'inclusive of all taxes'.",
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 20,
          },
          {
            id: 'viol-17-2',
            rule_number: 'Rule 5',
            rule_title: 'Non-Standard Weight Schedule Violation',
            description: '45g package size violates standard Second Schedule weight increments (50g / 100g).',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 20,
          },
        ],
        ecom: {
          platform: 'Amazon',
          product_url: 'https://www.amazon.in/dp/B00TYG9XW4',
          asin_sku: 'B00TYG9XW4',
          seller_name: 'Cloudtail India / Appario Retail',
          coo_declared: 1,
          coo_filter_present: 1,
          aeo_bonded_declared: 0,
        },
      },
      // 18. Everest Garam Masala (PASS - Score 100)
      {
        id: 'scn-fmcg-18',
        session_id: 'ses-mum-02',
        brand_id: 'brd-everest',
        product_name: 'Everest Garam Masala Powder (100g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 90,
        image_url: '/uploads/samples/everest_garam_masala_100g.jpg',
        declared_mrp: 85.0,
        declared_net_qty: 100.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.85 / g',
        compliance_score: 100,
        verdict: 'PASS',
        is_officer_confirmed: 1,
        violations: [],
      },
      // 19. Head & Shoulders Anti-Dandruff Shampoo (FAIL - Score 60)
      {
        id: 'scn-fmcg-19',
        session_id: 'ses-ecom-04',
        brand_id: 'brd-hul',
        product_name: 'Head & Shoulders Anti-Dandruff Shampoo (180ml)',
        category: 'COSMETICS',
        source: 'SAMPLE_SEED',
        reference_width_mm: 75,
        image_url: '/uploads/samples/head_shoulders_180ml.jpg',
        declared_mrp: 160.0,
        declared_net_qty: 180.0,
        declared_net_unit: 'ML', // Non-standard unit casing
        calculated_usp: '₹0.889 / ml',
        compliance_score: 60,
        verdict: 'FAIL',
        is_officer_confirmed: 0,
        violations: [
          {
            id: 'viol-19-1',
            rule_number: 'Rule 6(11)',
            rule_title: 'Omission of Unit Sale Price',
            description: 'Package volume 180ml exceeds 100ml threshold but omits Unit Sale Price per ml.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'CRITICAL',
            score_deduction: 30,
          },
          {
            id: 'viol-19-2',
            rule_number: 'Rule 6(1)(c)',
            rule_title: 'Non-Standard SI Unit Casing',
            description: "Declared net volume in uppercase 'ML' violating SI symbol standard 'ml'.",
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'WARNING',
            score_deduction: 10,
          },
        ],
        ecom: {
          platform: 'Zepto',
          product_url: 'https://www.zepto.com/product/head-shoulders-shampoo-180ml',
          asin_sku: 'ZEPTO-HS-180ML',
          seller_name: 'Kiranakart Technologies Pvt Ltd',
          coo_declared: 1,
          coo_filter_present: 1,
          aeo_bonded_declared: 0,
        },
      },
      // 20. Bournvita Chocolate Health Drink (REVIEW - Score 75)
      {
        id: 'scn-fmcg-20',
        session_id: 'ses-del-01',
        brand_id: 'brd-mondelez',
        product_name: 'Bournvita Chocolate Health Drink (500g)',
        category: 'FOOD',
        source: 'SAMPLE_SEED',
        reference_width_mm: 110,
        image_url: '/uploads/samples/bournvita_500g.jpg',
        declared_mrp: 235.0,
        declared_net_qty: 500.0,
        declared_net_unit: 'g',
        calculated_usp: '₹0.47 / g',
        compliance_score: 75,
        verdict: 'REVIEW',
        is_officer_confirmed: 0,
        micrometer_reading_mm: 1.92,
        officer_notes: 'Jar label font height borderline (1.92mm vs 2.00mm threshold). Officer review pending.',
        violations: [
          {
            id: 'viol-20-1',
            rule_number: 'Rule 7',
            rule_title: 'Table 1 Font Height Near Threshold',
            description: 'Heuristic optical reading 1.92mm is near 2.00mm Table 1 statutory boundary for 500g pack.',
            penalty_section: 'Section 36(1) Legal Metrology Act, 2009',
            severity: 'WARNING',
            score_deduction: 25,
          },
        ],
      },
    ];

    const insertScan = db.prepare(`
      INSERT OR REPLACE INTO scans (
        id, session_id, brand_id, product_name, category, source,
        reference_width_mm, image_url, declared_mrp, declared_net_qty,
        declared_net_unit, calculated_usp, compliance_score, verdict,
        sha256_hash, is_officer_confirmed, micrometer_reading_mm, officer_notes
      ) VALUES (
        @id, @session_id, @brand_id, @product_name, @category, @source,
        @reference_width_mm, @image_url, @declared_mrp, @declared_net_qty,
        @declared_net_unit, @calculated_usp, @compliance_score, @verdict,
        @sha256_hash, @is_officer_confirmed, @micrometer_reading_mm, @officer_notes
      )
    `);

    const insertViolation = db.prepare(`
      INSERT OR REPLACE INTO violations (
        id, scan_id, rule_number, rule_title, description, penalty_section, severity, score_deduction
      ) VALUES (
        @id, @scan_id, @rule_number, @rule_title, @description, @penalty_section, @severity, @score_deduction
      )
    `);

    const insertEcom = db.prepare(`
      INSERT OR REPLACE INTO ecom_metadata (
        id, scan_id, platform, product_url, asin_sku, seller_name, coo_declared, coo_filter_present, aeo_bonded_declared
      ) VALUES (
        @id, @scan_id, @platform, @product_url, @asin_sku, @seller_name, @coo_declared, @coo_filter_present, @aeo_bonded_declared
      )
    `);

    const insertMemo = db.prepare(`
      INSERT OR REPLACE INTO seizure_memos (
        id, scan_id, officer_id, memo_number, premises_name, trader_name, witness_name, pdf_path, qr_code_payload, status
      ) VALUES (
        @id, @scan_id, @officer_id, @memo_number, @premises_name, @trader_name, @witness_name, @pdf_path, @qr_code_payload, @status
      )
    `);

    const insertAuditTrail = db.prepare(`
      INSERT OR REPLACE INTO audit_trail (id, scan_id, event_type, actor_id, sha256_hash)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertAcknowledgement = db.prepare(`
      INSERT OR REPLACE INTO acknowledgements (
        id, scan_id, reference_id, user_id, contact_email, contact_phone, status, filed_at, due_date, acknowledge_pdf_url, acknowledge_sha256
      ) VALUES (
        @id, @scan_id, @reference_id, @user_id, @contact_email, @contact_phone, @status, @filed_at, @due_date, @acknowledge_pdf_url, @acknowledge_sha256
      )
    `);

    for (const scan of testScans) {
      // Deterministic evidence hash for BSA 2023 legal audit trail
      const hashPayload = JSON.stringify({
        id: scan.id,
        brand_id: scan.brand_id,
        product: scan.product_name,
        mrp: scan.declared_mrp,
        netQty: scan.declared_net_qty,
        score: scan.compliance_score,
        verdict: scan.verdict,
        violationsCount: scan.violations.length,
      });
      const sha256Hash = generateHash(hashPayload);

      insertScan.run({
        id: scan.id,
        session_id: scan.session_id,
        brand_id: scan.brand_id,
        product_name: scan.product_name,
        category: scan.category,
        source: scan.source,
        reference_width_mm: scan.reference_width_mm,
        image_url: scan.image_url,
        declared_mrp: scan.declared_mrp,
        declared_net_qty: scan.declared_net_qty,
        declared_net_unit: scan.declared_net_unit,
        calculated_usp: scan.calculated_usp,
        compliance_score: scan.compliance_score,
        verdict: scan.verdict,
        sha256_hash: sha256Hash,
        is_officer_confirmed: scan.is_officer_confirmed,
        micrometer_reading_mm: scan.micrometer_reading_mm || null,
        officer_notes: scan.officer_notes || null,
      });

      // Insert violations
      for (const v of scan.violations) {
        insertViolation.run({
          id: v.id,
          scan_id: scan.id,
          rule_number: v.rule_number,
          rule_title: v.rule_title,
          description: v.description,
          penalty_section: v.penalty_section,
          severity: v.severity,
          score_deduction: v.score_deduction,
        });
      }

      // Insert e-commerce metadata if applicable
      if (scan.ecom) {
        insertEcom.run({
          id: `ecom-${scan.id}`,
          scan_id: scan.id,
          platform: scan.ecom.platform,
          product_url: scan.ecom.product_url,
          asin_sku: scan.ecom.asin_sku,
          seller_name: scan.ecom.seller_name,
          coo_declared: scan.ecom.coo_declared,
          coo_filter_present: scan.ecom.coo_filter_present,
          aeo_bonded_declared: scan.ecom.aeo_bonded_declared,
        });
      }

      // Insert seizure memo if applicable
      if (scan.seizureMemo) {
        insertMemo.run({
          id: `memo-${scan.id}`,
          scan_id: scan.id,
          officer_id: 'usr-lmo-01',
          memo_number: scan.seizureMemo.memo_number,
          premises_name: scan.seizureMemo.premises_name,
          trader_name: scan.seizureMemo.trader_name,
          witness_name: scan.seizureMemo.witness_name,
          pdf_path: `/reports/seizure_memos/${scan.seizureMemo.memo_number}.pdf`,
          qr_code_payload: `https://packparakh.gov.in/verify/memo/${scan.seizureMemo.memo_number}`,
          status: scan.seizureMemo.status,
        });
      }

      // Insert immutable audit trail entry (Section 63 BSA 2023)
      insertAuditTrail.run(
        `trail-${scan.id}`,
        scan.id,
        'SCAN_INGESTED',
        'usr-lmo-01',
        sha256Hash
      );

      // Insert e-District acknowledgement record
      const seqNum = scan.id.split('-').pop() || '01';
      const refId = `DOCA/DL/2026/0842${seqNum}-${sha256Hash.substring(0, 4).toUpperCase()}`;
      const filedAt = new Date().toISOString();
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      insertAcknowledgement.run({
        id: `ack-${scan.id}`,
        scan_id: scan.id,
        reference_id: refId,
        user_id: 'usr-lmo-01',
        contact_email: 'compliance.officer@doca.gov.in',
        contact_phone: '+91 98765 43210',
        status: scan.verdict === 'FAIL' ? 'ACTION_TAKEN' : scan.verdict === 'REVIEW' ? 'UNDER_REVIEW' : 'CLOSED',
        filed_at: filedAt,
        due_date: dueDate,
        acknowledge_pdf_url: `/api/v1/acknowledgements/${refId}/pdf`,
        acknowledge_sha256: generateHash(refId + filedAt),
      });
    }

    // ------------------------------------------------------------------------
    // 5. Update Brand Violation Counts & Dynamic Risk Levels
    // ------------------------------------------------------------------------
    console.log('[Seed] Updating Brand violation counts & dynamic risk levels...');
    const brandViolations = db
      .prepare(`
        SELECT s.brand_id, COUNT(v.id) as violation_count
        FROM scans s
        JOIN violations v ON s.id = v.scan_id
        GROUP BY s.brand_id
      `)
      .all() as Array<{ brand_id: string; violation_count: number }>;

    const updateBrandStats = db.prepare(`
      UPDATE brands
      SET total_violations = @count,
          risk_level = CASE
            WHEN @count >= 4 THEN 'CRITICAL'
            WHEN @count >= 2 THEN 'HIGH'
            WHEN @count >= 1 THEN 'MEDIUM'
            ELSE 'LOW'
          END
      WHERE id = @brand_id
    `);

    for (const bv of brandViolations) {
      updateBrandStats.run({
        brand_id: bv.brand_id,
        count: bv.violation_count,
      });
    }
  });

  // Execute transaction
  transaction();

  // Print Summary
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
  const brandCount = (db.prepare('SELECT COUNT(*) as c FROM brands').get() as any).c;
  const scanCount = (db.prepare('SELECT COUNT(*) as c FROM scans').get() as any).c;
  const violationCount = (db.prepare('SELECT COUNT(*) as c FROM violations').get() as any).c;
  const memoCount = (db.prepare('SELECT COUNT(*) as c FROM seizure_memos').get() as any).c;
  const ackCount = (db.prepare('SELECT COUNT(*) as c FROM acknowledgements').get() as any).c;

  console.log('-------------------------------------------------------');
  console.log(`✅ Database Seeding Completed Successfully!`);
  console.log(`   👥 Users Seeded:           ${userCount}`);
  console.log(`   🏭 Brands Registered:      ${brandCount}`);
  console.log(`   📦 FMCG Test Scans:        ${scanCount} (8 PASS, 9 FAIL, 3 REVIEW)`);
  console.log(`   ⚖️  Statutory Violations:   ${violationCount}`);
  console.log(`   📄 Form-V Seizure Memos:   ${memoCount}`);
  console.log(`   🏛️  e-District Tokens:     ${ackCount}`);
  console.log('=======================================================');
}

// Auto-run if executed directly via `npm run seed` or `tsx src/database/seed.ts`
if (require.main === module) {
  seedDatabase();
  closeDb();
}

export default seedDatabase;
