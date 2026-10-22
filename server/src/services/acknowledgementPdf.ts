// ============================================================================
// PackParakh (पैक-परख) — 1-Page e-District Acknowledgement Slip PDF Generator
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Author: Gitansh (Backend Lead)
// ============================================================================

import { PDFDocument, rgb, StandardFonts, PDFFont, Color } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateSha256 } from './hashService';
import { toReferenceSlug } from '../utils/reference';

export interface AcknowledgementPdfData {
  referenceId: string;
  scanId: string;
  productName?: string;
  brandName?: string;
  status?: string;
  filedAt?: string;
  dueDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  sha256Hash?: string;
  violations?: Array<{
    ruleNumber: string;
    ruleTitle?: string;
    description: string;
    penaltySection?: string;
  }>;
}

/**
 * Sanitize text to ensure compatibility with StandardFonts (WinAnsi encoding in pdf-lib).
 */
function cleanText(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/₹/g, 'Rs. ')
    .replace(/—/g, ' - ')
    .replace(/–/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E\r\n\t]/g, ' ')
    .trim();
}

/**
 * Generate 1-Page Official e-District Acknowledgement Slip PDF.
 */
export async function generateAcknowledgementPdf(data: AcknowledgementPdfData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 (Points)
  const { width, height } = page.getSize();

  // Load Standard Vector Typefaces
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  // Helper to draw text with automatic WinAnsi sanitation
  const drawSafeText = (
    text: string | number | null | undefined,
    options: {
      x: number;
      y: number;
      size: number;
      font: PDFFont;
      color?: Color;
      rotate?: any;
      opacity?: number;
    }
  ) => {
    const cleaned = cleanText(text);
    if (!cleaned) return;
    page.drawText(cleaned, options);
  };

  // Helper to calculate text width safely
  const getSafeWidth = (text: string | number | null | undefined, font: PDFFont, size: number): number => {
    const cleaned = cleanText(text);
    return font.widthOfTextAtSize(cleaned, size);
  };

  // Sovereign Nyaya Navy & Verdict Gold Palette
  const colorNavy = rgb(0.043, 0.071, 0.125);      // #0B1220
  const colorDarkSlate = rgb(0.071, 0.110, 0.184); // #121C2F
  const colorGold = rgb(0.855, 0.655, 0.055);       // #DAB10E
  const colorLightBg = rgb(0.965, 0.973, 0.984);
  const colorCardBg = rgb(0.93, 0.95, 0.97);
  const colorBorder = rgb(0.82, 0.85, 0.90);
  const colorRed = rgb(0.86, 0.15, 0.15);
  const colorGreen = rgb(0.08, 0.65, 0.32);
  const colorAmber = rgb(0.85, 0.55, 0.05);
  const colorTextDark = rgb(0.1, 0.14, 0.2);
  const colorTextMuted = rgb(0.4, 0.45, 0.55);

  const filedDate = data.filedAt ? new Date(data.filedAt) : new Date();
  const dueDate = data.dueDate ? new Date(data.dueDate) : new Date(filedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formatIST = (d: Date) =>
    d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';

  const sha256 = data.sha256Hash || generateSha256(data.referenceId + filedDate.toISOString());
  const refSlug = toReferenceSlug(data.referenceId);
  const verifyUrl = `https://packparakh.gov.in/verify/${refSlug}`;

  let currentY = height - 32;

  // --------------------------------------------------------------------------
  // 1. Top Decorative Sovereign Stripes
  // --------------------------------------------------------------------------
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width: width,
    height: 8,
    color: colorNavy,
  });
  page.drawRectangle({
    x: 0,
    y: height - 11,
    width: width,
    height: 3,
    color: colorGold,
  });

  // --------------------------------------------------------------------------
  // 2. Header
  // --------------------------------------------------------------------------
  drawSafeText('GOVERNMENT OF INDIA', {
    x: width / 2 - getSafeWidth('GOVERNMENT OF INDIA', fontBold, 13) / 2,
    y: currentY,
    size: 13,
    font: fontBold,
    color: colorNavy,
  });

  currentY -= 14;
  const minTitle = 'MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION';
  drawSafeText(minTitle, {
    x: width / 2 - getSafeWidth(minTitle, fontBold, 9.5) / 2,
    y: currentY,
    size: 9.5,
    font: fontBold,
    color: colorDarkSlate,
  });

  currentY -= 12;
  const deptTitle = 'DEPARTMENT OF CONSUMER AFFAIRS (DOCA) - e-DISTRICT ENFORCEMENT CELL';
  drawSafeText(deptTitle, {
    x: width / 2 - getSafeWidth(deptTitle, fontRegular, 8) / 2,
    y: currentY,
    size: 8,
    font: fontRegular,
    color: colorTextMuted,
  });

  currentY -= 20;
  // Banner
  page.drawRectangle({
    x: 36,
    y: currentY - 6,
    width: width - 72,
    height: 24,
    color: colorNavy,
    borderColor: colorGold,
    borderWidth: 1,
  });

  const bannerText = 'OFFICIAL STATUTORY GRIEVANCE & INSPECTION ACKNOWLEDGEMENT SLIP';
  drawSafeText(bannerText, {
    x: width / 2 - getSafeWidth(bannerText, fontBold, 9.5) / 2,
    y: currentY + 1,
    size: 9.5,
    font: fontBold,
    color: colorGold,
  });

  currentY -= 18;
  const subText = '[Digital Public Service Delivery under Legal Metrology Act, 2009 & e-District Mandate]';
  drawSafeText(subText, {
    x: width / 2 - getSafeWidth(subText, fontOblique, 7) / 2,
    y: currentY,
    size: 7,
    font: fontOblique,
    color: colorTextMuted,
  });

  // --------------------------------------------------------------------------
  // 3. Prominent Reference ID Token Box
  // --------------------------------------------------------------------------
  currentY -= 16;
  const refBoxHeight = 44;
  const refBoxY = currentY - refBoxHeight;

  page.drawRectangle({
    x: 36,
    y: refBoxY,
    width: width - 72,
    height: refBoxHeight,
    color: colorCardBg,
    borderColor: colorGold,
    borderWidth: 1.5,
  });

  drawSafeText('OFFICIAL REFERENCE TRACKING TOKEN', {
    x: width / 2 - getSafeWidth('OFFICIAL REFERENCE TRACKING TOKEN', fontBold, 7.5) / 2,
    y: refBoxY + refBoxHeight - 12,
    size: 7.5,
    font: fontBold,
    color: colorTextMuted,
  });

  drawSafeText(data.referenceId, {
    x: width / 2 - getSafeWidth(data.referenceId, fontMono, 16) / 2,
    y: refBoxY + 10,
    size: 16,
    font: fontMono,
    color: colorNavy,
  });

  // --------------------------------------------------------------------------
  // 4. Statutory Notice & 7-Day Timeline Alert Box
  // --------------------------------------------------------------------------
  currentY = refBoxY - 14;
  const alertBoxHeight = 44;
  const alertBoxY = currentY - alertBoxHeight;

  page.drawRectangle({
    x: 36,
    y: alertBoxY,
    width: width - 72,
    height: alertBoxHeight,
    color: rgb(0.99, 0.96, 0.93),
    borderColor: colorAmber,
    borderWidth: 1,
  });

  drawSafeText('STATUTORY DIRECTIVE & EVIDENCE SUBMISSION TIMELINE:', {
    x: 46,
    y: alertBoxY + alertBoxHeight - 12,
    size: 7.5,
    font: fontBold,
    color: colorAmber,
  });

  const directiveText =
    'Please present this Acknowledgement Slip along with the original packaged commodity at your nearest District Legal Metrology Office or Sub-Divisional Magistrate (SDM) Directorate within 7 calendar days of issuance.';
  drawSafeText(directiveText, {
    x: 46,
    y: alertBoxY + 12,
    size: 7,
    font: fontRegular,
    color: colorTextDark,
  });

  // --------------------------------------------------------------------------
  // 5. Case Details & Inspection Metadata Panel
  // --------------------------------------------------------------------------
  currentY = alertBoxY - 14;
  const detailsBoxHeight = 84;
  const detailsBoxY = currentY - detailsBoxHeight;

  page.drawRectangle({
    x: 36,
    y: detailsBoxY,
    width: width - 72,
    height: detailsBoxHeight,
    color: colorLightBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  // Section Bar
  page.drawRectangle({
    x: 36,
    y: detailsBoxY + detailsBoxHeight - 16,
    width: width - 72,
    height: 16,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });
  drawSafeText('GRIEVANCE DOSSIER & COMMODITY SUMMARY', {
    x: 44,
    y: detailsBoxY + detailsBoxHeight - 12,
    size: 8,
    font: fontBold,
    color: colorNavy,
  });

  let lineY = detailsBoxY + detailsBoxHeight - 28;

  // Row 1
  drawSafeText('Filed On:', { x: 46, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(formatIST(filedDate), { x: 110, y: lineY, size: 8, font: fontRegular, color: colorTextDark });

  drawSafeText('Statutory Due Date:', { x: 310, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(formatIST(dueDate), { x: 410, y: lineY, size: 8, font: fontBold, color: colorRed });

  // Row 2
  lineY -= 14;
  drawSafeText('Product Name:', { x: 46, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(data.productName || 'N/A', { x: 110, y: lineY, size: 8, font: fontRegular, color: colorTextDark });

  drawSafeText('Brand Name:', { x: 310, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(data.brandName || 'N/A', { x: 375, y: lineY, size: 8, font: fontBold, color: colorNavy });

  // Row 3
  lineY -= 14;
  drawSafeText('Current Status:', { x: 46, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  const statusStr = data.status || 'SUBMITTED';
  drawSafeText(statusStr, { x: 110, y: lineY, size: 8, font: fontBold, color: colorGreen });

  drawSafeText('Scan ID:', { x: 310, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(data.scanId, { x: 360, y: lineY, size: 8, font: fontRegular, color: colorTextDark });

  // Row 4
  lineY -= 14;
  drawSafeText('Contact Email:', { x: 46, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(data.contactEmail || 'N/A (Citizen Walk-in)', { x: 110, y: lineY, size: 8, font: fontRegular, color: colorTextDark });

  drawSafeText('Contact Phone:', { x: 310, y: lineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(data.contactPhone || 'N/A', { x: 380, y: lineY, size: 8, font: fontRegular, color: colorTextDark });

  // --------------------------------------------------------------------------
  // 6. Itemized Violations Table
  // --------------------------------------------------------------------------
  currentY = detailsBoxY - 14;
  drawSafeText('VERIFIED STATUTORY INFRACTIONS FLAGGED', {
    x: 36,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: colorNavy,
  });

  currentY -= 8;
  const tableX = 36;
  const tableWidth = width - 72;
  const headerHeight = 16;
  const rowHeight = 22;

  // Columns: Rule (90), Description (270), Penalty (158)
  const colW = [90, 275, 153];

  page.drawRectangle({
    x: tableX,
    y: currentY - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: colorDarkSlate,
  });

  let offset = tableX;
  const tHeaders = ['Statutory Rule', 'Infraction Detail', 'Applicable Law / Penalty'];
  for (let i = 0; i < tHeaders.length; i++) {
    drawSafeText(tHeaders[i], {
      x: offset + 4,
      y: currentY - headerHeight + 4.5,
      size: 7.5,
      font: fontBold,
      color: colorGold,
    });
    offset += colW[i];
  }

  currentY -= headerHeight;

  const violations = data.violations && data.violations.length > 0 ? data.violations : [];

  if (violations.length === 0) {
    page.drawRectangle({
      x: tableX,
      y: currentY - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: rgb(1, 1, 1),
      borderColor: colorBorder,
      borderWidth: 1,
    });
    drawSafeText('General consumer verification submission - Pending inspection by Legal Metrology Officer.', {
      x: tableX + 6,
      y: currentY - rowHeight + 7,
      size: 7.5,
      font: fontRegular,
      color: colorTextDark,
    });
    currentY -= rowHeight;
  } else {
    const list = violations.slice(0, 4);
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      const rY = currentY - rowHeight;

      page.drawRectangle({
        x: tableX,
        y: rY,
        width: tableWidth,
        height: rowHeight,
        color: i % 2 === 0 ? rgb(1, 1, 1) : colorLightBg,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      let cX = tableX;
      // Rule
      drawSafeText(v.ruleNumber || 'Rule 6', {
        x: cX + 4,
        y: rY + 7,
        size: 7.5,
        font: fontBold,
        color: colorNavy,
      });
      cX += colW[0];

      // Description
      const desc = (v.description || v.ruleTitle || '').slice(0, 58);
      drawSafeText(desc, {
        x: cX + 4,
        y: rY + 7,
        size: 7,
        font: fontRegular,
        color: colorTextDark,
      });
      cX += colW[1];

      // Penalty
      drawSafeText(v.penaltySection || 'Sec 36(1) LM Act', {
        x: cX + 4,
        y: rY + 7,
        size: 7,
        font: fontRegular,
        color: colorRed,
      });

      currentY -= rowHeight;
    }
  }

  // --------------------------------------------------------------------------
  // 7. QR Code & Public Status Verification Box
  // --------------------------------------------------------------------------
  const footerBoxHeight = 90;
  const footerBoxY = 60;

  page.drawRectangle({
    x: 36,
    y: footerBoxY,
    width: width - 72,
    height: footerBoxHeight,
    color: colorLightBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  const qrPngBuffer = await QRCode.toBuffer(verifyUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 80,
  });
  const qrImage = await pdfDoc.embedPng(qrPngBuffer);

  const qrSize = 72;
  const qrX = width - 36 - qrSize - 10;
  const qrY = footerBoxY + (footerBoxHeight - qrSize) / 2;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  const leftX = 46;
  let textY = footerBoxY + footerBoxHeight - 16;

  drawSafeText('PUBLIC e-DISTRICT VERIFICATION & TRACKING', {
    x: leftX,
    y: textY,
    size: 8,
    font: fontBold,
    color: colorNavy,
  });

  textY -= 12;
  drawSafeText('Track Online Status at:', {
    x: leftX,
    y: textY,
    size: 7.5,
    font: fontBold,
    color: colorTextDark,
  });
  drawSafeText(verifyUrl, {
    x: leftX + 95,
    y: textY,
    size: 7,
    font: fontRegular,
    color: rgb(0.1, 0.3, 0.7),
  });

  textY -= 12;
  drawSafeText('Digital Evidence SHA-256:', {
    x: leftX,
    y: textY,
    size: 7.5,
    font: fontBold,
    color: colorTextDark,
  });
  drawSafeText(sha256, {
    x: leftX + 110,
    y: textY,
    size: 6.5,
    font: fontMono,
    color: colorNavy,
  });

  textY -= 13;
  const disclaimer =
    'This computer-generated document constitutes an official acknowledgment of receipt under the Legal Metrology Directorate. No physical seal is required for digital verification.';
  drawSafeText(disclaimer, {
    x: leftX,
    y: textY,
    size: 6.5,
    font: fontOblique,
    color: colorTextMuted,
  });

  // --------------------------------------------------------------------------
  // 8. Signature Blocks
  // --------------------------------------------------------------------------
  const signY = footerBoxY - 24;
  page.drawLine({
    start: { x: 46, y: signY + 12 },
    end: { x: 210, y: signY + 12 },
    thickness: 0.8,
    color: colorBorder,
  });
  drawSafeText('Signature of Applicant / Complainant', {
    x: 46,
    y: signY,
    size: 7,
    font: fontBold,
    color: colorTextDark,
  });

  page.drawLine({
    start: { x: width - 210, y: signY + 12 },
    end: { x: width - 46, y: signY + 12 },
    thickness: 0.8,
    color: colorBorder,
  });
  drawSafeText('Receiving Officer (LMO / SDM Seal)', {
    x: width - 210,
    y: signY,
    size: 7,
    font: fontBold,
    color: colorTextDark,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export default {
  generateAcknowledgementPdf,
};
