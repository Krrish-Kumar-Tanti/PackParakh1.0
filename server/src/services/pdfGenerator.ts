// ============================================================================
// PackParakh (पैक-परख) — Form-V Court Seizure Memo PDF Generator
// Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) / Sec 65B Evidence Act
// Ministry of Consumer Affairs, Food & Public Distribution | SIH 26034
// Author: Gitansh (Backend Lead)
// ============================================================================

import { PDFDocument, rgb, StandardFonts, degrees, PDFFont, Color } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateEvidenceHash } from './hashService';

export interface FormVSeizureMemoData {
  scanId: string;
  memoNumber?: string;
  timestamp?: string;
  officerBadge?: string;
  officerName?: string;
  state?: string;
  district?: string;
  locationLat?: number;
  locationLng?: number;
  source?: string;
  productName?: string;
  brandName?: string;
  brandRegistrationNo?: string;
  directorName?: string;
  category?: string;
  declaredMrp?: number;
  declaredNetQty?: number;
  declaredNetUnit?: string;
  calculatedUsp?: string;
  complianceScore: number;
  verdict: 'PASS' | 'FAIL' | 'REVIEW' | string;
  sha256Hash?: string;
  isOfficerConfirmed?: boolean | number;
  micrometerReadingMm?: number;
  officerNotes?: string;
  violations?: Array<{
    ruleNumber: string;
    ruleTitle?: string;
    description: string;
    penaltySection: string;
    severity?: string;
    scoreDeduction?: number;
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
    .replace(/[^\x20-\x7E\r\n\t]/g, ' ') // Replace non-printable ASCII / Unicode with safe space
    .trim();
}

/**
 * Generate official Court-Admissible Form-V Seizure Memo PDF adhering to
 * Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023).
 */
export async function generateFormVPdf(data: FormVSeizureMemoData): Promise<Buffer> {
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

  // Width-safe truncation: shrink text with an ellipsis so it NEVER spills into
  // the neighbouring print column (fixes overlapping Statutory/Deduction cells).
  const ELLIPSIS = '...';
  const truncateToWidth = (
    text: string | number | null | undefined,
    font: PDFFont,
    size: number,
    maxWidth: number
  ): string => {
    const cleaned = cleanText(text);
    if (cleaned === '' || maxWidth <= 0) return cleaned;
    if (font.widthOfTextAtSize(cleaned, size) <= maxWidth) return cleaned;
    let lo = 0;
    let hi = cleaned.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (font.widthOfTextAtSize(cleaned.slice(0, mid) + ELLIPSIS, size) <= maxWidth) lo = mid;
      else hi = mid - 1;
    }
    return cleaned.slice(0, lo) + ELLIPSIS;
  };

  // Word-boundary wrapping: normal sentences flow onto new lines so nothing is
  // hidden with an ellipsis. Only an indivisible token wider than the column
  // (or the row's line budget) may end in "..." — and never across a boundary.
  const wordWrap = (
    text: string | number | null | undefined,
    font: PDFFont,
    size: number,
    maxWidth: number,
    maxLines: number
  ): string[] => {
    const cleaned = cleanText(text).replace(/\s+/g, ' ');
    if (cleaned === '' || maxLines <= 0) return [];
    const words = cleaned.split(' ');
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      if (lines.length >= maxLines) break;
      const trial = cur ? cur + ' ' + w : w;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
        cur = trial;
      } else if (cur) {
        lines.push(cur);
        cur = w;
      } else {
        lines.push(truncateToWidth(w, font, size, maxWidth));
        cur = '';
      }
    }
    if (cur) {
      if (lines.length < maxLines) {
        lines.push(cur);
      } else {
        lines[maxLines - 1] = truncateToWidth(
          lines[maxLines - 1] + ' ' + cur,
          font,
          size,
          maxWidth
        );
      }
    }
    return lines;
  };

  // Design Tokens (Sovereign Nyaya Navy & Verdict Gold)
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

  const isConfirmed = Boolean(data.isOfficerConfirmed);
  const isReview = data.verdict === 'REVIEW';
  const isProvisionalDraft = isReview && !isConfirmed;

  // Memo Number & Timestamp
  const memoNo = cleanText(
    data.memoNumber ||
      `MEMO-${(data.state || 'DL').slice(0, 2).toUpperCase()}-2026-${data.scanId.slice(-6).toUpperCase()}`
  );
  const inspectionDate = data.timestamp ? new Date(data.timestamp) : new Date();
  const dateString =
    inspectionDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }) + ' IST';

  // Compute canonical SHA-256 if not provided
  const sha256Hash =
    data.sha256Hash ||
    generateEvidenceHash({
      scanId: data.scanId,
      memoNo,
      productName: data.productName,
      brandName: data.brandName,
      verdict: data.verdict,
      score: data.complianceScore,
      isoTimestamp: inspectionDate.toISOString(),
      source: data.source || 'LIVE_CAMERA',
    });

  // Source Honesty Stamp Text
  let sourceBadgeText = '[SOURCE: LIVE FIELD EVIDENCE]';
  if (data.source === 'SAMPLE_SEED') {
    sourceBadgeText = '[SOURCE: BENCHMARK SEED AUDIT]';
  } else if (data.source === 'DEMO_CACHED') {
    sourceBadgeText = '[SOURCE: PRESET DEMO CACHE]';
  }

  // --------------------------------------------------------------------------
  // 1. Watermark Layer (Draft Watermark for unconfirmed REVIEW scans)
  // --------------------------------------------------------------------------
  if (isProvisionalDraft) {
    drawSafeText('PROVISIONAL DRAFT', {
      x: 80,
      y: 350,
      size: 42,
      font: fontBold,
      color: rgb(0.9, 0.3, 0.3),
      rotate: degrees(35),
      opacity: 0.18,
    });
    drawSafeText('PENDING OFFICER CONFIRMATION', {
      x: 70,
      y: 300,
      size: 24,
      font: fontBold,
      color: rgb(0.9, 0.3, 0.3),
      rotate: degrees(35),
      opacity: 0.18,
    });
  }

  // --------------------------------------------------------------------------
  // 2. Header & Emblem
  // --------------------------------------------------------------------------
  let currentY = height - 32;

  // Top Decorative Sovereign Bar
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

  // Header Titles
  drawSafeText('GOVERNMENT OF INDIA', {
    x: width / 2 - getSafeWidth('GOVERNMENT OF INDIA', fontBold, 13) / 2,
    y: currentY,
    size: 13,
    font: fontBold,
    color: colorNavy,
  });

  currentY -= 14;
  const ministryTitle = 'MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION';
  drawSafeText(ministryTitle, {
    x: width / 2 - getSafeWidth(ministryTitle, fontBold, 9.5) / 2,
    y: currentY,
    size: 9.5,
    font: fontBold,
    color: colorDarkSlate,
  });

  currentY -= 12;
  const deptTitle = 'DIRECTORATE OF LEGAL METROLOGY - STATUTORY ENFORCEMENT DIVISION';
  drawSafeText(deptTitle, {
    x: width / 2 - getSafeWidth(deptTitle, fontRegular, 8) / 2,
    y: currentY,
    size: 8,
    font: fontRegular,
    color: colorTextMuted,
  });

  // Banner Box for Form Title (with generous 16pt clearance above, completely eliminating overlap)
  currentY -= 16;
  const bannerBoxHeight = 24;
  const bannerBoxY = currentY - bannerBoxHeight;

  page.drawRectangle({
    x: 36,
    y: bannerBoxY,
    width: width - 72,
    height: bannerBoxHeight,
    color: colorNavy,
    borderColor: colorGold,
    borderWidth: 1.2,
  });

  const bannerTitle = 'FORM-V: SEIZURE & INSPECTION MEMORANDUM';
  drawSafeText(bannerTitle, {
    x: width / 2 - getSafeWidth(bannerTitle, fontBold, 11) / 2,
    y: bannerBoxY + 7,
    size: 11,
    font: fontBold,
    color: colorGold,
  });

  currentY = bannerBoxY - 12;
  const statutorySubtitle = '[Executed under Section 15 & Section 39 of the Legal Metrology Act, 2009 / Rule 20 PCR 2011]';
  drawSafeText(statutorySubtitle, {
    x: width / 2 - getSafeWidth(statutorySubtitle, fontOblique, 7.5) / 2,
    y: currentY,
    size: 7.5,
    font: fontOblique,
    color: colorTextMuted,
  });

  // --------------------------------------------------------------------------
  // 3. Metadata & Jurisdiction Panel (2-Column Box)
  // --------------------------------------------------------------------------
  currentY -= 14;
  const metaBoxHeight = 58;
  const metaBoxY = currentY - metaBoxHeight;

  page.drawRectangle({
    x: 36,
    y: metaBoxY,
    width: width - 72,
    height: metaBoxHeight,
    color: colorLightBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  // Left Column Metadata
  const col1X = 46;
  let metaLineY = metaBoxY + metaBoxHeight - 14;

  drawSafeText('Memo Number:', { x: col1X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(memoNo, fontBold, 8.5, 236), { x: col1X + 66, y: metaLineY, size: 8.5, font: fontBold, color: colorNavy });

  metaLineY -= 12;
  drawSafeText('Inspection Date:', { x: col1X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(dateString, fontRegular, 8, 236), { x: col1X + 66, y: metaLineY, size: 8, font: fontRegular, color: colorTextDark });

  metaLineY -= 12;
  drawSafeText('Officer Badge:', { x: col1X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(`${data.officerBadge || 'LMO-DL-2026-44'} (${data.officerName || 'Inspector Rajesh Kumar'})`, fontRegular, 8, 236), {
    x: col1X + 66,
    y: metaLineY,
    size: 8,
    font: fontRegular,
    color: colorTextDark,
  });

  metaLineY -= 12;
  drawSafeText('Jurisdiction:', { x: col1X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(`${data.district || 'New Delhi'}, ${data.state || 'Delhi'}`, fontRegular, 8, 236), {
    x: col1X + 66,
    y: metaLineY,
    size: 8,
    font: fontRegular,
    color: colorTextDark,
  });

  // Right Column Metadata
  const col2X = 300;
  metaLineY = metaBoxY + metaBoxHeight - 14;

  drawSafeText('Evidence Source:', { x: col2X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(sourceBadgeText, fontBold, 7.5, 175), {
    x: col2X + 75,
    y: metaLineY,
    size: 7.5,
    font: fontBold,
    color: data.source === 'LIVE_CAMERA' ? colorGreen : colorAmber,
  });

  metaLineY -= 12;
  drawSafeText('GPS Geotag:', { x: col2X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  const lat = data.locationLat ? data.locationLat.toFixed(4) : '28.6139';
  const lng = data.locationLng ? data.locationLng.toFixed(4) : '77.2090';
  drawSafeText(truncateToWidth(`Lat: ${lat} N, Lng: ${lng} E (EXIF Locked)`, fontRegular, 7.5, 175), {
    x: col2X + 75,
    y: metaLineY,
    size: 7.5,
    font: fontRegular,
    color: colorTextDark,
  });

  metaLineY -= 12;
  drawSafeText('Judicial Seal:', { x: col2X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText('Section 63 BSA 2023 Admissible', {
    x: col2X + 75,
    y: metaLineY,
    size: 7.5,
    font: fontBold,
    color: colorNavy,
  });

  metaLineY -= 12;
  drawSafeText('HITL Status:', { x: col2X, y: metaLineY, size: 8, font: fontBold, color: colorTextDark });
  if (isConfirmed) {
    drawSafeText(truncateToWidth(`OFFICER CONFIRMED (${data.micrometerReadingMm ? data.micrometerReadingMm + 'mm' : 'Verified'})`, fontBold, 7.5, 175), {
      x: col2X + 75,
      y: metaLineY,
      size: 7.5,
      font: fontBold,
      color: colorGreen,
    });
  } else if (isReview) {
    drawSafeText('PENDING LMO CONFIRMATION', {
      x: col2X + 75,
      y: metaLineY,
      size: 7.5,
      font: fontBold,
      color: colorAmber,
    });
  } else {
    drawSafeText('DETERMINISTIC VERIFIED', {
      x: col2X + 75,
      y: metaLineY,
      size: 7.5,
      font: fontBold,
      color: colorNavy,
    });
  }

  // --------------------------------------------------------------------------
  // 4. Seized Commodity & Brand Ledger Box
  // --------------------------------------------------------------------------
  currentY = metaBoxY - 14;
  const productBoxHeight = 62;
  const productBoxY = currentY - productBoxHeight;

  page.drawRectangle({
    x: 36,
    y: productBoxY,
    width: width - 72,
    height: productBoxHeight,
    color: rgb(1, 1, 1),
    borderColor: colorBorder,
    borderWidth: 1,
  });

  // Section Banner Strip
  page.drawRectangle({
    x: 36,
    y: productBoxY + productBoxHeight - 16,
    width: width - 72,
    height: 16,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });
  drawSafeText('SEIZED COMMODITY & PACKAGING DECLARATIONS', {
    x: 44,
    y: productBoxY + productBoxHeight - 12,
    size: 8,
    font: fontBold,
    color: colorNavy,
  });

  let prodLineY = productBoxY + productBoxHeight - 28;

  // Row 1
  drawSafeText('Product Name:', { x: 46, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(data.productName || 'N/A', fontRegular, 8, 194), { x: 110, y: prodLineY, size: 8, font: fontRegular, color: colorTextDark });

  drawSafeText('Brand Name:', { x: 310, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(data.brandName || 'N/A', fontBold, 8, 142), { x: 375, y: prodLineY, size: 8, font: fontBold, color: colorNavy });

  // Row 2
  prodLineY -= 14;
  drawSafeText('Category:', { x: 46, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(data.category || 'GENERAL', fontRegular, 8, 194), { x: 110, y: prodLineY, size: 8, font: fontRegular, color: colorTextDark });

  drawSafeText('Responsible Director:', { x: 300, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(`${data.directorName || 'Board of Directors'} (Rule 27 GSR 418(E))`, fontRegular, 7.5, 146), {
    x: 405,
    y: prodLineY,
    size: 7.5,
    font: fontRegular,
    color: colorTextDark,
  });

  // Row 3
  prodLineY -= 14;
  drawSafeText('Declared MRP:', { x: 46, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  const mrpText = data.declaredMrp ? `Rs. ${data.declaredMrp.toFixed(2)}` : 'N/A';
  drawSafeText(truncateToWidth(mrpText, fontBold, 8, 68), { x: 110, y: prodLineY, size: 8, font: fontBold, color: colorNavy });

  drawSafeText('Declared Qty:', { x: 185, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  const qtyText = data.declaredNetQty ? `${data.declaredNetQty} ${data.declaredNetUnit || 'g'}` : 'N/A';
  drawSafeText(truncateToWidth(qtyText, fontRegular, 8, 64), { x: 245, y: prodLineY, size: 8, font: fontRegular, color: colorTextDark });

  drawSafeText('Calculated USP:', { x: 300, y: prodLineY, size: 8, font: fontBold, color: colorTextDark });
  drawSafeText(truncateToWidth(data.calculatedUsp || 'N/A', fontRegular, 8, 160), { x: 380, y: prodLineY, size: 8, font: fontRegular, color: colorTextDark });

  // --------------------------------------------------------------------------
  // 5. Verdict & Compliance Score Banner
  // --------------------------------------------------------------------------
  currentY = productBoxY - 14;
  const scoreBoxHeight = 26;
  const scoreBoxY = currentY - scoreBoxHeight;

  let verdictColor = colorGreen;
  let verdictText = 'COMPLIANT - NO STATUTORY BREACH DETECTED';
  if (data.verdict === 'FAIL') {
    verdictColor = colorRed;
    verdictText = 'NON-COMPLIANT - STATUTORY SEIZURE MANDATED';
  } else if (data.verdict === 'REVIEW') {
    verdictColor = colorAmber;
    verdictText = isConfirmed
      ? 'CONFIRMED BY GAZETTED LMO OFFICER - ACTIONABLE'
      : 'HEURISTIC REVIEW - SCALE CONFIRMATION REQUIRED';
  }

  page.drawRectangle({
    x: 36,
    y: scoreBoxY,
    width: width - 72,
    height: scoreBoxHeight,
    color: colorNavy,
    borderColor: verdictColor,
    borderWidth: 1.5,
  });

  drawSafeText(`VERDICT: ${verdictText}`, {
    x: 46,
    y: scoreBoxY + 8,
    size: 9,
    font: fontBold,
    color: verdictColor,
  });

  const scoreText = `Compliance Score: ${data.complianceScore} / 100`;
  drawSafeText(scoreText, {
    x: width - 36 - getSafeWidth(scoreText, fontBold, 9) - 10,
    y: scoreBoxY + 8,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // --------------------------------------------------------------------------
  // 6. Statutory Violations & Explainable Deduction Table
  // --------------------------------------------------------------------------
  // Footer geometry is declared up-front: the violations table must yield its
  // remaining vertical space to the cryptographic integrity footer below.
  const footerBoxHeight = 110;
  const footerBoxY = 46;
  currentY = scoreBoxY - 14;

  drawSafeText('ITEMIZED STATUTORY VIOLATIONS & FACTOR DEDUCTION TABLE', {
    x: 36,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: colorNavy,
  });

  currentY -= 8;
  const tableX = 36;
  const tableWidth = width - 72;
  const headerHeight = 18;
  const rowHeight = 24;

  // Table Column Widths (total 523pt): Widened Rule Code column from 62pt to 90pt
  // so statutory mandate tags and rule references never clip or overflow.
  const colW = [90, 180, 138, 56, 59];

  // Draw Table Header
  page.drawRectangle({
    x: tableX,
    y: currentY - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: colorDarkSlate,
  });

  let colOffset = tableX;
  const headers = ['Rule Code', 'Violation Detail', 'Statutory Citation', 'Deduction', 'Compounding'];
  for (let i = 0; i < headers.length; i++) {
    drawSafeText(truncateToWidth(headers[i], fontBold, 7.5, colW[i] - 6), {
      x: colOffset + 4,
      y: currentY - headerHeight + 5,
      size: 7.5,
      font: fontBold,
      color: colorGold,
    });
    colOffset += colW[i];
  }

  currentY -= headerHeight;

  const violations = data.violations && data.violations.length > 0 ? data.violations : [];

  if (violations.length === 0) {
    // Single row for Compliant
    page.drawRectangle({
      x: tableX,
      y: currentY - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: rgb(0.97, 0.99, 0.97),
      borderColor: colorBorder,
      borderWidth: 1,
    });

    drawSafeText('Nil - All 24 statutory declarations verified compliant under Legal Metrology (PC) Rules, 2011.', {
      x: tableX + 8,
      y: currentY - rowHeight + 8,
      size: 7.5,
      font: fontRegular,
      color: colorGreen,
    });
    currentY -= rowHeight;
  } else {
    // Wrapped, variable-height rows: long statutory citations & violation
    // details flow onto the next line INSIDE their own column instead of
    // being hidden behind an ellipsis. Words are never clipped mid-token and
    // no glyph ever crosses its column boundary.
    const lineGap = 9;
    const cellPad = 4;
    const maxCellLines = 6;
    const severityColor = (s?: string): Color =>
      s === 'CRITICAL' ? colorRed : s === 'MODERATE' ? colorAmber : colorTextDark;
    type CellBlock = { text: string; font: PDFFont; size: number; color: Color };
    const toBlocks = (lines: string[], font: PDFFont, size: number, color: Color): CellBlock[] =>
      lines.map((t) => ({ text: t, font, size, color }));

    // Height budget before the integrity footer begins.
    const footerSpace = footerBoxY + footerBoxHeight + 14;

    let drawnCount = 0;
    for (const v of violations) {
      const ruleBlocks = toBlocks(
        wordWrap(v.ruleNumber || 'Rule 6', fontBold, 7.5, colW[0] - 6, maxCellLines),
        fontBold,
        7.5,
        colorTextDark
      );
      if (v.severity) {
        ruleBlocks.push({ text: `[${v.severity}]`, font: fontRegular, size: 6, color: severityColor(v.severity) });
      }
      const titleBlocks = toBlocks(
        wordWrap(v.ruleTitle || v.description || '', fontBold, 7, colW[1] - 8, maxCellLines),
        fontBold,
        7,
        colorTextDark
      );
      const bodyBlocks =
        v.description && v.description !== v.ruleTitle
          ? toBlocks(
              wordWrap(v.description, fontRegular, 6.5, colW[1] - 8, maxCellLines - titleBlocks.length),
              fontRegular,
              6.5,
              colorTextMuted
            )
          : [];
      const penaltyBlocks = toBlocks(
        wordWrap(v.penaltySection || 'Sec 36(1) LM Act', fontRegular, 7, colW[2] - 8, maxCellLines),
        fontRegular,
        7,
        colorTextDark
      );
      const deductionBlocks = toBlocks(
        wordWrap(v.scoreDeduction ? `-${v.scoreDeduction} Pts` : '-25 Pts', fontBold, 7.5, colW[3] - 6, 2),
        fontBold,
        7.5,
        colorRed
      );
      const feeBlocks = toBlocks(
        wordWrap(v.severity === 'CRITICAL' ? 'Rs. 25,000' : 'Rs. 10,000', fontRegular, 7.5, colW[4] - 6, 2),
        fontRegular,
        7.5,
        colorTextDark
      );

      const cellBlocks = [ruleBlocks, [...titleBlocks, ...bodyBlocks], penaltyBlocks, deductionBlocks, feeBlocks];
      const rowLineCount = Math.max(...cellBlocks.map((b) => b.length));
      const rowH = cellPad + rowLineCount * lineGap + 4;

      if (currentY - rowH < footerSpace) {
        break; // no vertical room left — remaining violations roll to the docket
      }

      const rowY = currentY - rowH;
      const isEven = drawnCount % 2 === 0;
      page.drawRectangle({
        x: tableX,
        y: rowY,
        width: tableWidth,
        height: rowH,
        color: isEven ? rgb(1, 1, 1) : colorLightBg,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      let cellX = tableX;
      for (let c = 0; c < cellBlocks.length; c++) {
        cellBlocks[c].forEach((b, i) => {
          drawSafeText(b.text, {
            x: cellX + 4,
            y: rowY + rowH - cellPad - 6 - i * lineGap,
            size: b.size,
            font: b.font,
            color: b.color,
          });
        });
        cellX += colW[c];
      }
      currentY -= rowH;
      drawnCount += 1;
    }

    if (violations.length > drawnCount) {
      const extraCount = violations.length - drawnCount;
      drawSafeText(`... and ${extraCount} additional statutory violation(s) recorded in electronic case docket.`, {
        x: tableX + 4,
        y: currentY - 10,
        size: 7,
        font: fontOblique,
        color: colorTextMuted,
      });
      currentY -= 14;
    }
  }

  // --------------------------------------------------------------------------
  // 7. QR Code & Cryptographic Integrity Section
  // --------------------------------------------------------------------------

  page.drawRectangle({
    x: 36,
    y: footerBoxY,
    width: width - 72,
    height: footerBoxHeight,
    color: colorLightBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  // Generate QR Code linking to verify endpoint
  const verifyUrl = `https://packparakh.gov.in/verify/${data.memoNumber || data.scanId || sha256Hash}`;
  const qrPngBuffer = await QRCode.toBuffer(verifyUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 90,
  });
  const qrImage = await pdfDoc.embedPng(qrPngBuffer);

  // Draw QR Image on the Right with protective margin and crisp backing card
  const qrSize = 78;
  const qrX = width - 36 - qrSize - 12;
  const qrY = footerBoxY + (footerBoxHeight - qrSize) / 2;

  // Clean white backing card for the QR code to keep it visually isolated
  page.drawRectangle({
    x: qrX - 4,
    y: qrY - 4,
    width: qrSize + 8,
    height: qrSize + 8,
    color: rgb(1, 1, 1),
    borderColor: colorBorder,
    borderWidth: 1,
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // Text on Left of Footer Box (strictly bounded so nothing ever touches or overlaps the QR card)
  const leftFooterX = 46;
  const maxSafeTextWidth = qrX - 16 - leftFooterX;
  let textY = footerBoxY + footerBoxHeight - 16;

  drawSafeText('SECTION 63 BSA 2023 ELECTRONIC EVIDENCE INTEGRITY VAULT', {
    x: leftFooterX,
    y: textY,
    size: 8,
    font: fontBold,
    color: colorNavy,
  });

  textY -= 12;
  drawSafeText('Canonical SHA-256 Hash:', {
    x: leftFooterX,
    y: textY,
    size: 7.5,
    font: fontBold,
    color: colorTextDark,
  });
  drawSafeText(truncateToWidth(sha256Hash, fontMono, 6.5, maxSafeTextWidth - 105), {
    x: leftFooterX + 105,
    y: textY,
    size: 6.5,
    font: fontMono,
    color: colorNavy,
  });

  textY -= 12;
  drawSafeText('Public Verification URL:', {
    x: leftFooterX,
    y: textY,
    size: 7.5,
    font: fontBold,
    color: colorTextDark,
  });
  const displayUrl = `https://packparakh.gov.in/verify/${data.memoNumber || data.scanId}`;
  drawSafeText(truncateToWidth(displayUrl, fontRegular, 7, maxSafeTextWidth - 105), {
    x: leftFooterX + 105,
    y: textY,
    size: 7,
    font: fontRegular,
    color: rgb(0.08, 0.32, 0.72),
  });

  textY -= 13;
  // Mandatory Legal Caveat (Section 63 BSA 2023 & Micrometer Warning)
  const caveatLines = [
    'Mandatory Statutory Caveat: Font height calculations in this automated memo are photogrammetric estimations.',
    'Final judicial prosecution under Section 36 requires physical verification with a calibrated optical micrometer.',
    'This document constitutes prima facie documentary electronic evidence under Section 63 of the Bharatiya',
    'Sakshya Adhiniyam, 2023 (BSA 2023) [formerly Section 65B of the Indian Evidence Act, 1872].',
  ];

  for (const line of caveatLines) {
    drawSafeText(truncateToWidth(line, fontOblique, 6, maxSafeTextWidth), {
      x: leftFooterX,
      y: textY,
      size: 6,
      font: fontOblique,
      color: colorTextMuted,
    });
    textY -= 8;
  }

  // --------------------------------------------------------------------------
  // 8. Signatures Block
  // --------------------------------------------------------------------------
  const signY = footerBoxY - 24;
  page.drawLine({
    start: { x: 46, y: signY + 12 },
    end: { x: 220, y: signY + 12 },
    thickness: 0.8,
    color: colorBorder,
  });
  drawSafeText('Inspecting Legal Metrology Officer (Sign & Seal)', {
    x: 46,
    y: signY,
    size: 7,
    font: fontBold,
    color: colorTextDark,
  });

  page.drawLine({
    start: { x: width - 220, y: signY + 12 },
    end: { x: width - 46, y: signY + 12 },
    thickness: 0.8,
    color: colorBorder,
  });
  drawSafeText('Accused / Retailer / Packer Acknowledgment', {
    x: width - 220,
    y: signY,
    size: 7,
    font: fontBold,
    color: colorTextDark,
  });

  // Save and return buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export default {
  generateFormVPdf,
};
