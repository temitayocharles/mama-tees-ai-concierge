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

Vercel-specific files:

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
Install command: npm ci --include=dev
Build command: npm run build
Root directory: repository root
Production branch: main
```

The install command intentionally includes dev dependencies because the TypeScript compiler is a dev dependency required during the build step. Runtime dependencies remain controlled by `package-lock.json`.

## Required environment variables

Configure these values in Vercel Project Settings. Do not commit actual credentials.

```text
WEBHOOK_SECRET=<set in Vercel only>
LOG_DESTINATION=google_sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GOOGLE_SERVICE_ACCOUNT_EMAIL=<set in Vercel only>
GOOGLE_PRIVATE_KEY=<set in Vercel only, escaped newlines>
BUSINESS_TIMEZONE=Africa/Lagos
```

`WEBHOOK_SECRET` is required for call-log writes. If it is missing, `/healthz` remains available, `/readiness` returns `503 not_ready`, and `POST /api/call-logs` returns `503` without writing records.

`PORT` is not required on Vercel because Vercel manages the function runtime. Do not set `NODE_ENV=production` in a way that prevents dev dependencies from being installed during the build step.

## Validation

After deployment, validate the public URL:

```bash
curl -sS https://<vercel-url>/healthz
curl -i https://<vercel-url>/readiness
```

Expected `/healthz` response:

```json
{"status":"ok"}
```

Expected `/readiness` response after all required environment variables are configured:

```json
{
  "status": "ready",
  "webhook_auth_configured": true,
  "log_destination": "google_sheets",
  "google_sheets_configured": true,
  "business_timezone": "Africa/Lagos"
}
```

Expected `/readiness` response before `WEBHOOK_SECRET` or Google Sheets credentials are configured: HTTP `503` with `status` set to `not_ready`.

Validate webhook protection after `WEBHOOK_SECRET` is configured:

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

1. Promote the previous known-good deployment or pause use of the Vercel endpoint.
2. Keep the repository branch open for review until checks are green.
3. Continue using the existing `render.yaml` path as an alternative deployment target.
4. Do not change the Google Sheet or business rules while rolling back deployment hosting.
