import { beforeEach, describe, expect, it, vi } from 'vitest';

const ENV_KEYS = [
  'NODE_ENV',
  'WEBHOOK_SECRET',
  'LOG_DESTINATION',
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SHEETS_TAB_NAME',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GCP_PROJECT_ID',
  'GCP_PROJECT_NUMBER',
  'GCP_SERVICE_ACCOUNT_EMAIL',
  'GCP_WORKLOAD_IDENTITY_POOL_ID',
  'GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID'
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
    expect(() => requireGoogleSheetsConfig()).toThrow(/Google auth config/);
  });

  it('marks Google Sheets logging as configured for legacy JSON-key auth', async () => {
    process.env.NODE_ENV = 'test';
    process.env.WEBHOOK_SECRET = 'test-secret-123456';
    process.env.LOG_DESTINATION = 'google_sheets';
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8';
    process.env.GOOGLE_SHEETS_TAB_NAME = 'Call Logs';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'service-account@example.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nplaceholder\\n-----END PRIVATE KEY-----\\n';

    const { getGoogleSheetsAuthMode, isGoogleSheetsConfigured } = await import('../src/config.js');

    expect(isGoogleSheetsConfigured()).toBe(true);
    expect(getGoogleSheetsAuthMode()).toBe('json_key');
  });

  it('marks Google Sheets logging as configured for Vercel OIDC workload identity auth', async () => {
    process.env.NODE_ENV = 'test';
    process.env.WEBHOOK_SECRET = 'test-secret-123456';
    process.env.LOG_DESTINATION = 'google_sheets';
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8';
    process.env.GOOGLE_SHEETS_TAB_NAME = 'Call Logs';
    process.env.GCP_PROJECT_ID = 'project-c7e10dc9-517f-466b-9b6';
    process.env.GCP_PROJECT_NUMBER = '449038597841';
    process.env.GCP_SERVICE_ACCOUNT_EMAIL = 'voice-agent-mama-tee@example.iam.gserviceaccount.com';
    process.env.GCP_WORKLOAD_IDENTITY_POOL_ID = 'vercel';
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID = 'vercel';

    const { getGoogleSheetsAuthMode, isGoogleSheetsConfigured } = await import('../src/config.js');

    expect(isGoogleSheetsConfigured()).toBe(true);
    expect(getGoogleSheetsAuthMode()).toBe('workload_identity');
  });
});
