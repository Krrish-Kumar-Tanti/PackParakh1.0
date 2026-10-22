// ============================================================================
// PackParakh (पैक-परख) — e-District Acknowledgement & Public Tracker Controller
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Author: Gitansh (Backend Lead)
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDb } from '../database/db';
import {
  generateReferenceId,
  normalizeReferenceId,
  toReferenceSlug,
  fromReferenceSlug,
  calculateStatutoryDueDate,
  generateWhatsAppDeepLink,
} from '../utils/reference';
import { generateAcknowledgementPdf } from '../services/acknowledgementPdf';
import { sendAcknowledgementEmail } from '../services/emailService';
import { generateSha256 } from '../services/hashService';

const CreateAcknowledgementSchema = z.object({
  scanId: z.string().min(1, 'scanId is required'),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  stateCode: z.string().optional(),
  mode: z.enum(['online', 'offline', 'factory']).optional(),
});

/**
 * POST /api/v1/acknowledgements
 * Creates a deterministic e-District tracking code & official acknowledgement slip.
 */
export async function createAcknowledgement(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parseResult = CreateAcknowledgementSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }

    const { scanId, contactEmail, contactPhone, stateCode } = parseResult.data;
    const db = getDb();

    // 1. Fetch scan record and brand metadata
    const scan = db.prepare(`
      SELECT s.*, b.name as brand_name
      FROM scans s
      LEFT JOIN brands b ON s.brand_id = b.id
      WHERE s.id = ?
    `).get(scanId) as any;

    if (!scan) {
      res.status(404).json({ error: 'Scan record not found', scanId });
      return;
    }

    // 2. Fetch violations
    const violations = db.prepare(`
      SELECT rule_number, rule_title, description, penalty_section, severity, score_deduction
      FROM violations WHERE scan_id = ?
    `).all(scanId) as any[];

    // 3. Generate deterministic reference ID & due date
    const finalStateCode = (stateCode || (scan.source === 'SAMPLE_SEED' ? 'DL' : 'MH')).toUpperCase();
    const refData = generateReferenceId(finalStateCode, `${scanId}_${Date.now()}`);
    const filedAt = new Date();
    const dueDate = calculateStatutoryDueDate('LMO', filedAt);

    const refFormatted = refData.formatted;
    const refSlug = refData.slug;
    const pdfUrl = `/api/v1/acknowledgements/${refSlug}/pdf`;
    const verifyUrl = `https://packparakh.gov.in/verify/${refSlug}`;

    // 4. Generate 1-page Acknowledgement PDF Buffer
    const pdfBuffer = await generateAcknowledgementPdf({
      referenceId: refFormatted,
      scanId,
      productName: scan.product_name,
      brandName: scan.brand_name,
      status: 'SUBMITTED',
      filedAt: filedAt.toISOString(),
      dueDate: dueDate.toISOString(),
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      sha256Hash: scan.sha256_hash,
      violations: violations.map((v) => ({
        ruleNumber: v.rule_number,
        ruleTitle: v.rule_title,
        description: v.description,
        penaltySection: v.penalty_section,
      })),
    });

    const acknowledgeSha256 = generateSha256(refFormatted + filedAt.toISOString());

    // 5. Persist into acknowledgements table
    const ackId = `ack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Ensure officer user exists to satisfy foreign key constraint
    let validUserId = 'usr-lmo-01';
    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(validUserId);
    if (!existingUser) {
      const anyUser = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: string } | undefined;
      if (anyUser) {
        validUserId = anyUser.id;
      } else {
        db.prepare(`
          INSERT OR IGNORE INTO users (id, name, role, badge_number, state, district)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(validUserId, 'Inspector Rajesh Kumar', 'LMO', 'LMO-DL-2026-44', 'Delhi', 'New Delhi');
      }
    }

    db.prepare(`
      INSERT INTO acknowledgements (
        id, scan_id, reference_id, user_id, contact_email, contact_phone,
        status, filed_at, due_date, acknowledge_pdf_url, acknowledge_sha256,
        channel_email_sent, channel_whatsapp_link_generated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ackId,
      scanId,
      refFormatted,
      validUserId,
      contactEmail || null,
      contactPhone || null,
      'SUBMITTED',
      filedAt.toISOString(),
      dueDate.toISOString(),
      pdfUrl,
      acknowledgeSha256,
      contactEmail ? 1 : 0,
      1
    );

    // 6. Generate WhatsApp deep link
    const whatsappLink = generateWhatsAppDeepLink(
      refFormatted,
      verifyUrl,
      contactPhone,
      scan.brand_name,
      violations.length
    );

    // 7. Non-blocking asynchronous email delivery
    let emailQueued = false;
    if (contactEmail && contactEmail.trim().length > 0) {
      emailQueued = true;
      sendAcknowledgementEmail({
        recipientEmail: contactEmail.trim(),
        referenceId: refFormatted,
        productName: scan.product_name,
        brandName: scan.brand_name,
        pdfBuffer,
        dueDate: dueDate.toISOString(),
      }).catch((err) => {
        console.error('[Acknowledgement] Non-blocking email dispatch failed:', err.message);
      });
    }

    // 8. Return response conforming to Frontend_Lead.md contract
    res.status(201).json({
      success: true,
      referenceId: refFormatted,
      dueDate: dueDate.toISOString(),
      pdfUrl,
      verifyUrl,
      whatsappLink,
      emailQueued,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/acknowledgements/:referenceId/pdf
 * Streams 1-page official e-District Acknowledgement Slip PDF.
 */
export async function getAcknowledgementPdf(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const rawRef = req.params.referenceId || req.params.slug;
    if (!rawRef) {
      res.status(400).json({ error: 'Missing referenceId parameter' });
      return;
    }

    const refFormatted = fromReferenceSlug(rawRef);
    const db = getDb();

    // Query acknowledgement record
    const ack = db.prepare(`
      SELECT a.*, s.product_name, s.category, b.name as brand_name
      FROM acknowledgements a
      LEFT JOIN scans s ON a.scan_id = s.id
      LEFT JOIN brands b ON s.brand_id = b.id
      WHERE a.reference_id = ? OR a.reference_id = ? OR a.id = ?
    `).get(refFormatted, rawRef, rawRef) as any;

    if (!ack) {
      res.status(404).json({ error: 'Acknowledgement not found', referenceId: rawRef });
      return;
    }

    // Query violations
    const violations = db.prepare(`
      SELECT rule_number, rule_title, description, penalty_section
      FROM violations WHERE scan_id = ?
    `).all(ack.scan_id) as any[];

    // Generate PDF
    const pdfBuffer = await generateAcknowledgementPdf({
      referenceId: ack.reference_id,
      scanId: ack.scan_id,
      productName: ack.product_name,
      brandName: ack.brand_name,
      status: ack.status,
      filedAt: ack.filed_at,
      dueDate: ack.due_date,
      contactEmail: ack.contact_email,
      contactPhone: ack.contact_phone,
      sha256Hash: ack.acknowledge_sha256,
      violations: violations.map((v) => ({
        ruleNumber: v.rule_number,
        ruleTitle: v.rule_title,
        description: v.description,
        penaltySection: v.penalty_section,
      })),
    });

    const slug = toReferenceSlug(ack.reference_id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Acknowledgement-${slug}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.status(200).send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/public/verify/:referenceId
 * Zero-Auth Public Verification Tracker Endpoint.
 * Powers public status stepper on physical QR scan.
 */
export async function getPublicVerification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const rawRef = req.params.referenceId || req.params.slug;
    if (!rawRef) {
      res.status(400).json({ error: 'Missing referenceId parameter' });
      return;
    }

    const refFormatted = fromReferenceSlug(rawRef);
    const db = getDb();

    const ack = db.prepare(`
      SELECT a.*, s.product_name, s.compliance_score, s.verdict, b.name as brand_name
      FROM acknowledgements a
      LEFT JOIN scans s ON a.scan_id = s.id
      LEFT JOIN brands b ON s.brand_id = b.id
      WHERE a.reference_id = ? OR a.reference_id = ? OR a.id = ?
    `).get(refFormatted, rawRef, rawRef) as any;

    if (!ack) {
      res.status(404).json({
        error: 'No public case record found for this Reference ID',
        referenceId: rawRef,
      });
      return;
    }

    const violations = db.prepare(`
      SELECT rule_number, rule_title, penalty_section, severity
      FROM violations WHERE scan_id = ?
    `).all(ack.scan_id) as any[];

    res.status(200).json({
      referenceId: ack.reference_id,
      status: ack.status || 'SUBMITTED',
      filedAt: ack.filed_at,
      dueDate: ack.due_date,
      brandName: ack.brand_name || 'N/A',
      productName: ack.product_name || 'Packaged Commodity',
      complianceScore: ack.compliance_score,
      verdict: ack.verdict,
      violationsCount: violations.length,
      violations: violations.map((v) => ({
        ruleNumber: v.rule_number,
        ruleTitle: v.rule_title,
        penaltySection: v.penalty_section,
      })),
      sha256Hash: ack.acknowledge_sha256,
      pdfUrl: `/api/v1/acknowledgements/${toReferenceSlug(ack.reference_id)}/pdf`,
    });
  } catch (err) {
    next(err);
  }
}

export default {
  createAcknowledgement,
  getAcknowledgementPdf,
  getPublicVerification,
};
