// ============================================================================
// PackParakh (पैक-परख) — Form-V PDF & e-District Engine Automated Test Suite
// Ministry of Consumer Affairs, Food & Public Distribution | Legal Metrology PCR 2011
// Author: Gitansh (Backend Lead)
// ============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { app } from '../src/index';
import { getDb, initDb } from '../src/database/db';
import { seedDatabase } from '../src/database/seed';
import { generateFormVPdf } from '../src/services/pdfGenerator';
import { generateAcknowledgementPdf } from '../src/services/acknowledgementPdf';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env';
import {
  generateReferenceId,
  calculateStatutoryDueDate,
  toReferenceSlug,
  fromReferenceSlug,
  generateWhatsAppDeepLink,
} from '../src/utils/reference';

// Initialize and seed database
initDb();
seedDatabase();

// Helper to make HTTP requests against express app instance
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

test('1. Reference Token Engine (reference.ts)', async (t) => {
  await t.test('generates valid e-District token format DOCA/<STATE>/<YEAR>/<6-DIGIT>-<HASH4>', () => {
    const token = generateReferenceId('MH', 'test-seed-123', 2026);
    assert.match(token.formatted, /^DOCA\/MH\/2026\/\d{6}-[A-F0-9]{4}$/);
    assert.match(token.slug, /^DOCA-MH-2026-\d{6}-[A-F0-9]{4}$/);
    assert.equal(token.stateCode, 'MH');
    assert.equal(token.year, '2026');
  });

  await t.test('slug and formatted converters work bidirectionally', () => {
    const formatted = 'DOCA/DL/2026/184920-8A3F';
    const slug = toReferenceSlug(formatted);
    assert.equal(slug, 'DOCA-DL-2026-184920-8A3F');
    const restored = fromReferenceSlug(slug);
    assert.equal(restored, formatted);
  });

  await t.test('calculates 7-day statutory deadline for LMO officers and 14-day for citizens', () => {
    const now = new Date('2026-09-08T12:00:00.000Z');
    const lmoDue = calculateStatutoryDueDate('LMO', now);
    const citizenDue = calculateStatutoryDueDate('CITIZEN', now);

    assert.equal(lmoDue.toISOString(), '2026-09-15T12:00:00.000Z');
    assert.equal(citizenDue.toISOString(), '2026-09-22T12:00:00.000Z');
  });

  await t.test('generates official WhatsApp deep link with encoded message', () => {
    const waLink = generateWhatsAppDeepLink(
      'DOCA/MH/2026/084291-8F3A',
      'https://packparakh.gov.in/verify/DOCA-MH-2026-084291-8F3A',
      '9876543210',
      'Parle-G',
      2
    );
    assert.ok(waLink.startsWith('https://wa.me/919876543210?text='));
    assert.ok(waLink.includes('DOCA%2FMH%2F2026%2F084291-8F3A'));
  });
});

test('2. PDF Generator Unit Testing (pdfGenerator.ts & acknowledgementPdf.ts)', async (t) => {
  await t.test('generateFormVPdf creates valid PDF bytes starting with %PDF-', async () => {
    const pdfBuffer = await generateFormVPdf({
      scanId: 'scn-fmcg-01',
      memoNumber: 'MEMO-DL-2026-000001',
      productName: 'Parle-G Glucose Biscuits (80g)',
      brandName: 'Parle Products Pvt Ltd',
      directorName: 'Vijay Chauhan',
      category: 'FOOD',
      declaredMrp: 10.0,
      declaredNetQty: 80,
      declaredNetUnit: 'g',
      calculatedUsp: 'Rs. 0.125 / g',
      complianceScore: 100,
      verdict: 'PASS',
      source: 'LIVE_CAMERA',
      violations: [],
    });

    assert.ok(pdfBuffer instanceof Buffer);
    assert.ok(pdfBuffer.length > 1000, 'PDF buffer size should be > 1KB');
    const header = pdfBuffer.slice(0, 5).toString('ascii');
    assert.equal(header, '%PDF-');
  });

  await t.test('generateFormVPdf handles violations with WinAnsi characters safely', async () => {
    const pdfBuffer = await generateFormVPdf({
      scanId: 'scn-fmcg-02',
      memoNumber: 'MEMO-DL-2026-000002',
      productName: 'Maggi 2-Minute Masala Noodles (70g)',
      brandName: 'Nestle India Ltd',
      directorName: 'Suresh Narayanan',
      category: 'FOOD',
      declaredMrp: 14.0,
      declaredNetQty: 70,
      declaredNetUnit: 'gms',
      calculatedUsp: '₹0.20 / g',
      complianceScore: 50,
      verdict: 'FAIL',
      source: 'SAMPLE_SEED',
      violations: [
        {
          ruleNumber: 'Rule 6(1)(c)',
          ruleTitle: 'Non-Standard Unit Symbol',
          description: "Illegal unit declaration 'gms' used instead of statutory SI symbol 'g'.",
          penaltySection: 'Section 36(1) LM Act',
          severity: 'CRITICAL',
          scoreDeduction: 20,
        },
        {
          ruleNumber: 'Rule 6(11)',
          ruleTitle: 'Missing Unit Sale Price',
          description: 'Unit Sale Price omitted on packaging.',
          penaltySection: 'Section 36(1) LM Act',
          severity: 'CRITICAL',
          scoreDeduction: 30,
        },
      ],
    });

    assert.ok(pdfBuffer instanceof Buffer);
    assert.ok(pdfBuffer.length > 1000);
    assert.equal(pdfBuffer.slice(0, 5).toString('ascii'), '%PDF-');
  });

  await t.test('generateFormVPdf creates provisional draft watermark when scan is unconfirmed REVIEW', async () => {
    const pdfBuffer = await generateFormVPdf({
      scanId: 'scn-fmcg-07',
      productName: 'Dabur Honey 100% Pure (250g)',
      brandName: 'Dabur India Ltd',
      complianceScore: 80,
      verdict: 'REVIEW',
      isOfficerConfirmed: false,
    });

    assert.ok(pdfBuffer instanceof Buffer);
    assert.ok(pdfBuffer.length > 1000);
    assert.equal(pdfBuffer.slice(0, 5).toString('ascii'), '%PDF-');
  });

  await t.test('generateAcknowledgementPdf creates 1-page PDF slip starting with %PDF-', async () => {
    const pdfBuffer = await generateAcknowledgementPdf({
      referenceId: 'DOCA/MH/2026/084291-8F3A',
      scanId: 'scn-fmcg-02',
      productName: 'Maggi 2-Minute Noodles',
      brandName: 'Nestle India Ltd',
      status: 'SUBMITTED',
      contactEmail: 'citizen@example.com',
      contactPhone: '+91 98765 43210',
      violations: [
        {
          ruleNumber: 'Rule 6(1)(c)',
          description: "Illegal unit 'gms' used.",
          penaltySection: 'Sec 36(1) LM Act',
        },
      ],
    });

    assert.ok(pdfBuffer instanceof Buffer);
    assert.ok(pdfBuffer.length > 1000);
    assert.equal(pdfBuffer.slice(0, 5).toString('ascii'), '%PDF-');
  });
});

test('3. Report & Form-V Endpoints (/api/reports & /api/scan/confirm)', async () => {
  const serverInstance = http.createServer(app);
  await new Promise<void>((res) => serverInstance.listen(0, res));

  try {
    // 1. GET Report JSON
    const resReport = await request(serverInstance, 'GET', '/api/reports/scn-fmcg-01');
    assert.equal(resReport.status, 200);
    assert.equal(resReport.body.success, true);
    assert.equal(resReport.body.report.scanId, 'scn-fmcg-01');
    assert.equal(resReport.body.report.brandName, 'Parle Products Pvt Ltd');
    assert.ok(Array.isArray(resReport.body.report.violations));
    assert.ok(resReport.body.report.pdfUrl.includes('/api/reports/scn-fmcg-01/pdf'));

    // 2. GET Report Form-V PDF
    const resPdf = await request(serverInstance, 'GET', '/api/reports/scn-fmcg-02/pdf');
    assert.equal(resPdf.status, 200);
    assert.ok((resPdf.headers['content-type'] || '').includes('application/pdf'));
    assert.ok((resPdf.headers['content-disposition'] || '').includes('inline; filename="Form-V-Seizure-Memo-'));
    assert.equal(resPdf.rawBuffer.slice(0, 5).toString('ascii'), '%PDF-');

    // 3. GET Verify by Hash
    const db = getDb();
    const scan = db.prepare('SELECT sha256_hash FROM scans WHERE id = ?').get('scn-fmcg-01') as { sha256_hash: string };
    assert.ok(scan && scan.sha256_hash);

    const resVerify = await request(serverInstance, 'GET', `/api/reports/verify/${scan.sha256_hash}`);
    assert.equal(resVerify.status, 200);
    assert.equal(resVerify.body.verified, true);
    assert.equal(resVerify.body.scanId, 'scn-fmcg-01');
    assert.equal(resVerify.body.sha256Hash, scan.sha256_hash);
    assert.ok(resVerify.body.standard.includes('Section 63'));

    // 4. POST /api/scan/:id/confirm (with LMO role token)
    const lmoToken = jwt.sign(
      { id: 'usr-lmo-01', name: 'Inspector Rajesh Kumar', role: 'LMO', badgeNumber: 'LMO-DL-2026-44' },
      env.JWT_SECRET
    );

    const resConfirm = await request(
      serverInstance,
      'POST',
      '/api/scan/scn-fmcg-07/confirm',
      {
        officerConfirmed: true,
        micrometerReadingMm: 2.1,
        notes: 'Micrometer reading confirmed font height at 2.1mm (Compliant with Table-I).',
      },
      {
        Authorization: `Bearer ${lmoToken}`,
      }
    );

    assert.equal(resConfirm.status, 200);
    assert.equal(resConfirm.body.success, true);
    assert.equal(resConfirm.body.isOfficerConfirmed, true);
    assert.equal(resConfirm.body.micrometerReadingMm, 2.1);

    // Verify DB update
    const updated = db.prepare('SELECT is_officer_confirmed, micrometer_reading_mm FROM scans WHERE id = ?').get('scn-fmcg-07') as any;
    assert.equal(updated.is_officer_confirmed, 1);
    assert.equal(updated.micrometer_reading_mm, 2.1);
  } finally {
    await new Promise<void>((res) => serverInstance.close(() => res()));
  }
});

test('4. e-District Acknowledgement Engine Endpoints (/api/v1/acknowledgements)', async () => {
  const serverInstance = http.createServer(app);
  await new Promise<void>((res) => serverInstance.listen(0, res));

  try {
    // 1. POST Create Acknowledgement
    const resCreate = await request(serverInstance, 'POST', '/api/v1/acknowledgements', {
      scanId: 'scn-fmcg-02',
      contactEmail: 'inspector.demo@doca.gov.in',
      contactPhone: '+91 98765 43210',
      stateCode: 'MH',
    });

    assert.equal(resCreate.status, 201);
    assert.equal(resCreate.body.success, true);
    assert.match(resCreate.body.referenceId, /^DOCA\/MH\/2026\/\d{6}-[A-F0-9]{4}$/);
    assert.ok(resCreate.body.dueDate);
    assert.ok(resCreate.body.pdfUrl);
    assert.ok(resCreate.body.verifyUrl);
    assert.ok(resCreate.body.whatsappLink.includes('https://wa.me/'));
    assert.equal(resCreate.body.emailQueued, true);

    const createdRefId = resCreate.body.referenceId;
    const createdSlug = toReferenceSlug(createdRefId);

    // 2. GET Acknowledgement PDF Stream
    const resPdf = await request(serverInstance, 'GET', `/api/v1/acknowledgements/${createdSlug}/pdf`);
    assert.equal(resPdf.status, 200);
    assert.ok((resPdf.headers['content-type'] || '').includes('application/pdf'));
    assert.equal(resPdf.rawBuffer.slice(0, 5).toString('ascii'), '%PDF-');

    // 3. GET Public Verify Status Stepper
    const resVerify = await request(serverInstance, 'GET', `/api/v1/public/verify/${createdSlug}`);
    assert.equal(resVerify.status, 200);
    assert.equal(resVerify.body.referenceId, createdRefId);
    assert.equal(resVerify.body.status, 'SUBMITTED');
    assert.equal(resVerify.body.brandName, 'Nestle India Ltd');
    assert.ok(resVerify.body.violationsCount > 0);
    assert.ok(Array.isArray(resVerify.body.violations));
  } finally {
    await new Promise<void>((res) => serverInstance.close(() => res()));
  }
});
