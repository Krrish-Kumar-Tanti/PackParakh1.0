// ============================================================================
// PackParakh (पैक-परख) — System & Rules Routes
// POST /api/rules/simulate — Pre-market packaging font/declaration simulator
// ============================================================================

import { Router } from 'express';
import { getSystemStatus, simulatePackagingRules } from '../controllers/systemController';

const router = Router();

/**
 * GET /api/system/status
 * GovTech operational banner telemetry powering the top status bar:
 * PCR-2011 engine version, active rules, SQLite WAL connectivity, scan volume.
 */
router.get('/status', getSystemStatus);

/**
 * POST /api/rules/simulate
 * Deterministic (no AI) pre-market simulator for MSME packagers:
 * returns the minimum Rule 7 Table-I font height in mm and the full
 * mandatory-declaration checklist for a given pack size / PDP area.
 */
router.post('/simulate', simulatePackagingRules);

export default router;