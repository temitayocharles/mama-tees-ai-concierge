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
4. Create a service account.
5. Generate a JSON key for the service account.
6. Copy the service account email.
7. Open the Google Sheet.
8. Share the Sheet with the service account email as Editor.

## Backend environment variables

Set these in the deployment host:

```text
LOG_DESTINATION=google_sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<private-key-with-escaped-newlines>
```

Keep `GOOGLE_PRIVATE_KEY` in your deployment secret manager. Do not commit it.

## Private key formatting

Most deployment platforms expect the key as one line with escaped newlines:

```text
-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

The backend normalizes escaped newlines before authenticating.

## Validation command

After deployment, send a callback payload:

```bash
curl -X POST https://YOUR_BACKEND_URL/api/call-logs \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_WEBHOOK_SECRET" \
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
| 500 from backend | Missing Google credential | Check deployment environment variables. |
| 500 with auth error | Private key formatting issue | Use escaped newlines in `GOOGLE_PRIVATE_KEY`. |
| No new row | Wrong spreadsheet ID or tab name | Confirm ID and `Call Logs` tab. |
| Permission denied | Service account not shared | Share Sheet with service account as Editor. |
| Values in wrong columns | Header mismatch | Compare Sheet header with `SHEET_COLUMNS`. |
