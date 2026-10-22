
// Handles high-resolution packaging images and vector PDF artworks


import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';

// Ensure disk upload directory exists if files are persisted
if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

// ----------------------------------------------------------------------------
// 1. Memory Storage Engine (Primary)
// Keeps image/pdf buffer in memory (req.file.buffer) for instant SHA-256
// evidence hashing, Gemini Vision OCR, and court-admissible archiving.
// ----------------------------------------------------------------------------
const memoryStorage = multer.memoryStorage();

// ----------------------------------------------------------------------------
// 2. Disk Storage Engine (Secondary - for static asset serving)
// ----------------------------------------------------------------------------
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `pack-${uniqueSuffix}${ext}`);
  },
});

// ----------------------------------------------------------------------------
// 3. File Filter Validation
// Validates packaging images (JPEG, PNG, WEBP) and vector PDFs (Artwork mode)
// ----------------------------------------------------------------------------
const packagingFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // Trust the declared mimetype, but ALSO fall back to the file extension —
  // some browsers/OS file pickers send application/octet-stream for .webp/.png.
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const extOk = ['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(ext);
  const isImage =
    APP_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.mimetype) ||
    (extOk && ['jpg', 'jpeg', 'png', 'webp'].includes(ext));
  const isPdf =
    APP_CONSTANTS.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype) || (extOk && ext === 'pdf');

  if (isImage || isPdf) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file format: ${file.mimetype}. Allowed formats: JPEG, PNG, WEBP, and PDF.`
      )
    );
  }
};

// ----------------------------------------------------------------------------
// 4. Multer Instance Configurations
// ----------------------------------------------------------------------------
export const memoryUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: APP_CONSTANTS.MAX_UPLOAD_SIZE_MB * 1024 * 1024, // 15 MB
  },
  fileFilter: packagingFileFilter,
});

export const diskUpload = multer({
  storage: diskStorage,
  limits: {
    fileSize: APP_CONSTANTS.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
  fileFilter: packagingFileFilter,
});

// ----------------------------------------------------------------------------
// 5. Named Express Route Handlers
// ----------------------------------------------------------------------------

/**
 * Multi-photo upload for physical packaging scan (/api/scan/physical)
 * Accepts up to 6 packaging photos (front, back, MRP panel, etc.) via the
 * repeated multipart field 'image'. Buffers accessed in controller via:
 * req.files (Express.Multer.File[]) — or req.file for single-photo fallback.
 */
export const uploadPackagingImage = memoryUpload.array('image', 6);

/**
 * Single vector PDF artwork upload (/api/scan/artwork)
 * Access buffer in controller via: req.file.buffer
 */
export const uploadArtworkPdf = memoryUpload.single('pdf');

/**
 * Flexible packaging upload (accepts field name 'file', 'image', or 'pdf')
 */
export const uploadFlexiblePackaging = memoryUpload.single('file');
