import { beforeEach, describe, expect, it, vi } from 'vitest';

const ENV_KEYS = [
  'NODE_ENV',
  'WEBHOOK_SECRET',
  'LOG_DESTINATION',
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SHEETS_TAB_NAME',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
] as const;

function resetEnv(): void {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

describe('configuration readiness helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    resetEnv();
  });

  it('treats local JSONL logging as Google Sheets ready', async () => {
    process.env.NODE_ENV = 'test';
    process.env.WEBHOOK_SECRET = 'test-secret-123456';
    process.env.LOG_DESTINATION = 'local_jsonl';

    const { isGoogleSheetsConfigured } = await import('../src/config.js');

    expect(isGoogleSheetsConfigured()).toBe(true);
  });

  it('marks Google Sheets logging as not configured when credentials are missing', async () => {
    process.env.NODE_ENV = 'test';
    process.env.WEBHOOK_SECRET = 'test-secret-123456';
    process.env.LOG_DESTINATION = 'google_sheets';
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8';
    process.env.GOOGLE_SHEETS_TAB_NAME = 'Call Logs';

    const { isGoogleSheetsConfigured, requireGoogleSheetsConfig } = await import('../src/config.js');

    expect(isGoogleSheetsConfigured()).toBe(false);
    expect(() => requireGoogleSheetsConfig()).toThrow(/GOOGLE_SERVICE_ACCOUNT_EMAIL/);
    expect(() => requireGoogleSheetsConfig()).toThrow(/GOOGLE_PRIVATE_KEY/);
  });

  it('marks Google Sheets logging as configured when all required fields are present', async () => {
    process.env.NODE_ENV = 'test';
    process.env.WEBHOOK_SECRET = 'test-secret-123456';
    process.env.LOG_DESTINATION = 'google_sheets';
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8';
    process.env.GOOGLE_SHEETS_TAB_NAME = 'Call Logs';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'service-account@example.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nplaceholder\\n-----END PRIVATE KEY-----\\n';

    const { isGoogleSheetsConfigured } = await import('../src/config.js');

    expect(isGoogleSheetsConfigured()).toBe(true);
  });
});
