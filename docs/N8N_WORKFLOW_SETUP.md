# n8n Workflow Setup

## Purpose

n8n is optional automation infrastructure for Mama Tee's Kitchen AI Voice Concierge.

The primary path remains:

```text
Retell AI phone agent
  -> ElevenLabs custom voice
  -> Vercel Node.js backend webhook
  -> Google Sheets visible call log
```

Use n8n only as a fallback or extension after the backend path is stable.

## Preferred fallback design

```text
Voice platform or HTTP caller
  -> n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

The backend remains the authority for authentication, payload validation, delivery rules, reservation rules, confirmation summaries, sanitized errors, and the Google Sheets schema.

## Workflow files

Current fallback workflow export:

```text
n8n/mama-tees-fallback-call-log.workflow.json
```

Legacy direct-to-Google-Sheets workflow, if present, should not be used for the preferred fallback path. Direct spreadsheet writes bypass backend validation and duplicate responsibilities that belong in the backend.

## Required runtime variable

Configure the backend webhook value securely in n8n:

```text
MAMA_TEES_WEBHOOK_SECRET
```

The workflow sends it as:

```text
X-Webhook-Secret: <configured securely in n8n only>
```

Do not commit or display the value.

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

Expected result:

- n8n execution succeeds,
- backend returns HTTP 201,
- Google Sheet receives a row with `source=n8n_fallback`,
- Google Sheet receives a row with `call_id=issue-5-n8n-fallback-validation`.

## Closure rule

Do not mark the n8n fallback complete until the workflow is imported or updated in n8n, the runtime variable is configured securely, a manual execution succeeds, the Google Sheet row is verified, evidence is captured without sensitive values, documentation is updated, and CI is green.
