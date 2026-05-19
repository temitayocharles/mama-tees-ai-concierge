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

describe('Google Sheets helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    resetEnv();
    process.env.NODE_ENV = 'test';
    process.env.WEBHOOK_SECRET = 'test-secret-123456';
    process.env.LOG_DESTINATION = 'local_jsonl';
  });

  it('normalizes escaped private-key newlines', async () => {
    const { normalizePrivateKey } = await import('../src/services/googleSheets.js');

    expect(normalizePrivateKey('-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n')).toBe(
      '-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n'
    );
  });

  it('normalizes JSON-quoted private-key values copied from service-account JSON', async () => {
    const { normalizePrivateKey } = await import('../src/services/googleSheets.js');

    const raw = JSON.stringify('-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n');

    expect(normalizePrivateKey(raw)).toBe('-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n');
  });
});
