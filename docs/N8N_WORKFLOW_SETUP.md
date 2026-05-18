# n8n Workflow Setup

## Purpose

n8n is optional for this capstone. The primary path is:

```text
Retell AI + ElevenLabs
→ Node.js backend
→ Google Sheets
```

Use n8n only as a fallback or extension after the backend path is stable:

```text
Voice platform
→ n8n webhook
→ Google Sheets
```

## Workflow file

Import this file into n8n:

```text
n8n/mama-tees-call-logger.workflow.json
```

## Import steps

1. Open n8n.
2. Import workflow from file.
3. Select `n8n/mama-tees-call-logger.workflow.json`.
4. Open the Google Sheets node.
5. Select or create your Google Sheets credential.
6. Confirm document ID:

```text
1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
```

7. Confirm sheet name:

```text
Call Logs
```

8. Save and activate the workflow.
9. Copy the production webhook URL.

## Security note

The imported workflow checks that `x-webhook-secret` is present. For stronger production security, update the workflow to compare the received header against a stored n8n credential or environment variable.

Do not put secrets directly inside public workflow JSON.

## Test payload

Send a test callback payload to the n8n production webhook URL:

```bash
curl -X POST https://YOUR_N8N_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_SECRET" \
  -d '{
    "request_type": "callback",
    "customer_name": "Demo Caller",
    "phone_number": "08000000000",
    "fulfillment_type": "not_applicable",
    "callback_reason": "Testing n8n logging path.",
    "confirmation_summary": "Callback request for Demo Caller."
  }'
```

Expected result:

```json
{"status":"logged"}
```

Then confirm a new row appears in Google Sheets.

## Decision criteria

Use backend primary if:

- You want better validation.
- You want business rules enforced before logging.
- You want better engineering-grade evidence.

Use n8n fallback if:

- Deployment host setup is blocked.
- You need a fast no-code route to Google Sheets.
- The capstone deadline is close and the voice-agent tool can call n8n directly.

## Documentation requirement

If n8n is used in the Loom demo, capture screenshots of:

- Webhook trigger.
- Google Sheets node.
- Successful execution.
- Resulting Google Sheet row.
