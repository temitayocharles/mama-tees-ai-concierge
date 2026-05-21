# n8n Workflow Setup

## Purpose

n8n is the optional workflow automation layer for Mama Tee's Kitchen AI Voice Concierge.

The primary path remains:

```text
Retell AI phone agent
-> ElevenLabs custom voice
-> Vercel Node.js backend webhook
-> Google Sheets visible call log
```

The n8n automation bridge path is:

```text
Voice platform or HTTP caller
-> n8n Automation Bridge
-> Vercel backend /api/call-logs
-> Google Sheets visible call log
```

The backend remains the authority for authentication, payload validation, delivery rules, reservation rules, confirmation summaries, sanitized errors, and the Google Sheets schema.

## Workflow files

Current workflow export:

```text
n8n/mama-tees-automation-bridge.workflow.json
```

Detailed setup and validation instructions:

```text
docs/N8N_AUTOMATION_BRIDGE.md
```

Legacy direct-to-Google-Sheets workflow, if present, should not be used for the preferred automation bridge path. Direct spreadsheet writes bypass backend validation and duplicate responsibilities that belong in the backend.

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

This project does not require n8n Enterprise Variables for this automation bridge. The current workflow uses Render runtime environment variables instead.

## Manual validation payload

Use the validation payload documented in:

```text
docs/N8N_AUTOMATION_BRIDGE.md
```

Expected result:

- n8n execution succeeds,
- backend returns HTTP 201,
- Google Sheet receives a row with `source=n8n_automation_bridge`,
- Google Sheet receives a row with `call_id=issue-5-n8n-automation-bridge-validation`.

## Closure rule

Issue #5 should only close after the current automation bridge endpoint is validated, CI is green, PR review confirms no sensitive values are exposed, and the validated workflow/export/docs are merged.
