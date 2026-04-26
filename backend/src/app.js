import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true
    })
  );
  app.use(compression());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(globalRateLimiter);

  const base = `/api/${env.apiVersion}`;
  app.use(`${base}/health`, healthRoutes);
  app.use(`${base}/auth`, authRoutes);
  app.use(`${base}/chat`, chatRoutes);
  app.use(`${base}/history`, historyRoutes);
  app.use(`${base}/user`, userRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
