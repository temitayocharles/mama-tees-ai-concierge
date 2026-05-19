# Vercel Deployment Guide

## Goal

Deploy the Mama Tee's Kitchen Node.js webhook API as a Vercel Express Function.

This deployment target hosts only the backend webhook API. It does not add a database. Google Sheets remains the call-log persistence layer for the core demo.

## Architecture

```text
Retell AI phone agent
  -> Vercel HTTPS endpoint
  -> Node.js Express webhook
  -> Google Sheets call log
```

## Repository files

New Vercel-specific files:

- `api/index.ts`: exports the existing Express app for Vercel Functions.
- `vercel.json`: configures install, build, and route rewrites for the API.

Existing backend files remain the source of business logic:

- `src/app.ts`
- `src/routes/health.ts`
- `src/routes/callLogs.ts`
- `src/domain/businessRules.ts`
- `src/services/googleSheets.ts`

## Vercel project settings

Use these project settings:

```text
Framework: Express
Install command: npm ci
Build command: npm run build
Root directory: repository root
Production branch: main
```

## Required environment variables

Configure these values in Vercel Project Settings. Do not commit actual credentials.

```text
NODE_ENV=production
LOG_DESTINATION=google_sheets
WEBHOOK_SECRET=<set in Vercel only>
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GOOGLE_SERVICE_ACCOUNT_EMAIL=<set in Vercel only>
GOOGLE_PRIVATE_KEY=<set in Vercel only, escaped newlines>
BUSINESS_TIMEZONE=Africa/Lagos
```

`PORT` is not required on Vercel because Vercel manages the function runtime.

## Validation

After deployment, validate the public URL:

```bash
curl -sS https://<vercel-url>/healthz
curl -sS https://<vercel-url>/readiness
```

Expected `/healthz` response:

```json
{"status":"ok"}
```

Expected `/readiness` response includes:

```json
{
  "status": "ready",
  "log_destination": "google_sheets",
  "business_timezone": "Africa/Lagos"
}
```

Validate webhook protection:

```bash
curl -i -X POST https://<vercel-url>/api/call-logs \
  -H 'Content-Type: application/json' \
  --data-binary @examples/order-log.json
```

Expected result without `X-Webhook-Secret`: HTTP `401 Unauthorized`.

Validate successful writes only after the Vercel environment variables are configured with the Google service account and webhook secret.

## Security requirements

- Do not commit `.env`.
- Do not commit Google service account JSON.
- Do not expose `WEBHOOK_SECRET`, `GOOGLE_PRIVATE_KEY`, or API credentials in GitHub, screenshots, issue comments, PRs, or Loom recordings.
- Keep Google Sheets service account access limited to the required spreadsheet.
- Rotate any credential that is accidentally exposed.

## Rollback

If Vercel deployment fails or the voice platform cannot reach it:

1. Disable or remove the Vercel project deployment.
2. Keep the repository branch open for review.
3. Continue using the existing `render.yaml` path as an alternative deployment target.
4. Do not change the Google Sheet or business rules while rolling back deployment hosting.
