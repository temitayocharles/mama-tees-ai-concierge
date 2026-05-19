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

Copy only the `private_key` value from the service-account JSON. Do not paste the entire JSON file into `GOOGLE_PRIVATE_KEY`.

Vercel can store either actual newlines or escaped newlines. The backend normalizes both of these forms:

```text
-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

```text
"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Runtime readiness behavior

`/healthz` remains available as a liveness probe.

`/readiness` returns `503 not_ready` if `LOG_DESTINATION=google_sheets` is enabled but required Google Sheets credentials are missing. This prevents a partially configured public deployment from being treated as ready.

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
| `GOOGLE_PRIVATE_KEY_INVALID` | Private key value is malformed or pasted incorrectly. | Copy only the JSON `private_key` value and preserve or escape newlines. |
| `GOOGLE_AUTH_FAILED` | Google rejected the JWT credentials. | Confirm service-account email and key belong to the same service account. |
| `GOOGLE_SHEETS_PERMISSION_DENIED` | Service account cannot edit the Sheet or Sheets API access is denied. | Share the Sheet with the service account email as Editor and confirm Sheets API is enabled. |
| `GOOGLE_SHEETS_TARGET_NOT_FOUND` | Spreadsheet ID or tab is wrong, or inaccessible. | Confirm spreadsheet ID and `Call Logs` tab. |
| `GOOGLE_SHEETS_REQUEST_INVALID` | Google Sheets rejected the append range or request. | Confirm the tab name and sheet schema. |
| `GOOGLE_SHEETS_APPEND_FAILED` | Generic upstream append failure. | Check Vercel runtime logs and Google Cloud API status. |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/readiness` returns `503 not_ready` | Missing webhook or Google Sheets env var | Check Vercel env keys without exposing values. |
| 502 with `GOOGLE_PRIVATE_KEY_INVALID` | Private key formatting issue | Use the JSON `private_key` value, not the full JSON file. |
| 502 with `GOOGLE_SHEETS_PERMISSION_DENIED` | Service account not shared or API disabled | Share Sheet with service account as Editor and enable Sheets API. |
| 502 with `GOOGLE_AUTH_FAILED` | Email/key mismatch or invalid service account key | Regenerate the service account key and update both env vars. |
| No new row | Wrong spreadsheet ID or tab name | Confirm ID and `Call Logs` tab. |
| Values in wrong columns | Header mismatch | Compare Sheet header with `SHEET_COLUMNS`. |
