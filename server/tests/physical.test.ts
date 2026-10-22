import http from 'http';
import { AddressInfo } from 'net';
import app from '../src/index';
import { getDb, initDb, closeDb } from '../src/database/db';
import { evaluatePhysicalRules, calibratePhysicalScale, parseMfgDate } from '../src/controllers/scanController';
import { getDemoFixture } from '../src/services/visionBridge';

async function uploadPhysical(
  serverPort: number,
  token: string,
  fields: Record<string, string>,
  image: Buffer
): Promise<{ status: number; body: any }> {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  form.append('image', new Blob([image], { type: 'image/png' }), 'pack.png');
  const res = await fetch(`http://127.0.0.1:${serverPort}/api/scan/physical`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const body = await res.json();
  return { status: res.status, body };
}

function requestJson(
  serverPort: number,
  options: { path: string; method: string; headers?: Record<string, string> },
  postData?: any
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: serverPort,
        path: options.path,
        method: options.method,
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 500, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode || 500, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runPhysicalTests() {
  console.log('=======================================================');
  console.log('🧪 Running Physical Scan Pipeline & Rule Engine Tests');
  console.log('=======================================================');

  initDb();

  const dummyImage = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);

  const testServer = http.createServer(app);
  await new Promise<void>((resolve) => testServer.listen(0, '127.0.0.1', () => resolve()));
  const port = (testServer.address() as AddressInfo).port;
  console.log(`[TestServer] Ephemeral server running on port: ${port}`);

  try {
    // ======================================================================
    // UNIT TESTS — deterministic rule engine (no HTTP, no AI)
    // ======================================================================
    console.log('Unit 1: TIER_B calibration math (240mm width over 2400px)...');
    const scaleB = calibratePhysicalScale('TIER_B', 2400, 240);
    if (Math.abs(scaleB.mmPerPixel - 0.1) > 1e-9 || scaleB.requiresScaleConfirmation !== false) {
      throw new Error(`TIER_B calibration mismatch: ${JSON.stringify(scaleB)}`);
    }

    console.log('Unit 2: TIER_C calibration triggers HITL (abstain)...');
    const scaleC = calibratePhysicalScale('TIER_C', 2400);
    if (scaleC.requiresScaleConfirmation !== true) {
      throw new Error('TIER_C must require scale confirmation');
    }

    console.log('Unit 3: parseMfgDate valid past month/year...');
    if (!parseMfgDate('MFG: 08/2026').valid || parseMfgDate('MFG: 08/2026').isFuture) {
      throw new Error('parseMfgDate failed on valid past date');
    }

    console.log('Unit 4: Physically compliant fixture + TIER_B => PASS...');
    const compliantEval = evaluatePhysicalRules(getDemoFixture('compliant'), scaleB, 'FOOD');
    if (compliantEval.verdict !== 'PASS') {
      throw new Error(`Compliant fixture expected PASS, got ${compliantEval.verdict}: ${JSON.stringify(compliantEval.violations)}`);
    }

    console.log('Unit 5: Multi-violation fixture + TIER_C => FAIL (non-metric unit + missing USP)...');
    const violationEval = evaluatePhysicalRules(getDemoFixture('violation'), scaleC, 'FOOD');
    if (violationEval.verdict !== 'FAIL') {
      throw new Error(`Violation fixture expected FAIL, got ${violationEval.verdict}`);
    }
    const unitViolation = violationEval.violations.find((v) => v.ruleNumber === 'Rule 6(1)(c)');
    const uspViolation = violationEval.violations.find((v) => v.ruleNumber === 'Rule 6(11)');
    if (!unitViolation || !uspViolation) {
      throw new Error('Expected Rule 6(1)(c) unit + Rule 6(11) USP failures, got: ' + JSON.stringify(violationEval.violations));
    }

    console.log('Unit 6: Review fixture + UNCALIBRATED scale => REVIEW (HITL)...');
    const reviewEval = evaluatePhysicalRules(getDemoFixture('review'), scaleC, 'FOOD');
    if (reviewEval.verdict !== 'REVIEW') {
      throw new Error(`Review fixture expected REVIEW, got ${reviewEval.verdict}`);
    }

    console.log('Unit 7: ELECTRONICS categories exempt mfg-date rule...');
    const electronics = evaluatePhysicalRules({ ...getDemoFixture('compliant'), mfgDateRaw: '', mfgDateValid: false }, scaleB, 'ELECTRONICS');
    if (electronics.violations.some((v) => v.ruleNumber === 'Rule 6(1)(d)')) {
      throw new Error('ELECTRONICS category must exempt Rule 6(1)(d)');
    }

    // ======================================================================
    // HTTP TESTS
    // ======================================================================
    console.log('HTTP 1: /api/rules/simulate (250g => 2.0mm, dual-unit format)...');
    const simulateRes = await requestJson(
      port,
      { path: '/api/rules/simulate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { pdpAreaCm2: 300, netQuantityValue: 250, netQuantityUnit: 'g' }
    );
    if (simulateRes.status !== 200 || simulateRes.body.minFontHeightMm !== 2.0) {
      throw new Error(`Simulate failed: ${JSON.stringify(simulateRes.body)}`);
    }

    console.log('HTTP 2: /api/rules/simulate falls back to PDP-area heuristic when net qty unknown...');
    const simulateAreaRes = await requestJson(
      port,
      { path: '/api/rules/simulate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { pdpAreaCm2: 120 }
    );
    if (simulateAreaRes.status !== 200 || simulateAreaRes.body.fontHeightBasedOn !== 'PDP_AREA') {
      throw new Error(`Area-based simulate failed: ${JSON.stringify(simulateAreaRes.body)}`);
    }

    // Login as citizen (allowed) and LMO
    const citizenRes = await requestJson(
      port,
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { role: 'CITIZEN', identifier: 'citizen' }
    );
    const lmoRes = await requestJson(
      port,
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { role: 'LMO', identifier: 'LMO-DL-2026-44' }
    );
    const citizenToken = citizenRes.body.token;
    const lmoToken = lmoRes.body.token;

    // Compliant physical scan (Tier-B declared width) => PASS
    console.log('HTTP 3: POST /api/scan/physical [compliant, TIER_B] => PASS...');
    const compliantScan = await uploadPhysical(
      port,
      citizenToken,
      {
        calibrationMode: 'TIER_B',
        referenceWidthMm: '240',
        category: 'FOOD',
        source: 'DEMO_CACHED',
        preset: 'compliant',
      },
      dummyImage
    );
    if (compliantScan.status !== 200 || compliantScan.body.verdict !== 'PASS' || !compliantScan.body.sha256Hash) {
      throw new Error(`Compliant physical scan failed: ${JSON.stringify(compliantScan.body)}`);
    }

    // Violation physical scan (default TIER_C) => FAIL
    console.log('HTTP 4: POST /api/scan/physical [violation, TIER_C] => FAIL...');
    const violationScan = await uploadPhysical(
      port,
      citizenToken,
      { category: 'FOOD', source: 'DEMO_CACHED', preset: 'violation' },
      dummyImage
    );
    if (violationScan.status !== 200 || violationScan.body.verdict !== 'FAIL') {
      throw new Error(`Violation physical scan failed: ${JSON.stringify(violationScan.body)}`);
    }

    // TIER_B without referenceWidthMm => 400
    console.log('HTTP 5: TIER_B without reference width => 400 validation...');
    const tierBNoRefRes = await uploadPhysical(
      port,
      citizenToken,
      { calibrationMode: 'TIER_B', category: 'FOOD', source: 'DEMO_CACHED', preset: 'compliant' },
      dummyImage
    );
    if (tierBNoRefRes.status !== 400) {
      throw new Error(`Expected 400 for TIER_B w/o width, got ${tierBNoRefRes.status}`);
    }

    // Review physical scan => REVIEW, requires HITL confirm
    console.log('HTTP 6: POST /api/scan/physical [review, TIER_C] => REVIEW...');
    const reviewScan = await uploadPhysical(
      port,
      citizenToken,
      { category: 'FOOD', source: 'DEMO_CACHED', preset: 'review' },
      dummyImage
    );
    if (reviewScan.status !== 200 || reviewScan.body.verdict !== 'REVIEW' || reviewScan.body.requiresConfirm !== true) {
      throw new Error(`Review physical scan failed: ${JSON.stringify(reviewScan.body)}`);
    }

    // LMO HITL confirm on the compliant scan
    console.log('HTTP 7: POST /api/scan/:id/confirm (LMO micrometer sign-off)...');
    const confirmRes = await requestJson(
      port,
      {
        path: `/api/scan/${compliantScan.body.scanId}/confirm`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${lmoToken}` },
      },
      { officerConfirmed: true, micrometerReadingMm: 1.2, notes: 'Verified with physical micrometer' }
    );
    if (confirmRes.status !== 200 || confirmRes.body.isOfficerConfirmed !== true || confirmRes.body.isCourtReady !== true) {
      throw new Error(`LMO confirm failed: ${JSON.stringify(confirmRes.body)}`);
    }

    // Non-LMO role (citizen) must be forbidden from confirm
    console.log('HTTP 8: Citizen confirm attempt => 403 Forbidden...');
    const forbiddenRes = await requestJson(
      port,
      {
        path: `/api/scan/${compliantScan.body.scanId}/confirm`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${citizenToken}` },
      },
      { officerConfirmed: true }
    );
    if (forbiddenRes.status !== 403) {
      throw new Error(`Expected 403 for citizen confirm, got ${forbiddenRes.status}`);
    }

    // Persistence check: scan row + violations + officer-confirmed flag
    console.log('HTTP 9: Verify SQLite persistence (scans, violations, confirm flag)...');
    const db = getDb();
    const scanRow = db.prepare('SELECT * FROM scans WHERE id = ?').get(compliantScan.body.scanId) as any;
    const violationRows = db.prepare('SELECT COUNT(*) as count FROM violations WHERE scan_id = ?').get(violationScan.body.scanId) as any;
    if (!scanRow || scanRow.is_officer_confirmed !== 1) {
      throw new Error('Confirmed scan not persisted with officer flag');
    }
    if (!violationRows || violationRows.count === 0) {
      throw new Error('Violations not persisted for FAIL scan');
    }

    console.log('=======================================================');
    console.log('🎉 All Physical Scan Pipeline & Rule Engine Tests Passed!');
    console.log('=======================================================');
  } finally {
    testServer.close();
    closeDb();
  }
}

runPhysicalTests().catch((err) => {
  console.error('❌ Physical scan test suite failed:', err);
  process.exit(1);
});