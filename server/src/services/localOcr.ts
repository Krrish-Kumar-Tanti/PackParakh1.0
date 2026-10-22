// ============================================================================
// PackParakh (पैक-परख) — Local OCR Declaration Extractor (no API key needed)
// Swetakshi-owned integration layer. Runs Tesseract.js locally on the server so
// uploaded/photographed packaging labels produce REAL mandatory-declaration
// text even when GEMINI_API_KEY is absent (venue / offline demo critical path).
//
// Pipeline: preprocess (grayscale + upscale + contrast) -> dual-pass OCR
// (psm 6 block + psm 11 sparse) -> regex extractors for the Legal Metrology
// mandatory declarations (PCR 2011). Returns a snake_case record shaped like
// the shared Gemini extract so visionBridge adaptSharedExtract() translates it
// into the camelCase shape the deterministic rule engine consumes.
// ============================================================================

import { createWorker, type Worker } from 'tesseract.js';
import { Jimp } from 'jimp';
import sharp from 'sharp';

const COUNTRY_NAMES = [
  'india', 'china', 'usa', 'u s a', 'united states', 'japan', 'vietnam',
  'thailand', 'malaysia', 'indonesia', 'bangladesh', 'sri lanka', 'nepal',
  'bhutan', 'united arab emirates', 'uae', 'germany', 'france', 'uk',
  'united kingdom', 'italy', 'korea', 'singapore', 'australia', 'brazil',
  'mexico', 'taiwan', 'philippines', 'turkey', 'south africa', 'russia',
  'pakistan', 'canada', 'netherlands', 'spain', 'poland', 'switzerland',
  'austria', 'belgium', 'portugal', 'sweden', 'denmark', 'norway', 'finland',
] as const;

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

let workerPromise: Promise<Worker> | null = null;

async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker('eng');
  }
  return workerPromise;
}

export interface LocalOcrExtract {
  brand_name?: string;
  product_name?: string;
  category?: string;
  mrp_raw?: string;
  mrp_value?: number;
  has_inclusive_of_taxes?: boolean;
  net_quantity_raw?: string;
  net_quantity_value?: number;
  net_quantity_unit?: string;
  unit_sale_price_raw?: string;
  unit_sale_price_value?: number;
  mfg_or_packing_date_raw?: string;
  expiry_date_raw?: string;
  country_of_origin?: string;
  manufacturer_name?: string;
  manufacturer_address?: string;
  has_complete_pincode?: boolean;
  consumer_care_phone?: string;
  consumer_care_email?: string;
  ocrConfidence?: number;
  ocrComplete?: boolean;
}

const DECLARATION_KEYWORDS =
  /mrp|retail|price|net|wt|weight|qty|quantity|mfg|mfd|pack|exp|expiry|best\s?before|use\s?by|unit\s?sale|country|origin|consumer|care|customer|grievance|toll|cust\.?\s?care|max\s?retail|incl|tax|e-mail|email|phone|tel|contact|manufactur|regd|registered|addr|plot|\bst\.?|\broad|\blane|nagar|village|p\.?o\.?|licen|fssai|veg|non-veg|logo|ingred|nutri|serving|\bgm\b|grams?|kgs?|\bml\b|litres?|liters?|batch|lot|bar\s?code|barcode|qr|web|www|\.com|\d{2,4}[-/.]\d{2,4}/i;

// Lines that OPEN a text block and therefore are poor brand candidates.
const BRAND_OPENER_WORDS =
  /^(marketed|manufactured|manufacturing|made|packed|packaging|imported|importing|distributed|distributing|produced|processed|registered|setup|printer|printed|a|an|the|and|or|by|in|at|of|for|under|from|to|with|such|all|only|also|this|our|your)/i;

// ----------------------------------------------------------------------------
// Image Preprocessing (the single biggest accuracy lever for photo OCR)
// ----------------------------------------------------------------------------

async function decodeToJimp(imageBuffer: Buffer): Promise<typeof Jimp | null> {
  try {
    return (await Jimp.read(imageBuffer)) as any;
  } catch {
    // Jimp cannot decode WebP / HEIC / AVIF natively — fall back to sharp
    // (common for .webp downloads), then continue preprocessing on a PNG.
    try {
      const png = await sharp(imageBuffer, { failOn: 'none' }).png().toBuffer();
      return (await Jimp.read(png)) as any;
    } catch (err) {
      console.warn('[LocalOCR] sharp decode fallback failed:', err);
      return null;
    }
  }
}

interface PreprocessOptions {
  targetLongSide?: number;
  contrast?: number;
  binarize?: boolean;
  adaptive?: boolean;
  mirror?: boolean;
  rotateDeg?: number;
  // Cylinder mitigation: keep only the central horizontal band. Text printed
  // on a bottle/can sits flattest in the middle of the wrap; the left/right
  // edges are the most foreshortened by curvature and only add noise.
  cropCenterRatio?: number;
}

// Otsu's method: pick the luma threshold that best splits foreground text from
// background, then render a strict black/white image. This rescues labels
// photographed in shadow / low contrast / against busy backgrounds.
function binarizeOtsu(img: any): void {
  const { data, width, height } = img.bitmap;
  const hist = new Float64Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const y = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) | 0;
    hist[y]++;
  }
  const total = width * height;
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0;
  let wB = 0;
  let maxBetween = -1;
  let thr = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxBetween) {
      maxBetween = between;
      thr = t;
    }
  }
  for (let i = 0; i < data.length; i += 4) {
    const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const v = y <= thr ? 0 : 255;
    data[i] = data[i + 1] = data[i + 2] = v;
    data[i + 3] = 255;
  }
}

// Sauvola adaptive threshold: a local mean/std window decides each pixel's
// black/white class instead of one global histogram split. This rescues labels
// where companies print in low-contrast inks (e.g. light print on dark orange)
// or where shadows/gradients stretch across the label — the exact cases that
// defeat a global Otsu split. Integral images keep it O(pixels) and fast.
function sauvolaBinarize(
  img: any,
  windowRatio = 0.015,
  k = 0.25,
  r = 128
): void {
  const { data, width, height } = img.bitmap;
  const W = width + 1;
  const II = new Float64Array(W * (height + 1));
  const II2 = new Float64Array(W * (height + 1));
  for (let y = 0; y < height; y++) {
    let rowS = 0;
    let rowS2 = 0;
    const iOff = (y + 1) * W;
    const prevOff = y * W;
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4;
      const yv = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      rowS += yv;
      rowS2 += yv * yv;
      II[iOff + x + 1] = II[prevOff + x + 1] + rowS;
      II2[iOff + x + 1] = II2[prevOff + x + 1] + rowS2;
    }
  }
  const win = Math.max(9, Math.round(Math.min(width, height) * windowRatio)) | 1;
  const half = win >> 1;
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - half);
    const y1 = Math.min(height - 1, y + half);
    const yH = y1 - y0 + 1;
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - half);
      const x1 = Math.min(width - 1, x + half);
      const n = (x1 - x0 + 1) * yH;
      const tl = II[y0 * W + x0];
      const tr = II[y0 * W + x1 + 1];
      const bl = II[(y1 + 1) * W + x0];
      const br = II[(y1 + 1) * W + x1 + 1];
      const sum = br - tr - bl + tl;
      const tl2 = II2[y0 * W + x0];
      const tr2 = II2[y0 * W + x1 + 1];
      const bl2 = II2[(y1 + 1) * W + x0];
      const br2 = II2[(y1 + 1) * W + x1 + 1];
      const sum2 = br2 - tr2 - bl2 + tl2;
      const mean = sum / n;
      const variance = Math.max(0, sum2 / n - mean * mean);
      const std = Math.sqrt(variance);
      const thr = mean * (1 + k * (std / r - 1));
      const p = (y * width + x) * 4;
      const yv = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      const v = yv <= thr ? 0 : 255;
      data[p] = data[p + 1] = data[p + 2] = v;
      data[p + 3] = 255;
    }
  }
}

async function preprocessForOcr(
  imageBuffer: Buffer,
  opts: PreprocessOptions = {}
): Promise<Buffer> {
  const {
    targetLongSide = 2400,
    contrast = 0.4,
    binarize = false,
    adaptive = false,
    mirror = false,
    rotateDeg = 0,
    cropCenterRatio,
  } = opts;
  try {
    const decoded = await decodeToJimp(imageBuffer);
    if (!decoded) return imageBuffer;
    let img: any = decoded;
    img = img.greyscale();
    const longSide = Math.max(img.bitmap.width, img.bitmap.height);
    const scale = targetLongSide / longSide;
    if (scale > 1.05) img = img.scale(scale);
    if (cropCenterRatio && cropCenterRatio > 0 && cropCenterRatio < 1) {
      const w = img.bitmap.width;
      const h = img.bitmap.height;
      const cw = Math.max(64, Math.round(w * cropCenterRatio));
      const sx = Math.round((w - cw) / 2);
      img = img.crop({ x: sx, y: 0, w: cw, h });
    }
    if (mirror) img = img.flip({ horizontal: true, vertical: false });
    if (rotateDeg !== 0) img = img.rotate(rotateDeg);
    img = img.contrast(contrast);
    img = img.normalize();
    if (binarize) binarizeOtsu(img);
    if (adaptive) sauvolaBinarize(img);
    return await img.getBuffer('image/png');
  } catch (err) {
    console.warn('[LocalOCR] Preprocessing failed, OCR on raw image:', err);
    return imageBuffer;
  }
}

// ----------------------------------------------------------------------------
// Extraction Helpers
// ----------------------------------------------------------------------------

function normalizeMoney(value: string): number | undefined {
  const num = Number(value.replace(/[^\d.]/g, ''));
  if (Number.isFinite(num) && num > 0) return num;
  return undefined;
}

function cleanupText(raw: string): string {
  const joined = raw
    .replace(/\r/g, '')
    .replace(/- *\n/g, '')
    .replace(/[|']['`"""–—]/g, "'")
    .replace(/\b\s*\n\s*(?=[A-Z₹a-z0-9&])/g, ' ');
  return joined;
}

function findMrp(text: string): { value: number; raw: string } | undefined {
  // 1) "MRP Rs 30", "MRP ₹30.00" keyword-driven
  const mrpKw = text.match(
    /(?:mrp|max(?:imum)?\.?\s*retail\s*price)\s*[:.]?\s*(?:₹|rs\.?|rs|inr)?\s*[,]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d{1,4}(?:\.\d{1,2})?)\s*(?:fold|only)?/i
  );
  if (mrpKw) {
    const v = normalizeMoney(mrpKw[1]);
    if (v) return { value: v, raw: mrpKw[0].trim() };
  }
  // 2) Currency-coded value with slash "₹99/-", "Rs. 45/-"
  const cur = text.match(
    /(?:₹|rs\.?|rs|inr)\s*\.?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*\/\s*-?/i
  );
  if (cur) {
    const v = normalizeMoney(cur[1]);
    if (v) return { value: v, raw: cur[0].trim() };
  }
  // 3) Standalone "90/-" slash-dash amount (very common on photo MRP blocks)
  const slash = text.match(/(?:^|[\s\n])(\d{1,3}(?:\.\d{1,2})?)\s*\/\s*-/m);
  if (slash) {
    const v = normalizeMoney(slash[1]);
    if (v) return { value: v, raw: slash[0].trim() };
  }
  // 4) Bare currency amount with no slash (₹99)
  const bare = text.match(
    /(?:₹|rs\.?|rs|inr)\s*\.?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)(?!\d)/i
  );
  if (bare) {
    const v = normalizeMoney(bare[1]);
    // A bare "rs 1"-style jumble is usually OCR noise (e.g. "-rs 10" split);
    // only trust it as a real MRP when it is at least a plausible amount.
    if (v && !/\d{4}/.test(bare[1]) && v >= 3) return { value: v, raw: bare[0].trim() };
  }
  // 5) "MRP (incl. of all taxes)" style labels put the amount on the NEXT
  //    line. Only accept it when that line looks like a pure price (numeral
  //    with optional currency/slash) — otherwise we'd grab 'Lic No.' digits.
  const nextLine = text.match(/\bmrp\b[^\n]{0,48}\n(\s*[₹0-9.,\s\/\\-]{1,16})\s*$/m);
  if (nextLine) {
    const v = normalizeMoney(nextLine[1].replace(/[^0-9.]/g, ''));
    if (v) return { value: v, raw: nextLine[0].trim() };
  }
  return undefined;
}

function findNetQuantity(text: string): {
  value: number;
  unit: string;
  raw: string;
} | undefined {
  // 1) Mass/volume declarations: "Net Wt. 250 g", "Net Qty 500ML",
  //    "NET QUANTITY: ~~ 95g", "Net Qty ~ 500 g"
  const m = text.match(
    /(?:net(?:work)?\.?\s*(?:wt\.?|w\.?|weight|qty\.?|quantity|content|vol\.?|volume|m\.l\.?)?|net)\s*(?:wt\.?|w\.?|weight|qty\.?|quantity|content|vol\.?)?\s*(?::[~\-•.,\s]{0,12}?|[\-~•.,\s]{1,12}?)(\d{1,4}(?:,\d{3})*(?:\.\d{1,3})?)\s*(kg|kgs|kilo|kilograms?|gms?|grms?|grams?|ml|millilitres?|milliliters?|litres?|liters?|lt|cm|cc|¢)?/i
  );
  if (m) {
    const value = normalizeMoney(m[1]);
    if (value) {
      // OCR frequently splits a value across a space ("~~ 9 5¢" for 95).
      // Absorb any digits/spaces immediately following the captured digits so
      // a split value re-joins instead of truncating to its leading digit.
      const afterIdx = (m.index ?? 0) + m[0].length;
      const tail = (text.slice(afterIdx).match(/^[\s\d.]+/) || [''])[0];
      const digitsRaw = m[1] + tail;
      const fullValue = normalizeMoney(digitsRaw.replace(/[\s.]/g, (c) => (c === ' ' ? '' : '.')) );
      const valueAbsorbed = fullValue ?? value;
      const unitRaw = (m[3] || 'g').toLowerCase();
      let unit: string;
      if (/^kgs?$|^kilos?$|^kilograms?$/.test(unitRaw)) unit = 'kg';
      else if (/^gms$/.test(unitRaw)) unit = 'gms';
      else if (/^g$|^gm$|^grms?$|^grams?$|^¢$/.test(unitRaw)) unit = 'g';
      else if (/^ml$|^millilitres?$|^milliliters?$/.test(unitRaw)) unit = 'ml';
      else if (/^cm$/.test(unitRaw)) unit = 'cm';
      else if (/^cc$/.test(unitRaw)) unit = 'ml';
      else unit = unitRaw;
      return { value: valueAbsorbed, unit, raw: m[0].trim() };
    }
  }
  // 2) Count-based declarations: "4 Paint Brushes", "12 Sheets", "10 Pcs"
  const c = text.match(
    /(?:^|[\s\n])(\d{1,4}(?:\.\d{1,2})?)\s+(pcs?|pieces?|paint\s+brushes?|brushes?|sheets?|pens?|set\s*of|sets?|units?|cards?|pairs?|dozens?|nos\.?|number)(?:\s|$)/i
  );
  if (c) {
    const value = normalizeMoney(c[1]);
    if (value) {
      const unitRaw = c[2].toLowerCase();
      let unit = 'Nos';
      if (/^pcs?$|^pieces?$/.test(unitRaw)) unit = 'pcs';
      else if (/^set(s)?$/.test(unitRaw)) unit = 'nos';
      else if (/^dozen/.test(unitRaw)) unit = 'dozen';
      else if (/^pairs?$/.test(unitRaw)) unit = 'pair';
      return { value, unit, raw: c[0].trim() };
    }
  }
  return undefined;
}

function findMfgDate(text: string): string | undefined {
  const m = text.match(
    /(?:mfg(?:d|\.)?|m\.f\.g\.?|manufactur(?:ed|ing)?\s*date|pack(?:ed|ing)?\s*date|date\s*of\s*pack|pkg|dom)\s*[:.\-]?\s*(\d{1,2}[\/\-.]\d{2,4}(?:[\/\-.]\d{2,4})?|\d{2,4}[\/\-.]\d{1,2})\b/i
  );
  if (m) return m[1];
  const monthDot = new RegExp(
    `(?:mfg(?:d|\\.)?|m\\.f\\.g\\.?|manufactur(?:ed|ing)?\\s*date|pack(?:ed|ing)?\\s*date|dom)\\s*[:.-]?\\s*(${MONTHS.join('|')})[a-z]*\\.?\\s*,?\\s*(\\d{2,4})`,
    'i'
  );
  const mm = text.match(monthDot);
  return mm ? `${mm[1][0].toUpperCase()}${mm[1].slice(1)} ${mm[2]}` : undefined;
}

function findExpiryDate(text: string): string | undefined {
  const m = text.match(
    /(?:exp(?:iry|\.)?|use\s+by|best\s+before|best\s*by)\s*[:.\-]?\s*(\d{1,2}[\/\-.]\d{2,4}(?:[\/\-.]\d{2,4})?|\d{4}-?\d{2}-?\d{2})\b/i
  );
  if (m) return m[1];
  const monthDot = new RegExp(
    `(?:exp(?:iry|\\.)?|use\\s+by|best\\s+before)\\s*[:.-]?\\s*(${MONTHS.join('|')})[a-z]*\\.?\\s*,?\\s*(\\d{2,4})`,
    'i'
  );
  const mm = text.match(monthDot);
  return mm ? `${mm[1][0].toUpperCase()}${mm[1].slice(1)} ${mm[2]}` : undefined;
}

function findCountryOfOrigin(text: string): string | undefined {
  const m = text.match(
    /(?:country\s*of\s*origin|made\s+in|manufactur(?:ed|ing)\s+in|produced\s+in|pack(?:ed|ing)\s+in|imported\s+from)\s*(?:of|by|in|at)?\s*[:.\-]?\s*\b([A-Za-z][A-Za-z .\-]{1,25})\b/i
  );
  if (!m) return undefined;
  const candidate = m[1].trim();
  if (!candidate) return undefined;
  const exact = COUNTRY_NAMES.find((c) => candidate.toLowerCase() === c);
  if (exact) return exact.charAt(0).toUpperCase() + exact.slice(1);
  const lazy = COUNTRY_NAMES.find((c) => candidate.toLowerCase().includes(c));
  if (lazy) return lazy.charAt(0).toUpperCase() + lazy.slice(1);
  return undefined;
}

function findCountryNearLicenceKindle(text: string): string | undefined {
  // "Marketed ... under the licence of Faber-Castell, Stein, Germany",
  // "Registered office: ... Germany"
  const m = text.match(
    /(?:under\s+\w{0,8}\s+licen\w*|registered|office|address|faber|stein|gmbh|imported)\b[^.\n]{0,50}\b(India|Germany|China|France|Italy|Japan|Korea|U\.?S\.?A\.?|United\s+States|Vietnam|Thailand|Malaysia|Indonesia|Singapore|Taiwan|UAE|United\s+Arab\s+Emirates|Nepal|Sri\s+Lanka|Bangladesh|Bhutan|Pakistan|Australia|Brazil|Mexico|Spain|Poland|Switzerland|Austria|Belgium|Portugal|Sweden|Denmark|Norway|Finland|Netherlands|Russia|Turkey|South\s+Africa|Czech|Hungary)\b/i
  );
  if (!m) return undefined;
  const country = m[1].startsWith('U') || m[1].startsWith('I') ? m[1] : m[1];
  const list = ['India', 'Germany', 'China', 'France', 'Italy', 'Japan', 'Korea', 'USA', 'United States', 'Vietnam', 'Thailand', 'Malaysia', 'Indonesia', 'Singapore', 'Taiwan', 'UAE', 'United Arab Emirates', 'Nepal', 'Sri Lanka', 'Bangladesh', 'Bhutan', 'Pakistan', 'Australia', 'Brazil', 'Mexico', 'Spain', 'Poland', 'Switzerland', 'Austria', 'Belgium', 'Portugal', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Netherlands', 'Russia', 'Turkey', 'South Africa', 'Czech Republic', 'Hungary'];
  const canonical = list.find((c) => country.toLowerCase().includes(c.toLowerCase()));
  return canonical;
}

function findManufacturerName(text: string): string | undefined {
  const m = text.match(
    /manufactur(?:ed\s*by|er\s*[:]|ing\s*by|ed\s*[:])\s*[:.\-]?\s*([A-Za-z0-9&.,''()\-]{3,}(?:\s+[A-Za-z0-9&.,''()\-]+){0,6})/i
  );
  return m ? (m[1].length > 2 ? m[1].replace(/[.:]$/g, '').trim() : undefined) : undefined;
}

function findBrandSuffix(text: string): string | undefined {
  const m = text.match(
    /([A-Z][A-Za-z&''()\-.]{1,}(?:\s+[A-Z][A-Za-z&''()\-.]*){0,4}?)\s*(?:\(\s*[\dA-Za-z]+\s*\))?\s*(?:pvt\.?\s*(?:ltd|limited)\.?|p(?:vt|viy|vtd)\.?\s*l(?:td|id|tds|idc)\.?|ltd\.?|limited|private\s+limited|&\s*co\.?|co\.?|inc\.?|gmbh|bv|ag|llc)\b/i
  );
  if (!m) return undefined;
  // Strip OCR noise: parenthesised junk, digits, leading 1-2 letter filler
  // ("A Vi Faber-Castell (1) Pvt Ltd" -> "A Vi Faber-Castell" -> "Faber-Castell").
  let s = m[1]
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const tokens = s.split(' ');
  while (tokens.length > 1 && tokens[0].length <= 2) tokens.shift();
  s = tokens.join(' ').trim();
  return s.length >= 3 ? s : undefined;
}

// Company legal-entity suffix keywords (incl. common OCR garble like
// "Pviy Lid"/"Pviy id"). A "(1)"-style catalogue marker may sit between the
// name and the suffix, so it is bridged loosely.
const ENTITY_SUFFIX =
  /(?:pvt\.?\s*(?:ltd|limited)|p(?:vt|viy|vtd)\.?\s*l(?:td|id|tds|idc)|l(?:td|id)\.?|private\s+limited|limited|&\s*co\.?|\bco\.\b(?!m)|gmbh|llc|inc\.?|industr(?:ies|y)|enterprises?|corp\.?)\b/i;

// Lines that end the address block collected after a legal-entity line.
const ADDRESS_STOP =
  /^(?:[|{}]|www|http|@|e-?mail|toll|phone|helpline|consumer\s*care|care\s*cell|care\s*executive|customer|grievance|suppor|mfg|mfd|manufac|pack\s*date|exp|expiry|best\s*before|use\s*by|mrp|max\.?\s*retail|net\s*(?:wt|qty|content|weight|quantity)|batch|lot\b|licen|made\s+in|produced\s+in|country\s*of|unit\s*sale|certif|fssai|veg\b|non-veg|customer\s*care)/i;

function extractLegalEntity(text: string): {
  name?: string;
  address?: string;
  hasPincode: boolean;
} {
  const lines = normalizeLines(text);
  const entityIdx = lines.findIndex((l) => ENTITY_SUFFIX.test(l));
  if (entityIdx < 0) return { hasPincode: false };

  let name: string | undefined = undefined;
  const split = lines[entityIdx].split(
    /(?=\s+(?:pvt\.?\s*ltd|pviy\.?\s*lid|ltd\.?|limited|private\s+limited|&?\s*co\.?|gmbh|llc|inc\.?|industr(?:ies|y)|enterprises?|corp\.?)\b)/i
  );
  const nameRaw = split[0] || lines[entityIdx];
  if (nameRaw) {
    name = nameRaw
      .replace(/[|{}[\]"'`,]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const tokens = name.split(' ');
    while (tokens.length > 1 && tokens[0].length <= 2) tokens.shift();
    name = tokens.join(' ').trim();
    if (!(name && name.length <= 60 && /[A-Za-z]{3,}/.test(name))) {
      name = undefined;
    } else {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  const blockBits: string[] = [];
  for (let i = entityIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (ADDRESS_STOP.test(l)) break;
    if (blockBits.length >= 4) break;
    const cleaned = l
      .replace(/[|{}();"']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) continue;
    if (/^\d{5,6}$/.test(cleaned)) {
      blockBits.push(cleaned);
      continue;
    }
    blockBits.push(cleaned);
  }
  let address: string | undefined = blockBits.join(' ').trim();
  address = address.replace(/[,;]+$/, '').replace(/\)$/, '').trim();
  if (!address || address.length < 6 || address.length > 160) address = undefined;

  const pinMatch = (address ?? '').match(/\b[1-9]\d{5}\b/);
  return { name, address, hasPincode: !!pinMatch };
}

function findAddressWithPincode(text: string): {
  address?: string;
  hasPincode: boolean;
} {
  const pin = text.match(/\b[1-9]\d{5}\b/);
  if (!pin) return { hasPincode: false };
  const idx = text.indexOf(pin[0]);
  const start = Math.max(0, idx - 120);
  const address = text
    .slice(start, idx + 6)
    .replace(/\s*\|\s*|\n{2,}/g, ' ')
    .trim();
  return { address, hasPincode: true };
}

function findConsumerCare(text: string): { phone?: string; email?: string } {
  const email =
    text.match(/\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/i)?.[0] ?? undefined;
  const phones = text.match(
    /(?:1[89]00[\s\-]?\d{3}[\s\-]?\d{3,4}|\+?91[\s\-]?\d{10}|\b\d{5}[\s\-]?\d{5}\b)/g
  );
  let phone = phones?.at(-1) ?? undefined;
  // A phone placed right after a consumer-care phrase (often mis-rendered by OCR).
  if (!phone) {
    const care = text.match(
      /(?:consumer\s*care|care\s*cell|care\s*executive|customer\s*care|grievance|toll\s*free|helpline)[^0-9]{0,50}((?:\+?91[\s\-]?)?\d{4,5}[\s\-]?\d{3,4}[\s\-]?\d{3,4}|1[89]00[\s\-]?\d{3}[\s\-]?\d{3,4}|\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4})/i
    );
    phone = care?.[1] ?? undefined;
  }
  return { phone, email };
}

function findUnitSalePrice(text: string): { value?: number; raw?: string } {
  const m = text.match(
    /(?:unit\s*sale\s*price|unit\s*price|rate)\s*[:.\-]?\s*(?:₹|rs\.?|rs|inr)?\s*[,]?\s*(\d{1,4}(?:\.\d{1,3})?)\s*(?:\/\s*(?:per\s*)?(g|kg|ml|l|gm|gms|litre|litres|100\s*g))?/i
  );
  if (!m) return {};
  const value = normalizeMoney(m[1]);
  if (!value) return {};
  const unit = (m[2] || '').toLowerCase();
  const raw = m[0].trim();
  return { value, raw };
}

function normalizeLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function isCleanBrandLine(line: string): boolean {
  if (!/^[A-Za-z]/.test(line)) return false;
  const junk = line.replace(/[^A-Za-z0-9&'.\-() ]/g, '');
  if (junk.length < line.length - 2) return false;
  if (/[:;"'`@#_=/\\]/u.test(line)) return false;
  return true;
}

function findBrandAndProductName(text: string): {
  brand_name?: string;
  product_name?: string;
} {
  const lines = normalizeLines(text);
  let brand: string | undefined;

  // Strongest signal first: an entity-style line ("X Pvt Ltd", "X Ltd").
  for (const line of lines) {
    const s = findBrandSuffix(line);
    if (s && s.length >= 3 && isCleanBrandLine(s) && !DECLARATION_KEYWORDS.test(line)) {
      brand = s;
      break;
    }
  }
  // Fallback: first capitalized title line that is not a section opener.
  if (!brand) {
    for (const line of lines) {
      if (line.length < 4 || line.length > 55 || DECLARATION_KEYWORDS.test(line)) {
        continue;
      }
      if (!/^[A-Za-z]/.test(line)) continue;
      if (BRAND_OPENER_WORDS.test(line)) continue;
      // Product-descriptor lines are NOT brands.
      if (/brush|brushes|paint|synthetic|hair|fiber|fibre|round|sq|tip|colour|colour|pens?|sheets?|cards?/i.test(line)) {
        continue;
      }
      if (!isCleanBrandLine(line)) continue;
      // Stitched photo lines often dress noise in parentheses ("Synthene
      // Hay (Roun)") — real brand fallbacks are short plain phrases.
      if (/[()]/.test(line)) continue;
      const alphaWords = line
        .replace(/[^A-Za-z ]/g, '')
        .split(/\s+/)
        .filter(Boolean);
      const upperCount = (line.match(/[A-Z]/g) || []).length;
      const lowerOnly = alphaWords.filter((w) => w === w.toLowerCase()).length;
      if (
        alphaWords.length >= 2 &&
        alphaWords.length <= 5 &&
        upperCount >= 2 &&
        lowerOnly <= 1 &&
        !/\d/.test(line)
      ) {
        brand = line;
        break;
      }
    }
  }

  let product: string | undefined;
  for (const line of lines) {
    if (line.length < 3 || line.length > 80 || DECLARATION_KEYWORDS.test(line)) continue;
    if (line === brand) continue;
    // A count+noun declaration ("4 Paint Brushes") or a short noun phrase.
    if (/^\d+\s+[A-Za-z]/.test(line)) {
      product = line;
      break;
    }
    const upperCount = (line.match(/[A-Z]/g) || []).length;
    const alphaWords = line.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean);
    if (alphaWords.length >= 2 && alphaWords.length <= 8 && upperCount >= 2) {
      product = line.replace(/[^A-Za-z0-9&'.,() \-]+/g, '').trim();
      break;
    }
    // fallthrough: any short non-declaration, non-marketing-bullet line
    if (alphaWords.length >= 2 && alphaWords.length <= 8 && !/^[*•\-•]/u.test(line)) {
      product = line.replace(/[^A-Za-z0-9&'.,() \-]+/g, '').trim();
      break;
    }
  }
  // Heuristic product-name cleanup (keep shortest meaningful noun phrase).
  if (product && product.length > 50) product = product.slice(0, 50);

  return { brand_name: brand, product_name: product };
}

// ----------------------------------------------------------------------------
// Per-pass parse
// ----------------------------------------------------------------------------

interface ParsedPass {
  extract: LocalOcrExtract;
  confidence: number;
  psm?: string;
  scale?: number;
  kind?: 'contrast' | 'binarize' | 'sauvola' | 'mirror' | 'rotate' | 'crop';
}

function parseText(text: string, confidence: number): ParsedPass {
  const lines = normalizeLines(text);
  const joined = cleanupText(lines.join(' '));

  const mrp = findMrp(joined);
  const netQty = findNetQuantity(joined);
  const exp = findExpiryDate(joined);
  let mfg = findMfgDate(joined);
  // Fallback: a bare "MMM YYYY" date (e.g. "Jan. 2020") with no expiry in the
  // immediate context is treated as the manufacture date.
  if (!mfg) {
    const bare = new RegExp(
      `\\b(${MONTHS.join('|')})[a-z]*\\.?\\s*,?\\s*(\\d{4})\\b`,
      'i'
    );
    const bm = text.match(bare);
    if (bm && bm.index !== undefined) {
      const before = text.slice(Math.max(0, bm.index - 30), bm.index);
      if (!/best\s*before|use\s*by|\bexp(?:iry)?\b/i.test(before)) {
        mfg = `${bm[1][0].toUpperCase()}${bm[1].slice(1)} ${bm[2]}`;
      }
    }
  }
  const country = findCountryOfOrigin(joined) ?? findCountryNearLicenceKindle(joined);
  const legal = extractLegalEntity(text);
  const manufacturerName = legal?.name ?? findManufacturerName(joined);
  const pinFallback = findAddressWithPincode(joined);
  const manufacturerAddress = legal?.address ?? pinFallback.address;
  const hasPincode = legal?.hasPincode || pinFallback.hasPincode;
  const { phone, email } = findConsumerCare(joined);
  const usp = findUnitSalePrice(joined);
  // Brand/product detection is LINE-based — use the raw newline text, not the
  // space-joined `joined` string (newlines carry the structure).
  const { brand_name, product_name } = findBrandAndProductName(text);

  const hasInclusiveOfTaxes =
    /incl(?:usive|usve)?[. ]*\s+of\s+all\s+taxes|inclusive\s+of\s+all\s+taxes|incl\.?\s*all\s*taxes/i.test(
      joined
    );

  const meaningful = !!(
    mrp ||
    netQty ||
    brand_name ||
    country ||
    product_name ||
    manufacturerAddress ||
    manufacturerName
  );
  if (!meaningful) return { extract: {}, confidence };

  const extract: LocalOcrExtract = {
    brand_name: brand_name,
    product_name,
    // Local OCR cannot reliably distinguish product taxonomy; default to
    // GENERAL so the rule engine never spuriously flags non-perishables
    // (stationery, electronics) with food/cosmetic expiry violations.
    category: 'GENERAL',
    mrp_raw: mrp?.raw,
    mrp_value: mrp?.value,
    has_inclusive_of_taxes: hasInclusiveOfTaxes || undefined,
    net_quantity_raw: netQty?.raw,
    net_quantity_value: netQty?.value,
    net_quantity_unit: netQty?.unit,
    unit_sale_price_raw: usp?.raw,
    unit_sale_price_value: usp?.value,
    mfg_or_packing_date_raw: mfg,
    expiry_date_raw: exp,
    country_of_origin: country,
    manufacturer_name: manufacturerName,
    manufacturer_address: manufacturerAddress,
    has_complete_pincode: hasPincode || undefined,
    consumer_care_phone: phone,
    consumer_care_email: email,
    ocrConfidence: confidence,
  };
  return { extract, confidence };
}

function mergePasses(a: ParsedPass, b: ParsedPass): ParsedPass {
  const merged: LocalOcrExtract = { ...a.extract };
  for (const key of Object.keys(b.extract) as (keyof LocalOcrExtract)[]) {
    const val = b.extract[key];
    if (val === undefined || val === null || val === '') continue;
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      (merged as Record<string, unknown>)[key] = val;
    } else if (
      key === 'brand_name' ||
      key === 'manufacturer_name' ||
      key === 'product_name'
    ) {
      // OCR garble varies per pass — keep the cleaner candidate. Reject
      // runaway noise (mirrored/binarised passes can emit long junk strings
      // or parenthesised fragments): count only candidates that look like
      // real phrases (<= 5 words, no parentheses), prefer more letters.
      const scoreCand = (s: string): number => {
        const clean = String(s).trim();
        if (clean.length > 40) return -1;
        const words = clean.split(/\s+/).filter(Boolean);
        if (words.length === 0 || words.length > 5) return -1;
        if (/[()]/.test(clean)) return -1;
        return (clean.match(/[A-Za-z]/g) || []).length;
      };
      // For product names prefer an explicit count phrase ("4 Paint Brushes")
      // over arbitrary stitched text lines from photo passes.
      if (key === 'product_name') {
        const aCount = /^\d+\s+[A-Za-z]/.test(String(merged[key]));
        const bCount = /^\d+\s+[A-Za-z]/.test(String(val));
        if (bCount && !aCount) {
          (merged as Record<string, unknown>)[key] = val;
          continue;
        }
        if (aCount && !bCount) continue;
      }
      const aS = scoreCand(String(merged[key]));
      const bS = scoreCand(String(val));
      if (bS > aS) {
        (merged as Record<string, unknown>)[key] = val;
      }
    } else if (key === 'mrp_value' && a.extract.mrp_value === undefined) {
      (merged as Record<string, unknown>)[key] = val;
    }
  }
  return { extract: merged, confidence: Math.max(a.confidence, b.confidence) };
}

// ----------------------------------------------------------------------------
// Public Entry
// ----------------------------------------------------------------------------

function completenessScore(e: LocalOcrExtract): number {
  let s = 0;
  if (e.mrp_value) s += 2;
  if (e.net_quantity_value) s += 2;
  if (e.country_of_origin) s += 1;
  if (e.mfg_or_packing_date_raw) s += 1;
  if (e.manufacturer_address) s += 1;
  if (e.consumer_care_phone || e.consumer_care_email) s += 1;
  if (e.brand_name) s += 1;
  if (e.has_complete_pincode) s += 1;
  if (e.product_name) s += 1;
  return s;
}

// Price precision: OCR passes disagree on digit values (₹-symbol fusion, pixel
// noise). A wrong MRP silently corrupts statutory verdicts, so whenever passes
// disagree we arbitrate deterministically: sparse single-line reads (psm 11)
// beat block reads, exact "X.XX" prices beat loose integers, higher resolution
// wins ties, and heavy-mangled passes (binarise/mirror) are penalised.
function kindPenalty(kind?: string): number {
  if (kind === 'binarize' || kind === 'sauvola') return 8;
  if (kind === 'crop') return 7;
  if (kind === 'mirror') return 4;
  if (kind === 'rotate') return 20;
  return 0;
}

function arbitrateMrp(passes: ParsedPass[], merged: ParsedPass): void {
  const cands = passes
    .filter((p) => p.extract.mrp_value !== undefined)
    .map((p) => ({
      value: p.extract.mrp_value as number,
      raw: p.extract.mrp_raw,
      psm: p.psm,
      scale: p.scale || 0,
      kind: p.kind,
    }));
  if (cands.length <= 1) return;
  const rank = (c: { psm?: string; raw?: string; kind?: string; value: number }) =>
    (c.psm === '11' ? 16 : 0) +
    (/\.\d{2}/.test(c.raw || '') ? 4 : 0) -
    kindPenalty(c.kind);
  cands.sort((x, y) => rank(y) - rank(x) || y.scale - x.scale);
  const best = cands[0];
  merged.extract.mrp_value = best.value;
  if (best.raw) merged.extract.mrp_raw = best.raw;
}

// Same consent for net quantity: prefer normal-contrast reads over binarised
// / mirrored ones, and among equal-quality reads prefer the LONGER value —
// OCR fragments drop digits ("95" -> "9"), so the fuller number is almost
// always the correct one.
function arbitrateNetQty(passes: ParsedPass[], merged: ParsedPass): void {
  const cands = passes
    .filter((p) => p.extract.net_quantity_value !== undefined)
    .map((p) => ({
      value: p.extract.net_quantity_value as number,
      unit: p.extract.net_quantity_unit,
      raw: p.extract.net_quantity_raw,
      scale: p.scale || 0,
      kind: p.kind,
    }));
  if (cands.length <= 1) return;
  const digits = (c: { value: number }) =>
    String(Math.trunc(c.value)).replace(/\D/g, '').length;
  const rank = (c: { kind?: string; value: number }) =>
    -kindPenalty(c.kind) + digits(c);
  cands.sort((x, y) => rank(y) - rank(x) || y.scale - x.scale);
  const best = cands[0];
  merged.extract.net_quantity_value = best.value;
  if (best.unit) merged.extract.net_quantity_unit = best.unit;
  if (best.raw) merged.extract.net_quantity_raw = best.raw;
}

async function runPasses(
  worker: Worker,
  preprocessed: Buffer,
  passes: ParsedPass[],
  psms: string[] = ['6', '11'],
  meta: { scale?: number; kind?: ParsedPass['kind'] } = {}
): Promise<{ score: number; extract: LocalOcrExtract; confidence: number }> {
  const localPasses: ParsedPass[] = [];
  for (const psm of psms) {
    try {
      await worker.setParameters({ tessedit_pageseg_mode: psm as any });
      const { data } = (await worker.recognize(preprocessed)) as any;
      const words: Array<{ confidence: number }> = (data.words || []) as Array<{
        confidence: number;
      }>;
      let confidences = words
        .map((w) => Number(w.confidence))
        .filter((c): c is number => Number.isFinite(c) && c > 0);
      const avgConf =
        confidences.length > 0
          ? confidences.reduce((s, c) => s + c, 0) / confidences.length / 100
          : Number.isFinite(Number(data.confidence)) && Number(data.confidence) > 0
          ? Number(data.confidence) / 100
          : 0;
      const pass = parseText(data.text || '', avgConf);
      pass.psm = psm;
      pass.scale = meta.scale;
      pass.kind = meta.kind ?? 'contrast';
      if (Object.keys(pass.extract).length > 0) localPasses.push(pass);
    } catch (err) {
      console.warn(`[LocalOCR] psm ${psm} pass failed:`, err);
    }
  }
  if (localPasses.length > 0) {
    passes.push(...localPasses);
  }
  const merged = localPasses.reduce((acc, p) => mergePasses(acc, p), {
    extract: {},
    confidence: 0,
  });
  return {
    score: completenessScore(merged.extract),
    extract: merged.extract,
    confidence: merged.confidence,
  };
}

export async function extractFromImageBuffer(
  imageBuffer: Buffer
): Promise<LocalOcrExtract | null> {
  try {
    const worker = await getWorker();
    const passes: ParsedPass[] = [];

    // Scale targets relative to the native image: tiny uploads (thumbnails,
    // e-commerce crops) don't benefit from huge upscales — they just slow the
    // LSTM down without adding information.
    const nativeMeta = await sharp(imageBuffer, { failOn: 'none' }).metadata();
    const nativeLong =
      Math.max(nativeMeta.width || 0, nativeMeta.height || 0) || 0;
    const target = (desired: number, mult: number, minLen: number) =>
      nativeLong > 0
        ? Math.min(desired, Math.max(minLen, Math.round(nativeLong * mult)))
        : desired;

    // Attempt 1: balanced scale/contrast (fast path).
    // - psm 6 (block) reads the whole label: brand, address, product lines.
    // - psm 11 (sparse) isolates short declaration lines and is run at a
    //   resolution high enough to keep digit glyphs separated — photographed
    //   ₹-symbols routinely fuse with the leading digit below a ~2800px long
    //   side ("₹55" -> "355"), so the price line is deliberately read high.
    //   A mis-priced MRP silently corrupts statutory verdicts, worth the cost.
    const preprocessedA = await preprocessForOcr(imageBuffer, {
      targetLongSide: 2400,
      contrast: 0.4,
    });
    const rA = await runPasses(worker, preprocessedA, passes, ['6'], {
      scale: 2400,
    });
    const preprocessedP = await preprocessForOcr(imageBuffer, {
      targetLongSide: 2800,
      contrast: 0.5,
    });
    const rP = await runPasses(worker, preprocessedP, passes, ['11'], {
      scale: 2800,
    });

    let baseAcc: ParsedPass = {
      extract: { ...rA.extract },
      confidence: rA.confidence,
      psm: '6',
      scale: 2400,
    };
    baseAcc = mergePasses(baseAcc, {
      extract: rP.extract,
      confidence: rP.confidence,
      psm: '11',
      scale: 2800,
    });
    const baseScore = completenessScore(baseAcc.extract);

    // Attempt 2 (hard-case rescue): only worth it when a core declaration is
// missing AND the base read is not already strong. A high-scoring, confident
// base read that merely lacks net quantity usually means the product carries
// no net-quantity declaration (e.g. stationery) — grinding extra passes would
// only add seconds without changing the honest REVIEW outcome.
    const missingCore = !(baseAcc.extract.mrp_value && baseAcc.extract.net_quantity_value);
    const strongBase = baseScore >= 7 && baseAcc.confidence >= 0.55;
    if (missingCore && !strongBase) {
      // Sweep through independent preprocessing hypotheses. Each one targets a
      // DIFFERENT failure mode (shadow/low-contrast ink, selfie mirror, upside
      // down phone, cylindrical wrap curvature) so different photos are rescued
      // by the right pass — no hypothesis is image-specific.
      const rescueTargets: Array<{
        opts: PreprocessOptions;
        psms: string[];
        scale: number;
        kind: ParsedPass['kind'];
      }> = [
        // Shadowed / low-contrast labels: global Otsu split.
        { opts: { targetLongSide: target(2600, 2.0, 1600), contrast: 0.5, binarize: true }, psms: ['3'], scale: 2600, kind: 'binarize' },
        // Selfie-mode phone photos mirror the label horizontally.
        { opts: { targetLongSide: target(2400, 2.0, 1600), mirror: true }, psms: ['6', '11'], scale: 2400, kind: 'mirror' },
        // Orange/light-black inks + gradient shadows: local adaptive threshold.
        { opts: { targetLongSide: target(2400, 2.0, 1600), adaptive: true }, psms: ['6', '11'], scale: 2400, kind: 'sauvola' },
        // Cylinder/wrap: the middle band is the least curved — read it large.
        { opts: { targetLongSide: target(2800, 2.5, 2000), cropCenterRatio: 0.55 }, psms: ['11', '6'], scale: 2800, kind: 'crop' },
      ];
      for (const r of rescueTargets) {
        const preprocessed = await preprocessForOcr(imageBuffer, r.opts);
        const mid = await runPasses(worker, preprocessed, passes, r.psms, {
          scale: r.scale,
          kind: r.kind,
        });
        // Both statutory cores found -> enough, stop grinding the LSTM.
        if (mid.extract.mrp_value && mid.extract.net_quantity_value) break;
      }
    }

    if (passes.length === 0) return null;

    const merged = passes.reduce((acc, p) => mergePasses(acc, p));
    arbitrateMrp(passes, merged);
    arbitrateNetQty(passes, merged);
    const { extract: final, confidence } = merged;

    const coreFieldsRead = !!(final.mrp_value && final.net_quantity_value);
    // A photo where the MRP + net quantity could NOT both be read must not
    // trigger an auto statutory FAIL; the rules see ocrComplete=false and
    // abstain (honest REVIEW pending micro-verification).
    final.ocrComplete = coreFieldsRead && confidence >= 0.3;
    final.ocrConfidence = confidence;
    // Default category so expiry-sensitive statutory checks know this is not a
    // perishable item when no vision category was provided (offline local OCR).
    if (!final.category) {
      final.category = 'GENERAL';
    }

    console.log('[LocalOCR] Extracted from uploaded image:', {
      brand: final.brand_name,
      product: final.product_name,
      mrp: final.mrp_value,
      netQty: final.net_quantity_value,
      unit: final.net_quantity_unit,
      mfg: final.mfg_or_packing_date_raw,
      coo: final.country_of_origin,
      address: final.manufacturer_address,
      pincode: final.has_complete_pincode,
      care: final.consumer_care_phone || final.consumer_care_email,
      ocrComplete: final.ocrComplete,
      confidence: confidence?.toFixed(2),
    });

    return final;
  } catch (err) {
    console.warn('[LocalOCR] OCR failed:', err);
    return null;
  }
}

export async function disposeLocalOcr(): Promise<void> {
  if (workerPromise) {
    try {
      const w = await workerPromise;
      await w.terminate();
    } catch {}
    workerPromise = null;
  }
}