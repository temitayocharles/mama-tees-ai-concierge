import { Router } from 'express';
import { config } from '../config.js';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

healthRouter.get('/readiness', (_req, res) => {
  res.status(200).json({
    status: 'ready',
    log_destination: config.LOG_DESTINATION,
    business_timezone: config.BUSINESS_TIMEZONE
  });
});
