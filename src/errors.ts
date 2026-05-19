export interface SanitizedErrorResponse {
  statusCode: number;
  error: string;
  code: string;
  upstream_status?: number;
}

export class ExternalServiceError extends Error {
  constructor(
    message: string,
    public readonly publicCode: string,
    public readonly statusCode = 502,
    public readonly upstreamStatus?: number
  ) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

export function getSanitizedErrorResponse(error: unknown): SanitizedErrorResponse | null {
  if (!(error instanceof ExternalServiceError)) return null;

  return {
    statusCode: error.statusCode,
    error: error.message,
    code: error.publicCode,
    upstream_status: error.upstreamStatus
  };
}
