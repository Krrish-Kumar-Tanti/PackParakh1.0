// ============================================================================
// PackParakh (पैक-परख) — Report & Form-V PDF Routes
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Author: Gitansh (Backend Lead)
// ============================================================================

import { Router } from 'express';
import {
  getScanReport,
  getReportPdf,
  verifyReportByHash,
  confirmScanVerdict,
} from '../controllers/reportController';

const router = Router();

// Public Judicial Verification Endpoint under Section 63 BSA 2023
router.get('/verify/:hash', verifyReportByHash);

// PDF generation routes (accepts GET and POST with live scan payload)
router.get('/:scanId/pdf', getReportPdf);
router.post('/:scanId/pdf', getReportPdf);
router.get('/:id/pdf', getReportPdf);
router.post('/:id/pdf', getReportPdf);
router.post('/pdf', getReportPdf);

// Report JSON retrieval
router.get('/:scanId', getScanReport);
router.get('/:id', getScanReport);

// Officer HITL confirmation route
router.post('/:id/confirm', confirmScanVerdict);

export default router;
