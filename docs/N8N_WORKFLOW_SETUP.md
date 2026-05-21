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

Detailed setup and validation instructions:

```text
docs/N8N_FALLBACK_WORKFLOW.md
```

Legacy direct-to-Google-Sheets workflow, if present, should not be used for the preferred fallback path. Direct spreadsheet writes bypass backend validation and duplicate responsibilities that belong in the backend.

## Runtime configuration

The Render-hosted n8n service must have:

```text
MAMA_TEES_WEBHOOK_SECRET=<same rotated value expected by Vercel backend>
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
```

The workflow sends the backend auth header from the Render runtime environment:

```text
X-Webhook-Secret: {{ $env.MAMA_TEES_WEBHOOK_SECRET }}
```

Do not commit or display the value.

This project does not require n8n Enterprise Variables for the fallback path. The current workflow uses Render runtime environment variables instead.

## Manual validation payload

Use the validation payload documented in:

```text
docs/N8N_FALLBACK_WORKFLOW.md
```

Expected result:

- n8n execution succeeds,
- backend returns HTTP 201,
- Google Sheet receives a row with `source=n8n_fallback`,
- Google Sheet receives a row with `call_id=issue-5-n8n-fallback-validation`.

## Validation status

Validated on 2026-05-21:

```text
Workflow ID: FpRh13SdgO1NmEEe
Active version: 6cedc0d9-a2f4-477e-955a-c7353af42a48
Production webhook response: HTTP 201
backend_status: 201
Google Sheet row found: true
call_id: issue-5-n8n-fallback-validation
```

## Closure rule

Issue #5 should only close after CI is green, PR review confirms no sensitive values are exposed, and the validated workflow/export/docs are merged.
