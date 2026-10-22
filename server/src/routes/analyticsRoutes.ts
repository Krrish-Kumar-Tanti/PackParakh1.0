// ============================================================================
// PackParakh (पैक-परख) — DoCA National Analytics Routes
// Ministry of Consumer Affairs, Food & Public Distribution | Legal Metrology PCR 2011
// Author: Gitansh (Backend Lead)
// ============================================================================

import { Router } from 'express';
import {
  getAnalyticsSummary,
  getBrandLedger,
  getDistrictHeatmap,
} from '../controllers/analyticsController';

const router = Router();

// Summary KPIs (totalScans, passRate, failRate, hoursSaved, noticesDrafted)
router.get('/summary', getAnalyticsSummary);

// FMCG Repeat Offender Ledger with Section 36(2) penalties and Director Accountability
router.get('/brand-ledger', getBrandLedger);

// District & State Heatmap violation aggregations for Recharts
router.get('/district-heatmap', getDistrictHeatmap);

export default router;
