import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type UserRole = 'LMO' | 'MSME' | 'CITIZEN' | 'ADMIN';

export interface TokenPayload {
  id: string;
  name: string;
  role: UserRole;
  badgeNumber?: string;
  state?: string;
  district?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware to verify JWT token from Authorization header (Bearer <token>).
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
    return;
  }
}

/**
 * Allows optional authentication. If valid Bearer token provided, uses it.
 * Otherwise auto-provisions a default LMO field session so field/citizen scans proceed smoothly.
 */
export function optionalAuthOrGuest(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      req.user = decoded;
      return next();
    } catch {
      // Fall through to default field session
    }
  }

  req.user = {
    id: 'usr-lmo-01',
    name: 'Inspector Rajesh Kumar',
    role: 'LMO',
    badgeNumber: 'LMO-DL-2026-44',
    state: 'Delhi',
    district: 'New Delhi',
  };
  next();
}

/**
 * Middleware factory for Role-Based Access Control (RBAC).
 * Enforces that authenticated user possesses one of the allowed roles.
 */
export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required before role verification',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role(s): [${roles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}
