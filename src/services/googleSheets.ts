import { google } from 'googleapis';
import { config, requireGoogleSheetsConfig } from '../config.js';
import type { CallLogRecord, LogSink } from '../types.js';

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

function normalizePrivateKey(rawKey: string): string {
  return rawKey.replace(/\\n/g, '\n');
}

function getSheetsClient() {
  requireGoogleSheetsConfig();

  const auth = new google.auth.JWT({
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: normalizePrivateKey(config.GOOGLE_PRIVATE_KEY),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
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
  async append(record: CallLogRecord): Promise<void> {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `'${config.GOOGLE_SHEETS_TAB_NAME}'!A:V`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [recordToSheetRow(record)]
      }
    });
  }
}

export async function seedGoogleSheetHeader(): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `'${config.GOOGLE_SHEETS_TAB_NAME}'!A1:V1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [Array.from(SHEET_COLUMNS)]
    }
  });
}
