import 'dotenv/config';
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  CORS_ORIGIN: z.string().default('*'),
  WEBHOOK_SECRET: z.string().default(''),
  LOG_DESTINATION: z.enum(['local_jsonl', 'google_sheets']).default('local_jsonl'),
  LOCAL_LOG_PATH: z.string().default('storage/call-logs.jsonl'),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().optional().default(''),
  GOOGLE_SHEETS_TAB_NAME: z.string().default('Call Logs'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional().default(''),
  GOOGLE_PRIVATE_KEY: z.string().optional().default(''),
  BUSINESS_TIMEZONE: z.string().default('Africa/Lagos')
});

export const config = configSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  LOG_DESTINATION: process.env.LOG_DESTINATION,
  LOCAL_LOG_PATH: process.env.LOCAL_LOG_PATH,
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  GOOGLE_SHEETS_TAB_NAME: process.env.GOOGLE_SHEETS_TAB_NAME,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  BUSINESS_TIMEZONE: process.env.BUSINESS_TIMEZONE
});

export function isWebhookSecretConfigured(): boolean {
  return config.WEBHOOK_SECRET.trim().length >= 12;
}

export function isGoogleSheetsConfigured(): boolean {
  if (config.LOG_DESTINATION !== 'google_sheets') return true;

  return Boolean(
    config.GOOGLE_SHEETS_SPREADSHEET_ID.trim() &&
      config.GOOGLE_SHEETS_TAB_NAME.trim() &&
      config.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim() &&
      config.GOOGLE_PRIVATE_KEY.trim()
  );
}

export function requireGoogleSheetsConfig(): void {
  if (isGoogleSheetsConfigured()) return;

  const missing = [
    ['GOOGLE_SHEETS_SPREADSHEET_ID', config.GOOGLE_SHEETS_SPREADSHEET_ID],
    ['GOOGLE_SHEETS_TAB_NAME', config.GOOGLE_SHEETS_TAB_NAME],
    ['GOOGLE_SERVICE_ACCOUNT_EMAIL', config.GOOGLE_SERVICE_ACCOUNT_EMAIL],
    ['GOOGLE_PRIVATE_KEY', config.GOOGLE_PRIVATE_KEY]
  ].filter(([, value]) => !value?.trim());

  throw new Error(`Missing Google Sheets configuration: ${missing.map(([name]) => name).join(', ')}`);
}
