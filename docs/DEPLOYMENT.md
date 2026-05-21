# Deployment

## Production backend

```text
https://mama-tees-ai-concierge.vercel.app
```

The backend is deployed on Vercel and exposes:

```text
GET  /healthz
GET  /readiness
POST /api/call-logs
```

## Runtime configuration

Required production configuration must be stored in the deployment platform environment, not in source control.

Required categories:

- webhook authentication value,
- Google Workload Identity Federation configuration,
- Google service account impersonation target,
- Google Sheets spreadsheet ID and sheet name,
- business timezone,
- log destination.

Do not commit `.env`.

## Google authentication

Production uses:

```text
Vercel OIDC
  -> Google Workload Identity Federation
  -> service account impersonation
  -> Google Sheets append
```

Do not use Google private keys for production.

## Validation commands

Install dependencies:

```bash
npm ci
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Optional audit:

```bash
npm audit --omit=dev
```

## Production readiness check

```bash
curl https://mama-tees-ai-concierge.vercel.app/readiness
```

Expected result:

```json
{
  "status": "ready",
  "webhook_auth_configured": true,
  "log_destination": "google_sheets",
  "google_sheets_configured": true,
  "google_sheets_auth_mode": "workload_identity",
  "business_timezone": "Africa/Lagos"
}
```

## Rollback

If a backend deployment breaks request logging:

1. Stop new changes.
2. Confirm `/healthz` and `/readiness` status.
3. Check Vercel deployment status.
4. Roll back to the previous known-good Vercel deployment.
5. Re-run backend logging validation.
6. Verify Google Sheets receives a new safe validation row.
7. Document the incident and root cause.

## Security controls

- Keep all credentials out of GitHub.
- Keep all credentials out of issue comments, screenshots, transcripts, and recordings.
- Rotate any value that is accidentally exposed.
- Maintain least privilege on the Google service account.
- Keep Google Sheet access scoped to required reviewers only.
