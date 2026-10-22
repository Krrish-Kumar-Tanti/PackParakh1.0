import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getDb } from '../database/db';
import { AuthenticatedRequest, TokenPayload, UserRole } from '../middleware/authMiddleware';

interface LoginRequestBody {
  role: UserRole;
  identifier: string;
  password?: string;
}

interface UserRow {
  id: string;
  name: string;
  role: UserRole;
  badge_number: string | null;
  state: string | null;
  district: string | null;
  created_at: string;
}

/**
 * POST /api/auth/login
 * Role-Based Authentication Gateway for PackParakh:
 * - LMO (Legal Metrology Officer)
 * - MSME (Brand / Packaging Manufacturer)
 * - CITIZEN (Public User / 1-Tap Guest)
 * - ADMIN (DoCA Directorate HQ)
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { role, identifier, password } = req.body as LoginRequestBody;

    if (!role || !identifier) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Both "role" and "identifier" are required fields.',
      });
      return;
    }

    const validRoles: UserRole[] = ['LMO', 'MSME', 'CITIZEN', 'ADMIN'];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        error: 'Bad Request',
        message: `Invalid role: "${role}". Must be one of: ${validRoles.join(', ')}`,
      });
      return;
    }

    const db = getDb();
    const cleanIdentifier = identifier.trim();

    // 1. Search for existing user in database by id or badge_number
    let user = db
      .prepare(
        'SELECT id, name, role, badge_number, state, district, created_at FROM users WHERE (id = ? OR badge_number = ?) AND role = ?'
      )
      .get(cleanIdentifier, cleanIdentifier, role) as UserRow | undefined;

    // If not found by exact ID/badge, check if any user matches the role
    if (!user) {
      user = db
        .prepare('SELECT id, name, role, badge_number, state, district, created_at FROM users WHERE role = ?')
        .get(role) as UserRow | undefined;
    }

    // 2. If user still does not exist (e.g. before initial seeding or custom demo login), dynamically provision profile
    if (!user) {
      let defaultId = '';
      let defaultName = '';
      let defaultBadge = cleanIdentifier;
      let defaultState = 'Delhi';
      let defaultDistrict = 'New Delhi';

      switch (role) {
        case 'LMO':
          defaultId = `usr-lmo-${Date.now().toString(36)}`;
          defaultName = `Officer ${cleanIdentifier}`;
          defaultBadge = cleanIdentifier.startsWith('LMO') ? cleanIdentifier : `LMO-DL-${cleanIdentifier}`;
          defaultState = 'Delhi';
          defaultDistrict = 'New Delhi';
          break;
        case 'MSME':
          defaultId = `usr-msme-${Date.now().toString(36)}`;
          defaultName = `MSME Packaging Unit (${cleanIdentifier})`;
          defaultBadge = cleanIdentifier;
          defaultState = 'Maharashtra';
          defaultDistrict = 'Mumbai';
          break;
        case 'CITIZEN':
          defaultId = `usr-cit-${Date.now().toString(36)}`;
          defaultName = cleanIdentifier.toLowerCase() === 'citizen' ? 'Citizen Inspector (Public)' : `Citizen ${cleanIdentifier}`;
          defaultBadge = 'PUBLIC-GUEST';
          defaultState = 'Karnataka';
          defaultDistrict = 'Bengaluru';
          break;
        case 'ADMIN':
          defaultId = `usr-adm-${Date.now().toString(36)}`;
          defaultName = 'DoCA National Director';
          defaultBadge = cleanIdentifier.startsWith('DOCA') ? cleanIdentifier : 'DOCA-HQ-01';
          defaultState = 'Delhi';
          defaultDistrict = 'Central Delhi';
          break;
      }

      db.prepare(
        `INSERT INTO users (id, name, role, badge_number, state, district)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(defaultId, defaultName, role, defaultBadge, defaultState, defaultDistrict);

      user = {
        id: defaultId,
        name: defaultName,
        role,
        badge_number: defaultBadge,
        state: defaultState,
        district: defaultDistrict,
        created_at: new Date().toISOString(),
      };
    }

    // 3. Generate JWT Token
    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
      badgeNumber: user.badge_number || undefined,
      state: user.state || undefined,
      district: user.district || undefined,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 4. Return response strictly matching Frontend_Lead.md & Backend_Lead.md contract
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        badgeNumber: user.badge_number || undefined,
        state: user.state || undefined,
        district: user.district || undefined,
      },
    });
  } catch (err) {
    console.error('[AuthController.login] Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Authentication failed',
    });
  }
}

/**
 * GET /api/auth/me
 * Returns currently authenticated user details from verified JWT.
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No active authentication session found',
      });
      return;
    }

    const db = getDb();
    const user = db
      .prepare('SELECT id, name, role, badge_number, state, district, created_at FROM users WHERE id = ?')
      .get(req.user.id) as UserRow | undefined;

    res.status(200).json({
      user: {
        id: req.user.id,
        name: user ? user.name : req.user.name,
        role: req.user.role,
        badgeNumber: user ? user.badge_number : req.user.badgeNumber,
        state: user ? user.state : req.user.state,
        district: user ? user.district : req.user.district,
      },
    });
  } catch (err) {
    console.error('[AuthController.getMe] Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Failed to retrieve user profile',
    });
  }
}
