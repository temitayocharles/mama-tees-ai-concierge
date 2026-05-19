import { google } from 'googleapis';
import { ExternalServiceError } from '../errors.js';
import { config, getGoogleServiceAccountEmail } from '../config.js';

const CLOUD_PLATFORM_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const STS_TOKEN_URL = 'https://sts.googleapis.com/v1/token';

interface TokenExchangeResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface ServiceAccountAccessTokenResponse {
  accessToken?: string;
  expireTime?: string;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function getWorkloadIdentityAudience(): string {
  return `//iam.googleapis.com/projects/${config.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${config.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${config.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ExternalServiceError('Failed to append call log', 'GOOGLE_AUTH_RESPONSE_INVALID', 502, response.status);
  }
}

async function exchangeVercelOidcToken(vercelOidcToken: string): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    audience: getWorkloadIdentityAudience(),
    scope: CLOUD_PLATFORM_SCOPE,
    requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    subject_token: vercelOidcToken
  });

  const response = await fetch(STS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const payload = await readJsonResponse<TokenExchangeResponse>(response);

  if (!response.ok || !payload.access_token) {
    throw new ExternalServiceError('Failed to append call log', 'GOOGLE_WORKLOAD_IDENTITY_TOKEN_EXCHANGE_FAILED', 502, response.status);
  }

  return payload.access_token;
}

async function impersonateServiceAccount(federatedAccessToken: string): Promise<{ accessToken: string; expiryDate?: number }> {
  const serviceAccountEmail = getGoogleServiceAccountEmail();
  const url = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(serviceAccountEmail)}:generateAccessToken`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${federatedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      scope: [SHEETS_SCOPE],
      lifetime: '3600s'
    })
  });
  const payload = await readJsonResponse<ServiceAccountAccessTokenResponse>(response);

  if (!response.ok || !payload.accessToken) {
    const code = response.status === 403
      ? 'GOOGLE_WORKLOAD_IDENTITY_PERMISSION_DENIED'
      : 'GOOGLE_SERVICE_ACCOUNT_IMPERSONATION_FAILED';
    throw new ExternalServiceError('Failed to append call log', code, 502, response.status);
  }

  return {
    accessToken: payload.accessToken,
    expiryDate: payload.expireTime ? Date.parse(payload.expireTime) : undefined
  };
}

export async function createWorkloadIdentitySheetsClient(vercelOidcToken?: string) {
  if (!vercelOidcToken) {
    throw new ExternalServiceError('Failed to append call log', 'VERCEL_OIDC_TOKEN_MISSING', 502);
  }

  const federatedAccessToken = await exchangeVercelOidcToken(vercelOidcToken);
  const serviceAccountToken = await impersonateServiceAccount(federatedAccessToken);
  const auth = new google.auth.OAuth2();

  auth.setCredentials({
    access_token: serviceAccountToken.accessToken,
    expiry_date: serviceAccountToken.expiryDate
  });

  return google.sheets({ version: 'v4', auth });
}
