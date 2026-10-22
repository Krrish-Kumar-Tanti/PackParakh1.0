// ============================================================================
// PackParakh (पैक-परख) — DoCA National Analytics Automated Test Suite
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Author: Gitansh (Backend Lead)
// ============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { app } from '../src/index';
import { initDb } from '../src/database/db';
import { seedDatabase } from '../src/database/seed';

// Ensure DB is initialized and seeded before testing
initDb();
seedDatabase();

function request(
  serverInstance: http.Server,
  method: string,
  path: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: any; rawBuffer: Buffer }> {
  return new Promise((resolve, reject) => {
    const addr = serverInstance.address();
    if (!addr || typeof addr === 'string') {
      return reject(new Error('Server address not available'));
    }
    const port = addr.port;

    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders: Record<string, string> = {
      ...headers,
    };
    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        method,
        path,
        headers: reqHeaders,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const rawBuffer = Buffer.concat(chunks);
          let parsedBody: any = null;
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            try {
              parsedBody = JSON.parse(rawBuffer.toString('utf8'));
            } catch {
              parsedBody = rawBuffer.toString('utf8');
            }
          } else {
            parsedBody = rawBuffer.toString('utf8');
          }
          resolve({
            status: res.statusCode || 500,
            headers: res.headers,
            body: parsedBody,
            rawBuffer,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

test('DoCA National Analytics & Brand Ledger Suite (/api/analytics)', async () => {
  const serverInstance = http.createServer(app);
  await new Promise<void>((res) => serverInstance.listen(0, res));

  try {
    // 1. GET /api/analytics/summary
    const resSummary = await request(serverInstance, 'GET', '/api/analytics/summary');
    assert.equal(resSummary.status, 200);
    assert.equal(resSummary.body.success, true);
    assert.ok(resSummary.body.totalScans >= 20);
    assert.match(resSummary.body.passRate, /^\d+\.\d+%$/);
    assert.match(resSummary.body.failRate, /^\d+\.\d+%$/);
    assert.ok(typeof resSummary.body.hoursSaved === 'number');
    assert.ok(resSummary.body.hoursSaved > 0);
    assert.ok(typeof resSummary.body.noticesDrafted === 'number');
    assert.ok(resSummary.body.totalViolations > 0);
    assert.ok(resSummary.body.compoundingRevenueTracked > 0);

    // 2. GET /api/analytics/brand-ledger
    const resLedger = await request(serverInstance, 'GET', '/api/analytics/brand-ledger');
    assert.equal(resLedger.status, 200);
    assert.equal(resLedger.body.success, true);
    assert.ok(Array.isArray(resLedger.body.ledger));
    assert.ok(resLedger.body.ledger.length >= 10);

    const firstBrand = resLedger.body.ledger[0];
    assert.ok(firstBrand.brandId);
    assert.ok(firstBrand.brandName);
    assert.ok(firstBrand.directorName);
    assert.ok(firstBrand.directorAccountabilityRule.includes('Rule 27'));
    assert.ok(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(firstBrand.riskLevel));
    assert.ok(typeof firstBrand.totalScans === 'number');
    assert.ok(typeof firstBrand.violationsCount === 'number');
    assert.match(firstBrand.defectRate, /^\d+\.\d+%$/);
    assert.ok(firstBrand.penaltyEscalationTier);
    assert.ok(firstBrand.statutoryPenaltyClause);

    // 3. GET /api/analytics/district-heatmap
    const resHeatmap = await request(serverInstance, 'GET', '/api/analytics/district-heatmap');
    assert.equal(resHeatmap.status, 200);
    assert.equal(resHeatmap.body.success, true);
    assert.ok(Array.isArray(resHeatmap.body.heatmap));
    assert.ok(resHeatmap.body.heatmap.length >= 3);

    const firstDistrict = resHeatmap.body.heatmap[0];
    assert.ok(firstDistrict.state);
    assert.ok(firstDistrict.district);
    assert.ok(firstDistrict.totalScans > 0);
    assert.ok(typeof firstDistrict.violations === 'number');
    assert.match(firstDistrict.defectRate, /^\d+\.\d+%$/);
  } finally {
    await new Promise<void>((res) => serverInstance.close(() => res()));
  }
});
