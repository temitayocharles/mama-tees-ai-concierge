import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.x-webhook-secret',
      'GOOGLE_PRIVATE_KEY',
      'WEBHOOK_SECRET'
    ],
    censor: '[REDACTED]'
  }
});
