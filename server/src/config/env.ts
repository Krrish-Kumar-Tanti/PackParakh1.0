import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'packparakh_super_secret_jwt_key_2026',
  DB_PATH: process.env.DB_PATH
    ? (path.isAbsolute(process.env.DB_PATH)
        ? process.env.DB_PATH
        : path.resolve(__dirname, '../../', process.env.DB_PATH))
    : path.resolve(__dirname, '../database/packparakh.db'),
  UPLOAD_DIR: process.env.UPLOAD_DIR
    ? (path.isAbsolute(process.env.UPLOAD_DIR)
        ? process.env.UPLOAD_DIR
        : path.resolve(__dirname, '../../', process.env.UPLOAD_DIR))
    : path.resolve(__dirname, '../../uploads'),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  SMTP_EMAIL: process.env.SMTP_EMAIL || 'packparakh.doca@gmail.com',
  SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD || '',
  isProduction: process.env.NODE_ENV === 'production',
};
