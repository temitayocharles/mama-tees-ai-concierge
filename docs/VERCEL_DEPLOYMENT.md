# Vercel Deployment

## Production URL

```text
https://mama-tees-ai-concierge.vercel.app
```

## Purpose

Vercel hosts the Node.js backend that receives authenticated call-log requests from the voice layer or optional automation workflow.

The backend validates payloads, enforces business rules, and writes accepted records to Google Sheets.

## Endpoints

```text
GET  /healthz
GET  /readiness
POST /api/call-logs
```

## Required environment categories

Configure environment values in Vercel, not in source control.

Required categories:

- webhook authentication value,
- log destination,
- Google Sheets spreadsheet ID,
- Google Sheets tab name,
- Google Workload Identity Federation configuration,
- service account impersonation target,
- business timezone.

Do not use Google private keys for production.

## Validation

Health check:

```bash
curl https://mama-tees-ai-concierge.vercel.app/healthz
```

Readiness check:

```bash
curl https://mama-tees-ai-concierge.vercel.app/readiness
```

Expected readiness:

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

If a deployment fails:

1. Stop additional changes.
2. Confirm the failing endpoint and response code.
3. Review deployment logs without exposing environment values.
4. Roll back to the previous healthy Vercel deployment.
5. Re-run readiness checks.
6. Re-run a safe call-log validation.
7. Confirm a Google Sheet row is written.
8. Document root cause and follow-up action.

## Security

- Do not expose environment values in screenshots or recordings.
- Do not paste environment values into GitHub issues or pull requests.
- Rotate any exposed value.
- Keep Google authentication on Workload Identity Federation.
