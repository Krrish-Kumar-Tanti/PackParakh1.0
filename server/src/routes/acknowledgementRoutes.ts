// ============================================================================
// PackParakh (पैक-परख) — e-District Acknowledgement Routes
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Author: Gitansh (Backend Lead)
// ============================================================================

import { Router } from 'express';
import {
  createAcknowledgement,
  getAcknowledgementPdf,
  getPublicVerification,
} from '../controllers/acknowledgementController';

const router = Router();

// Acknowledgement creation & retrieval
router.post('/acknowledgements', createAcknowledgement);
router.get('/acknowledgements/:referenceId/pdf', getAcknowledgementPdf);

// Public Zero-Auth Verification Stepper Route
router.get('/public/verify/:referenceId', getPublicVerification);

export default router;
