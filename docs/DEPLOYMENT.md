# Deployment Guide

## Goal

Deploy the Node.js backend so the selected voice platform can call:

```text
POST /api/call-logs
```

The recommended production-like path for this capstone is Render, Railway, Fly.io, or another always-on Node.js host. Render is documented because `render.yaml` is included.

## Required environment variables

```text
NODE_ENV=production
PORT=8080
LOG_DESTINATION=google_sheets
WEBHOOK_SECRET=<long-random-secret>
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<private-key-with-escaped-newlines>
BUSINESS_TIMEZONE=Africa/Lagos
```

Do not commit any secret values.

## Local validation before deployment

```bash
npm install
npm run build
npm test
cp .env.example .env
npm run dev
```

Health check:

```bash
curl http://localhost:8080/healthz
```

Expected response:

```json
{"status":"ok"}
```

Smoke test:

```bash
WEBHOOK_SECRET=replace-with-a-long-random-secret ./scripts/test-api.sh
```

Expected outcome:

```text
Order log: HTTP 201
Reservation log: HTTP 201
Callback log: HTTP 201
```

## Render deployment

1. Open Render.
2. Create a new Web Service.
3. Connect this GitHub repository.
4. Use the Node runtime.
5. Build command:

```bash
npm install && npm run build
```

6. Start command:

```bash
npm start
```

7. Add the required environment variables.
8. Deploy.
9. Open the deployed `/healthz` endpoint.

Expected:

```json
{"status":"ok"}
```

## Google Sheets verification

After deployment, send an order payload to the deployed backend:

```bash
curl -X POST https://YOUR_BACKEND_URL/api/call-logs \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_WEBHOOK_SECRET" \
  --data-binary @examples/order-log.json
```

Expected:

```json
{
  "status": "logged"
}
```

Then check the Google Sheet for a new row.

## Rollback

If deployment fails:

1. Switch `LOG_DESTINATION` to `local_jsonl` to isolate Google credential problems.
2. Redeploy the last known good GitHub commit.
3. Disable the voice-agent webhook until `/healthz` and a smoke-test payload succeed.
4. Rotate `WEBHOOK_SECRET` if it was exposed during testing.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/healthz` fails | App not running | Check build logs and start command. |
| 401 on `/api/call-logs` | Missing or wrong `X-Webhook-Secret` | Match voice platform header with backend secret. |
| 500 on valid payload | Google Sheets config problem | Verify service account email, private key formatting, and Sheet sharing. |
| No Sheet row | Wrong spreadsheet ID or tab | Confirm Sheet ID and tab name. |
| Voice tool fails | Wrong deployed URL or schema | Compare with `prompts/voice-agent-tool-schema.md`. |
