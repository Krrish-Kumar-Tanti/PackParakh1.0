// ============================================================================
// PackParakh (पैक-परख) — Scan Routes
// Ministry of Consumer Affairs, Food & Public Distribution | Legal Metrology PCR 2011
// ============================================================================

import { Router } from 'express';
import { auditPhysicalScan, auditEcomListing, confirmPhysicalScan } from '../controllers/scanController';
import { uploadPackagingImage } from '../middleware/uploadMiddleware';
import { optionalAuthOrGuest, requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

/**
 * POST /api/scan/physical
 * Ingests a packaging photo (multipart field "image") plus calibration metadata,
 * converts pixels -> millimetres (Rule 7 Table-I), runs deterministic statutory
 * rules with category exemptions, and persists an evidence-hashed report.
 * Accepts field officer AND citizen scans (guest JWT auto-provisioned).
 */
router.post(
  '/physical',
  uploadPackagingImage,
  optionalAuthOrGuest,
  auditPhysicalScan
);

/**
 * POST /api/scan/ecom
 * Ingests an E-Commerce URL (Amazon, Blinkit, Zepto, Flipkart),
 * parses declarations via Cheerio with instant offline fallback fixtures,
 * checks Rule 6(10) COO Filter & GSR 418(E) warehouse mandates,
 * and saves statutory verification report to SQLite.
 */
router.post('/ecom', auditEcomListing);

/**
 * POST /api/scan/:id/confirm
 * Officer-in-the-loop (HITL) micrometer gate — LMO role only.
 * Records micrometer reading, unlocks court-ready status, and writes an
 * immutable Section 63 BSA 2023 audit-trail entry.
 */
router.post('/:id/confirm', requireAuth, requireRole('LMO'), confirmPhysicalScan);

export default router;
