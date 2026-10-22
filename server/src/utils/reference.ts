// ============================================================================
// PackParakh (पैक-परख) — e-District Reference Token Engine
// Ministry of Consumer Affairs, Food & Public Distribution | Legal Metrology PCR 2011
// Author: Gitansh (Backend Lead)
// ============================================================================

import crypto from 'crypto';

export interface ReferenceIdComponents {
  prefix: string;      // e.g. "DOCA"
  stateCode: string;   // e.g. "MH", "DL", "KA"
  year: string;        // e.g. "2026"
  sequence: string;    // e.g. "084291"
  hash4: string;       // e.g. "8F3A"
  formatted: string;   // e.g. "DOCA/MH/2026/084291-8F3A"
  slug: string;        // e.g. "DOCA-MH-2026-084291-8F3A"
}

/**
 * Generate a deterministic tamper-resistant e-District Reference ID.
 * Format: DOCA/<STATE>/<YEAR>/<6-DIGIT>-<HASH4>
 * Example: DOCA/MH/2026/084291-8F3A
 */
export function generateReferenceId(
  stateCode: string = 'DL',
  seedString?: string,
  year: number = 2026
): ReferenceIdComponents {
  const cleanState = (stateCode || 'DL').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2) || 'DL';
  const cleanYear = year.toString();

  // Generate sequence & hash4 from seed or crypto entropy
  const entropy = seedString || `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const sha = crypto.createHash('sha256').update(entropy).digest('hex');

  // 6 numeric digits derived from sha
  const numPart = parseInt(sha.slice(0, 8), 16) % 900000 + 100000;
  const sequence = numPart.toString();

  // 4 uppercase hex chars for tamper protection
  const hash4 = sha.slice(8, 12).toUpperCase();

  const formatted = `DOCA/${cleanState}/${cleanYear}/${sequence}-${hash4}`;
  const slug = `DOCA-${cleanState}-${cleanYear}-${sequence}-${hash4}`;

  return {
    prefix: 'DOCA',
    stateCode: cleanState,
    year: cleanYear,
    sequence,
    hash4,
    formatted,
    slug,
  };
}

/**
 * Normalize any reference ID string (handles both slash "DOCA/MH/2026/084291-8F3A" and dash "DOCA-MH-2026-084291-8F3A" formats)
 */
export function normalizeReferenceId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Standardize to slash format
  return trimmed.replace(/-/g, (match, offset) => {
    // Only replace first three dashes with slashes if it looks like DOCA-STATE-YEAR-SEQ-HASH
    const parts = trimmed.split('-');
    if (parts.length >= 5) {
      // DOCA-MH-2026-084291-8F3A
      return '/';
    }
    return match;
  }).replace(/^DOCA\/([A-Z]{2})\/(\d{4})\/(\d{6})\/([A-Z0-9]{4})$/, 'DOCA/$1/$2/$3-$4');
}

/**
 * Convert formatted reference ID (DOCA/MH/2026/084291-8F3A) to URL-safe slug (DOCA-MH-2026-084291-8F3A)
 */
export function toReferenceSlug(referenceId: string): string {
  return referenceId.replace(/\//g, '-');
}

/**
 * Convert URL-safe slug (DOCA-MH-2026-084291-8F3A) back to official formatted reference ID (DOCA/MH/2026/084291-8F3A)
 */
export function fromReferenceSlug(slug: string): string {
  const parts = slug.split('-');
  if (parts.length === 5) {
    return `${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}-${parts[4]}`;
  }
  return slug.replace(/\//g, '/');
}

/**
 * Calculate statutory due date for enforcement or citizen resolution:
 * - LMO / Field Officer inspections: +7 calendar days
 * - Citizen grievance submissions: +14 calendar days
 */
export function calculateStatutoryDueDate(
  userRole: 'LMO' | 'MSME' | 'CITIZEN' | 'ADMIN' | string = 'LMO',
  filedAt: Date = new Date()
): Date {
  const daysToAdd = userRole === 'CITIZEN' ? 14 : 7;
  const dueDate = new Date(filedAt.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return dueDate;
}

/**
 * Generate official pre-formatted WhatsApp deep link for 100% free, zero-API instant dispatch.
 * Works seamlessly across desktop & mobile browsers.
 */
export function generateWhatsAppDeepLink(
  referenceId: string,
  verifyUrl: string,
  contactPhone?: string,
  brandName?: string,
  violationsCount: number = 0
): string {
  const phoneParam = contactPhone ? contactPhone.replace(/[^0-9]/g, '') : '';
  const messageText = [
    `🏛️ *PackParakh (पैक-परख) — Legal Metrology Grievance Dossier*`,
    `📋 *Reference ID:* ${referenceId}`,
    brandName ? `🏭 *Brand:* ${brandName}` : '',
    violationsCount > 0 ? `⚖️ *Violations Flagged:* ${violationsCount} statutory breaches` : '',
    `🗓️ *Notice:* Please produce the original package at the nearest Legal Metrology Office within 7 days.`,
    `🔗 *Verify Live Status:* ${verifyUrl}`,
  ].filter(Boolean).join('\n');

  const encodedMessage = encodeURIComponent(messageText);
  if (phoneParam && phoneParam.length >= 10) {
    const finalPhone = phoneParam.startsWith('91') ? phoneParam : `91${phoneParam.slice(-10)}`;
    return `https://wa.me/${finalPhone}?text=${encodedMessage}`;
  }
  return `https://wa.me/?text=${encodedMessage}`;
}

export default {
  generateReferenceId,
  normalizeReferenceId,
  toReferenceSlug,
  fromReferenceSlug,
  calculateStatutoryDueDate,
  generateWhatsAppDeepLink,
};
