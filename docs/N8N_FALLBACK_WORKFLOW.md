# n8n Fallback Workflow

## Issue

Tracks GitHub issue #5: Import and validate n8n workflow after backend path is stable.

## Purpose

This workflow is optional fallback or extension infrastructure. It must not replace the stable capstone demo path:

```text
Retell AI phone agent
-> ElevenLabs custom voice
-> Vercel Node.js backend webhook
-> Google Sheets visible call log
```

The n8n fallback path forwards to the same backend instead of writing directly to Google Sheets:

```text
Voice platform or HTTP caller
-> n8n webhook
-> Vercel backend /api/call-logs
-> Google Sheets visible call log
```

The backend remains the authority for authentication, payload validation, delivery rules, reservation rules, confirmation summaries, sanitized errors, and the Google Sheets schema.

## Workflow file

Import this file into n8n:

```text
n8n/mama-tees-fallback-call-log.workflow.json
```

Suggested workflow name:

```text
Mama Tee - Fallback Call Log Webhook
```

## Production backend target

```text
POST https://mama-tees-ai-concierge.vercel.app/api/call-logs
```

Required outbound headers from n8n:

```text
Content-Type: application/json
X-Webhook-Secret: configured securely in n8n only
```

The workflow export references this n8n variable:

```text
MAMA_TEES_WEBHOOK_SECRET
```

The repository must never contain the variable value.

## Import steps

1. Open the n8n instance.
2. Import `n8n/mama-tees-fallback-call-log.workflow.json`.
3. Confirm the webhook trigger path is `mama-tees-fallback-call-log`.
4. Confirm the HTTP Request node points to `https://mama-tees-ai-concierge.vercel.app/api/call-logs`.
5. Configure `MAMA_TEES_WEBHOOK_SECRET` securely in n8n.
6. Save the workflow.
7. Run a manual test execution.
8. Activate the workflow only after the manual test returns backend HTTP 201.

## Manual validation payload

```json
{
  "request_type": "callback",
  "customer_name": "n8n Validation",
  "phone_number": "08000000000",
  "callback_reason": "Validate n8n fallback webhook to production backend",
  "notes": "Safe validation row for issue #5",
  "source": "n8n_fallback",
  "call_id": "issue-5-n8n-fallback-validation"
}
```

Expected n8n result:

```json
{
  "status": "success",
  "message": "Call log accepted by backend.",
  "backend_status": 201
}
```

Expected Google Sheet row fields:

```text
request_type=callback
customer_name=n8n Validation
source=n8n_fallback
call_id=issue-5-n8n-fallback-validation
```

## Failure behavior

The HTTP Request node is configured to avoid exposing backend error bodies directly. The webhook returns a sanitized response for backend failures such as 400, 401, 502, or other non-success statuses.

Expected sanitized failure shape:

```json
{
  "status": "error",
  "message": "Call log forwarding failed.",
  "backend_status": 401
}
```

## Current validation status

As of this issue #5 progress update:

- n8n workflow exists in the connected n8n instance.
- Repository export is prepared.
- The n8n Render service does not yet have `MAMA_TEES_WEBHOOK_SECRET` configured.
- Manual execution against the production backend cannot be accepted until the n8n variable is configured.
- Google Sheet row verification remains pending.

Do not close issue #5 until the workflow is imported or updated from the repository export, the n8n variable is configured securely, manual execution returns backend HTTP 201, the Google Sheet row is verified, evidence is captured without sensitive values, documentation is current, and CI is green.
