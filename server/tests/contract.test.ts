import http from 'http';
import { AddressInfo } from 'net';
import app from '../src/index';
import { initDb, closeDb } from '../src/database/db';

// ============================================================================
// Contract Conformance Suite — Wednesday (Sep 9) deliverable.
// Verifies every Swetakshi-owned endpoint response against the exact payload
// shapes specified in Frontend_Lead.md / Backend_Lead.md so the client PWA
// integrates with zero mismatches.
// ============================================================================

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

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`CONTRACT MISMATCH: ${message}`);
  }
}

async function runContractTests() {
  console.log('=======================================================');
  console.log('🧪 Running Frontend_Lead.md Contract Conformance Suite');
  console.log('=======================================================');

  initDb();

  const dummyImage = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const VERDICTS = ['PASS', 'FAIL', 'REVIEW'];
  const SOURCES = ['LIVE_CAMERA', 'DEMO_CACHED', 'SAMPLE_SEED'];
  const SEVERITIES = ['CRITICAL', 'MODERATE', 'WARNING'];
  const BOX_STATUSES = ['PASS', 'FAIL', 'REVIEW'];

  const testServer = http.createServer(app);
  await new Promise<void>((resolve) => testServer.listen(0, '127.0.0.1', () => resolve()));
  const port = (testServer.address() as AddressInfo).port;

  try {
    // --- POST /api/auth/login ----------------------------------------------
    console.log('Contract 1: POST /api/auth/login...');
    const login = await requestJson(
      port,
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { role: 'CITIZEN', identifier: 'citizen' }
    );
    const citizenToken = login.body.token;
    assert(login.status === 200 && typeof login.body.token === 'string' && login.body.token.length > 0, 'login token missing');
    assert(typeof login.body.user?.id === 'string' && typeof login.body.user?.name === 'string', 'login user.id/name missing');
    assert(typeof login.body.user?.role === 'string' && typeof login.body.user?.district === 'string', 'login user.role/district missing');

    const lmoLogin = await requestJson(
      port,
      { path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { role: 'LMO', identifier: 'LMO-DL-2026-44' }
    );
    const lmoToken = lmoLogin.body.token;

    // --- GET /api/system/status --------------------------------------------
    console.log('Contract 2: GET /api/system/status (banner telemetry)...');
    const status = await requestJson(port, { path: '/api/system/status', method: 'GET' });
    assert(status.status === 200, 'system status HTTP 200');
    assert(status.body.status === 'OPERATIONAL', `status field: ${status.body.status}`);
    assert(typeof status.body.ruleEngineVersion === 'string' && status.body.ruleEngineVersion === '2.1', 'ruleEngineVersion');
    assert(status.body.rulesActive === 24, `rulesActive: ${status.body.rulesActive}`);
    assert(status.body.database === 'CONNECTED (WAL Mode)', `database: ${status.body.database}`);
    assert(typeof status.body.totalScansProcessed === 'number' && status.body.totalScansProcessed >= 0, 'totalScansProcessed');

    // --- POST /api/rules/simulate ------------------------------------------
    console.log('Contract 3: POST /api/rules/simulate (Table-I font + declarations)...');
    const simulate = await requestJson(
      port,
      { path: '/api/rules/simulate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { pdpAreaCm2: 300, netQuantityValue: 250, netQuantityUnit: 'g' }
    );
    assert(simulate.status === 200, 'simulate HTTP 200');
    assert(typeof simulate.body.minFontHeightMm === 'number' && simulate.body.minFontHeightMm > 0, `minFontHeightMm: ${simulate.body.minFontHeightMm}`);
    assert(typeof simulate.body.requiredDualUnitFormat === 'string' && simulate.body.requiredDualUnitFormat.length > 0, 'requiredDualUnitFormat');
    assert(Array.isArray(simulate.body.mandatoryDeclarations) && simulate.body.mandatoryDeclarations.length > 0, 'mandatoryDeclarations');

    // --- POST /api/scan/physical (compliant fixture, TIER_B) ----------------
    console.log('Contract 4: POST /api/scan/physical (full evidence payload)...');
    const scan = await uploadPhysical(
      port,
      citizenToken,
      { calibrationMode: 'TIER_B', referenceWidthMm: '240', category: 'FOOD', source: 'DEMO_CACHED', preset: 'compliant' },
      dummyImage
    );
    assert(scan.status === 200, 'physical HTTP 200');
    const b = scan.body;
    assert(typeof b.scanId === 'string' && b.scanId.length > 0, 'scanId');
    assert(typeof b.timestamp === 'string' && !isNaN(Date.parse(b.timestamp)), 'timestamp');
    assert(typeof b.sha256Hash === 'string' && b.sha256Hash.length === 64, 'sha256Hash (64 hex chars)');
    assert(SOURCES.includes(b.source), `source: ${b.source}`);
    assert(VERDICTS.includes(b.verdict), `verdict: ${b.verdict}`);
    assert(typeof b.complianceScore === 'number' && b.complianceScore >= 0 && b.complianceScore <= 100, `complianceScore: ${b.complianceScore}`);
    assert(typeof b.measuredFontHeightMm === 'number' && b.measuredFontHeightMm > 0, `measuredFontHeightMm: ${b.measuredFontHeightMm}`);

    assert(typeof b.extractedFields?.mrp?.declared === 'number' && typeof b.extractedFields.mrp.valid === 'boolean', 'extractedFields.mrp');
    assert(typeof b.extractedFields?.netQuantity?.value === 'number' && typeof b.extractedFields.netQuantity.unit === 'string' && typeof b.extractedFields.netQuantity.valid === 'boolean', 'extractedFields.netQuantity');
    assert(typeof b.extractedFields?.unitSalePrice?.calculated === 'string' && typeof b.extractedFields.unitSalePrice.declared === 'string' && typeof b.extractedFields.unitSalePrice.valid === 'boolean', 'extractedFields.unitSalePrice');
    assert(typeof b.extractedFields?.mfgDate?.text === 'string' && typeof b.extractedFields.mfgDate.valid === 'boolean', 'extractedFields.mfgDate');
    assert(typeof b.extractedFields?.countryOfOrigin?.text === 'string' && typeof b.extractedFields.countryOfOrigin.valid === 'boolean', 'extractedFields.countryOfOrigin');
    assert(typeof b.extractedFields?.manufacturerAddress?.text === 'string' && typeof b.extractedFields.manufacturerAddress.valid === 'boolean', 'extractedFields.manufacturerAddress');
    assert(typeof b.extractedFields?.consumerCare?.text === 'string' && typeof b.extractedFields.consumerCare.valid === 'boolean', 'extractedFields.consumerCare');

    assert(Array.isArray(b.violations), 'violations array');
    for (const v of b.violations) {
      assert(typeof v.ruleNumber === 'string' && typeof v.title === 'string', 'violation ruleNumber/title');
      assert(typeof v.description === 'string' && typeof v.penaltyClause === 'string', 'violation description/penaltyClause');
      assert(SEVERITIES.includes(v.severity), `violation severity: ${v.severity}`);
      assert(typeof v.deduction === 'number', 'violation deduction');
    }

    assert(Array.isArray(b.boundingBoxes) && b.boundingBoxes.length > 0, 'boundingBoxes non-empty');
    for (const box of b.boundingBoxes) {
      assert(Array.isArray(box.box_2d) && box.box_2d.length === 4 && box.box_2d.every((n: number) => typeof n === 'number'), 'bbox.box_2d');
      assert(typeof box.label === 'string' && box.label.length > 0, 'bbox.label');
      assert(typeof box.confidence === 'number' && box.confidence >= 0 && box.confidence <= 100, `bbox.confidence (0-100): ${box.confidence}`);
      assert(BOX_STATUSES.includes(box.status), `bbox.status: ${box.status}`);
    }

    // --- POST /api/scan/:id/confirm (LMO roles) -----------------------------
    console.log('Contract 5: POST /api/scan/:id/confirm (officer micrometer sign-off)...');
    const confirm = await requestJson(
      port,
      {
        path: `/api/scan/${b.scanId}/confirm`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${lmoToken}` },
      },
      { officerConfirmed: true, micrometerReadingMm: 1.2, notes: 'Micrometer verified on-site' }
    );
    assert(confirm.status === 200, 'confirm HTTP 200');
    assert(confirm.body.success === true && confirm.body.scanId === b.scanId, 'confirm success/scanId');
    assert(confirm.body.isOfficerConfirmed === true && confirm.body.isCourtReady === true, 'confirm officer/court flags');

    console.log('=======================================================');
    console.log('🎉 All Frontend_Lead.md Contract Checks Passed!');
    console.log('=======================================================');
  } finally {
    testServer.close();
    closeDb();
  }
}

runContractTests().catch((err) => {
  console.error('❌ Contract conformance suite failed:', err);
  process.exit(1);
});