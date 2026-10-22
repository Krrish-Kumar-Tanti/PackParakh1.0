import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { env } from './config/env';
import { APP_CONSTANTS } from './config/constants';
import { initDb, closeDb } from './database/db';
import scanRoutes from './routes/scanRoutes';
import authRoutes from './routes/authRoutes';
import systemRoutes from './routes/systemRoutes';
import reportRoutes from './routes/reportRoutes';
import acknowledgementRoutes from './routes/acknowledgementRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

// Ensure upload directory exists
if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

// Global Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploaded assets
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Initialize Database & Schema
initDb();

// ----------------------------------------------------------------------------
// API Route Handlers
// ----------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/rules', systemRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/v1', acknowledgementRoutes);
app.use('/api', acknowledgementRoutes);

// ----------------------------------------------------------------------------
// Operational Status & Health Routes
// ----------------------------------------------------------------------------

/**
 * Health check endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

/**
 * GovTech Operational Telemetry (Powers client status banner)
 * Contract defined in Backend_Lead.md Section 4 & owned by Swetakshi
 * (systemController.ts — mounted via /api/system above).
 */

/**
 * Root Info Route
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: APP_CONSTANTS.APP_NAME,
    problemStatement: 'SIH 26034',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    version: '1.0.0',
    documentation: '/api/system/status',
  });
});

// ----------------------------------------------------------------------------
// Global Error Handler
// ----------------------------------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.isProduction ? 'An unexpected error occurred' : err.message,
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------------------------------
// Start Server (only when run directly as entrypoint)
// ----------------------------------------------------------------------------
let server: ReturnType<typeof app.listen> | null = null;

export function startServer(port: number = env.PORT) {
  if (!server) {
    server = app.listen(port, () => {
      console.log(`=======================================================`);
      console.log(`🚀 ${APP_CONSTANTS.APP_NAME} Server Running`);
      console.log(`📡 URL: http://localhost:${port}`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log(`📊 Status Telemetry: http://localhost:${port}/api/system/status`);
      console.log(`⚙️  Environment: ${env.NODE_ENV}`);
      console.log(`=======================================================`);
    });
  }
  return server;
}

if (require.main === module) {
  startServer();
}

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Closing server & database...`);
  if (server) {
    server.close(() => {
      closeDb();
      console.log('[Server] Server shut down cleanly.');
      process.exit(0);
    });
  } else {
    closeDb();
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export { app, server };
export default app;
