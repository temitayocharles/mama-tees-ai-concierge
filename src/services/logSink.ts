import { mkdir, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { config } from '../config.js';
import type { CallLogRecord, LogSink } from '../types.js';
import { GoogleSheetsLogSink } from './googleSheets.js';

export class LocalJsonlLogSink implements LogSink {
  constructor(private readonly filePath: string) {}

  async append(record: CallLogRecord): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(record)}\n`, 'utf8');
  }
}

export function createLogSink(): LogSink {
  if (config.LOG_DESTINATION === 'google_sheets') {
    return new GoogleSheetsLogSink();
  }

  return new LocalJsonlLogSink(config.LOCAL_LOG_PATH);
}
