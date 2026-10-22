import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate and issue JWT for LMO, MSME, CITIZEN, or ADMIN
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get profile for currently authenticated user
 * @access  Private (JWT Bearer Token required)
 */
router.get('/me', requireAuth, getMe);

export default router;
