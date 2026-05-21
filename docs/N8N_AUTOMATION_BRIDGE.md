# n8n Automation Bridge

## Purpose

The n8n Automation Bridge is an optional workflow automation layer for Mama Tee's Kitchen AI Voice Concierge.

It provides an automation-friendly intake path for structured call-log payloads while preserving the secure backend as the authority for authentication, validation, business rules, sanitized errors, and Google Sheets schema control.

Primary voice path:

```text
Retell AI phone agent
-> ElevenLabs custom voice
-> Vercel Node.js backend webhook
-> Google Sheets visible call log
```

Automation bridge path:

```text
Voice platform or HTTP caller
-> n8n Automation Bridge
-> Vercel backend /api/call-logs
-> Google Sheets visible call log
```

n8n does not write directly to Google Sheets. It forwards to the backend.

## Workflow file

```text
n8n/mama-tees-automation-bridge.workflow.json
```

Workflow name:

```text
Mama Tee - n8n Automation Bridge
```

Live workflow ID:

```text
FpRh13SdgO1NmEEe
```

Production webhook:

```text
https://n8n-uev8.onrender.com/webhook/mama-tees-automation-bridge-call-log
```

## Backend target

```text
POST https://mama-tees-ai-concierge.vercel.app/api/call-logs
```

Required outbound headers from n8n:

```text
Content-Type: application/json
X-Webhook-Secret: loaded securely from runtime configuration
```

The active workflow reads the backend webhook secret from the Render runtime environment variable:

```text
MAMA_TEES_WEBHOOK_SECRET
```

The workflow export references the value as:

```text
{{ $env.MAMA_TEES_WEBHOOK_SECRET }}
```

The repository must never contain the variable value.

## Render runtime configuration

The Render-hosted n8n service must include:

```text
MAMA_TEES_WEBHOOK_SECRET=<same rotated value expected by the Vercel backend>
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
```

`N8N_BLOCK_ENV_ACCESS_IN_NODE=false` is required because this n8n instance reads the backend secret from `$env` inside the HTTP Request node.

Restrict access to the n8n instance to trusted operators because workflow nodes can read environment variables when this setting is disabled.

## Manual validation payload

```json
{
  "request_type": "callback",
  "customer_name": "n8n Automation Bridge Validation",
  "phone_number": "08000000000",
  "callback_reason": "Validate n8n automation bridge webhook to production backend",
  "notes": "Safe validation row for issue #5 after automation bridge rename",
  "source": "n8n_automation_bridge",
  "call_id": "issue-5-n8n-automation-bridge-validation"
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
customer_name=n8n Automation Bridge Validation
source=n8n_automation_bridge
call_id=issue-5-n8n-automation-bridge-validation
```

## Prior validation evidence

The previous validated endpoint returned HTTP 201 and wrote a Google Sheet row before the naming cleanup.

Validated prior call ID:

```text
issue-5-n8n-fallback-validation
```

The current automation bridge endpoint must be revalidated after the rename before issue #5 is merged as complete.

## Failure behavior

The HTTP Request node is configured not to expose backend error bodies directly. The webhook returns a sanitized response for backend failures such as 400, 401, 502, or other non-success statuses.

Expected sanitized failure shape:

```json
{
  "status": "error",
  "message": "Call log forwarding failed.",
  "backend_status": 401
}
```
