import { google } from 'googleapis';
import { ExternalServiceError } from '../errors.js';
import { config, getGoogleSheetsAuthMode, requireGoogleSheetsConfig } from '../config.js';
import type { CallLogRecord, LogContext, LogSink } from '../types.js';
import { createWorkloadIdentitySheetsClient } from './googleWorkloadIdentity.js';

export const SHEET_COLUMNS = [
  'id',
  'timestamp',
  'request_type',
  'customer_name',
  'phone_number',
  'order_details',
  'order_total',
  'fulfillment_type',
  'delivery_address',
  'delivery_area',
  'delivery_fee',
  'reservation_date',
  'reservation_time',
  'guest_count',
  'callback_reason',
  'notes',
  'confirmation_summary',
  'status',
  'source',
  'call_id',
  'validation_warnings',
  'raw_transcript'
] as const;

interface GoogleApiErrorShape {
  code?: number | string;
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      error?: string;
      error_description?: string;
      message?: string;
    };
  };
}

export function normalizePrivateKey(rawKey: string): string {
  let normalized = rawKey.trim();

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    try {
      const parsed = JSON.parse(normalized) as unknown;
      if (typeof parsed === 'string') {
        normalized = parsed;
      }
    } catch {
      normalized = normalized.slice(1, -1);
    }
  }

  return normalized
    .replace(/\\r\\n/g, '\n')
    .replace(/\\\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n');
}

function getErrorText(error: GoogleApiErrorShape): string {
  return [
    error.message,
    error.response?.data?.message,
    error.response?.data?.error,
    error.response?.data?.error_description,
    typeof error.code === 'string' ? error.code : undefined
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getNumericUpstreamStatus(error: GoogleApiErrorShape): number | undefined {
  return error.response?.status ?? error.status ?? (typeof error.code === 'number' ? error.code : undefined);
}

function classifyGoogleSheetsError(error: unknown): { code: string; upstreamStatus?: number } {
  if (error instanceof ExternalServiceError) {
    return { code: error.publicCode, upstreamStatus: error.upstreamStatus };
  }

  const googleError = error as GoogleApiErrorShape;
  const upstreamStatus = getNumericUpstreamStatus(googleError);
  const text = getErrorText(googleError);

  if (
    text.includes('private key') ||
    text.includes('pem') ||
    text.includes('decoder') ||
    text.includes('asn') ||
    text.includes('no start line') ||
    text.includes('err_ossl_unsupported')
  ) {
    return { code: 'GOOGLE_PRIVATE_KEY_INVALID', upstreamStatus };
  }

  if (upstreamStatus === 401 || text.includes('invalid_grant') || text.includes('invalid jwt')) {
    return { code: 'GOOGLE_AUTH_FAILED', upstreamStatus };
  }

  if (upstreamStatus === 403 || text.includes('permission')) {
    return { code: 'GOOGLE_SHEETS_PERMISSION_DENIED', upstreamStatus };
  }

  if (upstreamStatus === 404 || text.includes('not found')) {
    return { code: 'GOOGLE_SHEETS_TARGET_NOT_FOUND', upstreamStatus };
  }

  if (upstreamStatus === 400 || text.includes('unable to parse range')) {
    return { code: 'GOOGLE_SHEETS_REQUEST_INVALID', upstreamStatus };
  }

  return { code: 'GOOGLE_SHEETS_APPEND_FAILED', upstreamStatus };
}

function getJsonKeySheetsClient() {
  const auth = new google.auth.JWT({
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: normalizePrivateKey(config.GOOGLE_PRIVATE_KEY),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

async function getSheetsClient(context?: LogContext) {
  requireGoogleSheetsConfig();

  if (getGoogleSheetsAuthMode() === 'workload_identity') {
    return createWorkloadIdentitySheetsClient(context?.vercelOidcToken);
  }

  return getJsonKeySheetsClient();
}

export function recordToSheetRow(record: CallLogRecord): string[] {
  return SHEET_COLUMNS.map((column) => {
    const value = column === 'validation_warnings'
      ? record.validation_warnings.join(' | ')
      : record[column as keyof CallLogRecord];

    if (value === undefined || value === null) return '';
    return typeof value === 'string' ? value : String(value);
  });
}

export class GoogleSheetsLogSink implements LogSink {
  async append(record: CallLogRecord, context?: LogContext): Promise<void> {
    try {
      const sheets = await getSheetsClient(context);
      await sheets.spreadsheets.values.append({
        spreadsheetId: config.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: `'${config.GOOGLE_SHEETS_TAB_NAME}'!A:V`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [recordToSheetRow(record)]
        }
      });
    } catch (error) {
      const classified = classifyGoogleSheetsError(error);
      throw new ExternalServiceError(
        'Failed to append call log',
        classified.code,
        502,
        classified.upstreamStatus
      );
    }
  }
}

export async function seedGoogleSheetHeader(): Promise<void> {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `'${config.GOOGLE_SHEETS_TAB_NAME}'!A1:V1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [Array.from(SHEET_COLUMNS)]
    }
  });
}
