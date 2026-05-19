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

## Service account setup

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable Google Sheets API.
4. Create a service account dedicated to this backend.
5. Generate a JSON key for the service account.
6. Copy the service account email.
7. Open the Google Sheet.
8. Share the Sheet with the service account email as Editor.

Use least privilege: the service account should only receive Editor access to this spreadsheet, not broader Drive access.

## Backend environment variables

Set these in Vercel Project Settings. Do not commit actual values.

```text
LOG_DESTINATION=google_sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<private-key-with-escaped-newlines>
```

Recommended Vercel storage types:

```text
LOG_DESTINATION: plain
GOOGLE_SHEETS_SPREADSHEET_ID: plain
GOOGLE_SHEETS_TAB_NAME: plain
GOOGLE_SERVICE_ACCOUNT_EMAIL: encrypted or sensitive
GOOGLE_PRIVATE_KEY: sensitive
```

Keep `GOOGLE_PRIVATE_KEY` in the deployment secret manager. Do not commit it, paste it into issue comments, or show it in screenshots or Loom recordings.

## Private key formatting

Most deployment platforms expect the key as one line with escaped newlines:

```text
-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

The backend normalizes escaped newlines before authenticating.

## Runtime readiness behavior

`/healthz` remains available as a liveness probe.

`/readiness` returns `503 not_ready` if `LOG_DESTINATION=google_sheets` is enabled but required Google Sheets credentials are missing. This prevents a partially configured public deployment from being treated as ready.

## Validation command

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

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/readiness` returns `503 not_ready` | Missing webhook or Google Sheets env var | Check Vercel env keys without exposing values. |
| 500 from backend on valid write | Google credential or Sheets API problem | Check service account email, API enablement, and private key formatting. |
| 500 with auth error | Private key formatting issue | Use escaped newlines in `GOOGLE_PRIVATE_KEY`. |
| No new row | Wrong spreadsheet ID or tab name | Confirm ID and `Call Logs` tab. |
| Permission denied | Service account not shared | Share Sheet with service account as Editor. |
| Values in wrong columns | Header mismatch | Compare Sheet header with `SHEET_COLUMNS`. |
