import './config/env'; // must be first: loads .env before any module reads process.env

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { pool } from './database/pool';
import { apiLimiter } from './middleware/rateLimit';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Required behind ALB/CloudFront: without this, req.ip and rate-limit
// keying see the load balancer's IP instead of the real client IP.
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use('/api', apiLimiter);

// Health check before routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString() 
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 GO2Cloud Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Auto Scaling sends SIGTERM before killing an instance on scale-down.
// Without this, in-flight requests get cut off mid-response.
function gracefulShutdown(signal: string) {
  console.log(`${signal} received: closing server gracefully`);
  server.close(() => {
    pool.end().then(() => {
      console.log('Server and DB pool closed');
      process.exit(0);
    });
  });
  // Force-exit if connections don't close within 10s
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
