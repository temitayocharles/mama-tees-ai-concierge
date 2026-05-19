# Google Sheets Setup

## Existing live Sheet

A live Google Sheet has already been created for the project.

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
URL: https://docs.google.com/spreadsheets/d/1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8/edit
```

## Expected columns

The `Call Logs` tab should contain these columns in order:

```text
id
timestamp
request_type
customer_name
phone_number
order_details
order_total
fulfillment_type
delivery_address
delivery_area
delivery_fee
reservation_date
reservation_time
guest_count
callback_reason
notes
confirmation_summary
status
source
call_id
validation_warnings
raw_transcript
```

The same schema is implemented in:

```text
src/services/googleSheets.ts
```

## Preferred production authentication: Vercel OIDC and Google Workload Identity Federation

Use this path for production and staging. It avoids long-lived Google private keys in Vercel.

Set these environment variables in Vercel:

```text
LOG_DESTINATION=google_sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GCP_PROJECT_ID=<google-cloud-project-id>
GCP_PROJECT_NUMBER=<google-cloud-project-number>
GCP_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GCP_WORKLOAD_IDENTITY_POOL_ID=vercel
GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID=vercel
```

Also enable Vercel OIDC for the project. The backend reads the request-scoped `x-vercel-oidc-token` header supplied by Vercel Functions and exchanges it for a Google service-account access token.

The Google service account must have:

1. Workload Identity User binding for the Vercel principal.
2. Editor access to the `Mama Tee's Kitchen Call Logs` spreadsheet only.
3. Google Sheets API enabled in the Google Cloud project.
4. IAM Service Account Credentials API enabled if service-account impersonation is used.

## Legacy local fallback: JSON service account key

Use this only for local development or if Vercel OIDC is unavailable.

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<private-key-with-escaped-newlines>
```

Do not use `GOOGLE_PRIVATE_KEY` for production when Vercel OIDC is configured. Do not commit a service account JSON file.

## Runtime readiness behavior

`/healthz` remains available as a liveness probe.

`/readiness` returns `503 not_ready` if `LOG_DESTINATION=google_sheets` is enabled but required Google Sheets target or authentication configuration is missing. When ready, it includes `google_sheets_auth_mode` with either `workload_identity` or `json_key`.

## Authenticated write validation

After deployment, send a callback payload with the real webhook secret set only in your shell environment:

```bash
curl -X POST https://YOUR_BACKEND_URL/api/call-logs \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  --data-binary @examples/callback-log.json
```

Expected response:

```json
{
  "status": "logged"
}
```

Then confirm a new row appears in the Google Sheet.

## Sanitized Google Sheets error codes

Authenticated writes return sanitized diagnostic codes when Google Sheets append fails. These codes intentionally do not expose secrets.

| Code | Meaning | Fix |
|---|---|---|
| `VERCEL_OIDC_TOKEN_MISSING` | Vercel did not provide the function OIDC token. | Enable OIDC for the Vercel project and redeploy. |
| `GOOGLE_WORKLOAD_IDENTITY_TOKEN_EXCHANGE_FAILED` | Google STS rejected the Vercel OIDC token. | Check the workload identity pool/provider issuer, audience, and principal mapping. |
| `GOOGLE_WORKLOAD_IDENTITY_PERMISSION_DENIED` | The Vercel principal cannot impersonate the service account. | Recheck the service account Workload Identity User binding. |
| `GOOGLE_SERVICE_ACCOUNT_IMPERSONATION_FAILED` | Service account token generation failed. | Confirm IAMCredentials API access and service account permissions. |
| `GOOGLE_PRIVATE_KEY_INVALID` | Legacy private key value is malformed. | Prefer Vercel OIDC. For local fallback, copy only the JSON `private_key` value. |
| `GOOGLE_AUTH_FAILED` | Google rejected credentials. | Confirm auth configuration belongs to the intended service account. |
| `GOOGLE_SHEETS_PERMISSION_DENIED` | Service account cannot edit the Sheet or Sheets API access is denied. | Share the Sheet with the service account email as Editor and confirm Sheets API is enabled. |
| `GOOGLE_SHEETS_TARGET_NOT_FOUND` | Spreadsheet ID or tab is wrong, or inaccessible. | Confirm spreadsheet ID and `Call Logs` tab. |
| `GOOGLE_SHEETS_REQUEST_INVALID` | Google Sheets rejected the append range or request. | Confirm the tab name and sheet schema. |
| `GOOGLE_SHEETS_APPEND_FAILED` | Generic upstream append failure. | Check Vercel runtime logs and Google Cloud API status. |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/readiness` returns `503 not_ready` | Missing webhook, sheet target, or Google auth env var | Check Vercel env keys without exposing values. |
| `/readiness` shows `google_sheets_auth_mode=json_key` | WIF env vars are missing and app is falling back to private-key auth | Add the `GCP_*` variables and redeploy. |
| 502 with `VERCEL_OIDC_TOKEN_MISSING` | Vercel OIDC is not enabled or header is unavailable | Enable OIDC for the Vercel project and redeploy. |
| 502 with `GOOGLE_WORKLOAD_IDENTITY_TOKEN_EXCHANGE_FAILED` | WIF provider config mismatch | Check issuer, audience, and provider attribute mapping. |
| 502 with `GOOGLE_WORKLOAD_IDENTITY_PERMISSION_DENIED` | Missing service account IAM binding | Grant Workload Identity User to the Vercel principal. |
| 502 with `GOOGLE_SHEETS_PERMISSION_DENIED` | Service account not shared or API disabled | Share Sheet with service account as Editor and enable Sheets API. |
| No new row | Wrong spreadsheet ID or tab name | Confirm ID and `Call Logs` tab. |
| Values in wrong columns | Header mismatch | Compare Sheet header with `SHEET_COLUMNS`. |
