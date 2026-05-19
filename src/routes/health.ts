import { Router } from 'express';
import { config, isGoogleSheetsConfigured, isWebhookSecretConfigured } from '../config.js';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

healthRouter.get('/readiness', (_req, res) => {
  const checks = {
    webhook_auth_configured: isWebhookSecretConfigured(),
    log_destination: config.LOG_DESTINATION,
    google_sheets_configured: isGoogleSheetsConfigured(),
    business_timezone: config.BUSINESS_TIMEZONE
  };

  const ready = checks.webhook_auth_configured && checks.google_sheets_configured;

  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'not_ready',
    ...checks
  });
});
