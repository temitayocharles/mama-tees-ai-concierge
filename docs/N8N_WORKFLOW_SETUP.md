# n8n Workflow Setup

## Purpose

n8n is optional for this capstone. The primary path remains:

```text
Retell AI phone agent
-> ElevenLabs custom voice
-> Vercel Node.js backend webhook
-> Google Sheets visible call log
```

Use n8n only as a fallback or extension after the backend path is stable.

## Preferred fallback design

Use this design for issue #5:

```text
Voice platform or HTTP caller
-> n8n webhook
-> Vercel backend /api/call-logs
-> Google Sheets visible call log
```

The backend must remain the authority for authentication, payload validation, delivery rules, reservation rules, confirmation summaries, sanitized errors, and the Google Sheets schema.

## Workflow files

Preferred issue #5 workflow:

```text
n8n/mama-tees-fallback-call-log.workflow.json
```

Detailed setup and validation instructions:

```text
docs/N8N_FALLBACK_WORKFLOW.md
```

Legacy direct-to-Google-Sheets workflow retained for reference:

```text
n8n/mama-tees-call-logger.workflow.json
```

Do not use the legacy direct-to-Google-Sheets workflow for the core capstone demo unless explicitly instructed. It bypasses backend validation and duplicates responsibilities that already exist in the stable backend path.

## Required n8n variable

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

Use the validation payload documented in:

```text
docs/N8N_FALLBACK_WORKFLOW.md
```

Expected result:

- n8n execution succeeds.
- Backend returns HTTP 201.
- Google Sheet receives a row with `source=n8n_fallback` and `call_id=issue-5-n8n-fallback-validation`.

## Closure rule

Do not close issue #5 until the workflow is imported or updated in n8n, the n8n variable is configured securely, a manual execution succeeds, the Google Sheet row is verified, evidence is captured without sensitive values, documentation is updated, and CI is green.
