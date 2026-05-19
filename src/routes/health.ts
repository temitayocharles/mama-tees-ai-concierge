import { Router } from 'express';
import { config, isWebhookSecretConfigured } from '../config.js';

export const healthRouter = Router();

function isGoogleSheetsConfigured(): boolean {
  if (config.LOG_DESTINATION !== 'google_sheets') return true;
  return Boolean(
    config.GOOGLE_SHEETS_SPREADSHEET_ID &&
      config.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      config.GOOGLE_PRIVATE_KEY
  );
}

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
