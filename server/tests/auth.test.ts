import http from 'http';
import { AddressInfo } from 'net';
import app from '../src/index';
import { getDb, initDb, closeDb } from '../src/database/db';

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

async function runAuthTests() {
  console.log('=======================================================');
  console.log('🧪 Running Authentication & RBAC Test Suite');
  console.log('=======================================================');

  initDb();

  // Create ephemeral test server on available random port
  const testServer = http.createServer(app);
  await new Promise<void>((resolve) => testServer.listen(0, '127.0.0.1', () => resolve()));
  const port = (testServer.address() as AddressInfo).port;
  console.log(`[TestServer] Ephemeral server running on port: ${port}`);

  try {
    // 1. Test LMO Login
    console.log('Test 1: LMO Officer Login (POST /api/auth/login)...');
    const lmoRes = await requestJson(
      port,
      {
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { role: 'LMO', identifier: 'LMO-DL-2026-44' }
    );

    if (lmoRes.status !== 200 || !lmoRes.body.token || lmoRes.body.user.role !== 'LMO') {
      throw new Error(`LMO Login failed: ${JSON.stringify(lmoRes.body)}`);
    }
    console.log('  ✅ LMO Login successful. Officer:', lmoRes.body.user.name, '| Badge:', lmoRes.body.user.badgeNumber);
    const lmoToken = lmoRes.body.token;

    // 2. Test MSME Login
    console.log('Test 2: MSME Packaging Lead Login (POST /api/auth/login)...');
    const msmeRes = await requestJson(
      port,
      {
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { role: 'MSME', identifier: 'GSTIN07AAAAA0000A1Z5' }
    );

    if (msmeRes.status !== 200 || !msmeRes.body.token || msmeRes.body.user.role !== 'MSME') {
      throw new Error(`MSME Login failed: ${JSON.stringify(msmeRes.body)}`);
    }
    console.log('  ✅ MSME Login successful. Unit:', msmeRes.body.user.name);

    // 3. Test CITIZEN Login
    console.log('Test 3: Citizen Instant Access (POST /api/auth/login)...');
    const citizenRes = await requestJson(
      port,
      {
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { role: 'CITIZEN', identifier: 'citizen' }
    );

    if (citizenRes.status !== 200 || !citizenRes.body.token || citizenRes.body.user.role !== 'CITIZEN') {
      throw new Error(`Citizen Login failed: ${JSON.stringify(citizenRes.body)}`);
    }
    console.log('  ✅ Citizen Login successful. User:', citizenRes.body.user.name);

    // 4. Test ADMIN Login
    console.log('Test 4: DoCA Admin Login (POST /api/auth/login)...');
    const adminRes = await requestJson(
      port,
      {
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { role: 'ADMIN', identifier: 'DOCA-HQ-01' }
    );

    if (adminRes.status !== 200 || !adminRes.body.token || adminRes.body.user.role !== 'ADMIN') {
      throw new Error(`Admin Login failed: ${JSON.stringify(adminRes.body)}`);
    }
    console.log('  ✅ Admin Login successful. Admin:', adminRes.body.user.name);

    // 5. Test Profile Verification (GET /api/auth/me) with LMO token
    console.log('Test 5: Token Verification (GET /api/auth/me with Bearer JWT)...');
    const meRes = await requestJson(port, {
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lmoToken}`,
      },
    });

    if (meRes.status !== 200 || meRes.body.user.role !== 'LMO') {
      throw new Error(`Auth /me failed: ${JSON.stringify(meRes.body)}`);
    }
    console.log('  ✅ Auth /me verified token for:', meRes.body.user.name, '(', meRes.body.user.role, ')');

    // 6. Test Unauthorized access
    console.log('Test 6: Reject unauthenticated access (GET /api/auth/me without token)...');
    const unauthRes = await requestJson(port, {
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got: ${unauthRes.status}`);
    }
    console.log('  ✅ Correctly rejected unauthenticated request with HTTP 401.');

    console.log('=======================================================');
    console.log('🎉 All Authentication & RBAC Tests Passed Successfully!');
    console.log('=======================================================');
  } finally {
    testServer.close();
    closeDb();
  }
}

runAuthTests().catch((err) => {
  console.error('❌ Auth test suite failed:', err);
  process.exit(1);
});
