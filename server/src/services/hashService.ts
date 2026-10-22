// ============================================================================
// PackParakh (पैक-परख) — Cryptographic Evidence Vault Service
// Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) / Sec 65B Evidence Act
// Ministry of Consumer Affairs, Food & Public Distribution | Legal Metrology PCR 2011
// ============================================================================

import crypto from 'crypto';
import { ScanSource } from '../config/constants';

export interface EvidencePayload {
  scanId: string;
  officerBadgeNo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isoTimestamp: string;
  productName?: string;
  source: ScanSource | 'LIVE_CAMERA' | 'DEMO_CACHED' | 'SAMPLE_SEED' | string;
  imageSha256?: string;
  violationsList?: Array<{ ruleNumber: string; penaltySection: string }>;
  overallScore?: number;
  [key: string]: any;
}

/**
 * Generate a deterministic canonical SHA-256 evidence hash conforming to
 * Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) [formerly Sec 65B Evidence Act].
 * Keys are alphabetically sorted to guarantee invariant digital signature integrity.
 */
export function generateEvidenceHash(payload: EvidencePayload | Record<string, any>): string {
  const canonicalString = JSON.stringify(payload, Object.keys(payload).sort());

  return crypto
    .createHash('sha256')
    .update(canonicalString)
    .digest('hex');
}

/**
 * Generate generic deterministic SHA-256 hash for raw strings or buffers
 */
export function generateSha256(content: string | Buffer): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Computes raw SHA-256 hash of an image or PDF buffer.
 */
export function computeBufferSha256(buffer: Buffer): string {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex');
}

export default {
  generateEvidenceHash,
  generateSha256,
  computeBufferSha256,
};
