# n8n Fallback Workflow

## Purpose

This workflow is optional fallback and automation infrastructure for Mama Tee's Kitchen AI Voice Concierge. It must not replace the primary voice path:

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

```text
n8n/mama-tees-fallback-call-log.workflow.json
```

Workflow name:

```text
Mama Tee - Fallback Call Log Webhook
```

Live workflow ID:

```text
FpRh13SdgO1NmEEe
```

Production webhook:

```text
https://n8n-uev8.onrender.com/webhook/mama-tees-fallback-call-log
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
  "customer_name": "n8n Validation",
  "phone_number": "08000000000",
  "callback_reason": "Validate n8n fallback webhook to production backend",
  "notes": "Safe validation row for issue #5 after Render env var mapping",
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

## Validation evidence

Validated on 2026-05-21:

```text
Workflow ID: FpRh13SdgO1NmEEe
Active version: 6cedc0d9-a2f4-477e-955a-c7353af42a48
Production webhook response: HTTP 201
backend_status: 201
Google Sheet row found: true
Google Sheet timestamp: 2026-05-21T17:11:33.925Z
source: n8n_fallback
call_id: issue-5-n8n-fallback-validation
```

A previous failed validation returned HTTP 401 when the workflow referenced n8n `$vars` or when environment access was blocked. The successful configuration uses Render runtime `$env` access with `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`.

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

## Closure status

Issue #5 can be resolved after CI is green and PR review confirms:

- workflow export matches the live n8n configuration,
- Render runtime configuration is documented without exposing values,
- production execution returns backend HTTP 201,
- Google Sheet row is verified,
- no secret value appears in the repository, screenshots, issue comments, or pull request text.
