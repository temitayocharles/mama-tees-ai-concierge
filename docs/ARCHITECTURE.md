# Architecture

## Objective

Mama Tee's Kitchen AI Voice Concierge is a phone-first automation system for restaurant call handling, structured request capture, and visible staff review.

The architecture intentionally avoids unnecessary infrastructure. There is no application database. Google Sheets is the operations-facing call-log persistence layer.

## Primary production path

```text
Customer phone call
  -> Retell AI phone agent
  -> ElevenLabs custom voice in Retell
  -> Vercel Node.js backend webhook
  -> Google Sheets visible call log
```

## Optional automation fallback path

```text
Voice platform or HTTP caller
  -> n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

The fallback workflow must forward to the backend instead of writing directly to Google Sheets. This keeps authentication, payload validation, business rules, confirmation summaries, sanitized errors, and spreadsheet schema ownership centralized in the backend.

## Backend responsibilities

The Vercel backend owns:

- webhook authentication with `X-Webhook-Secret`,
- request payload validation,
- request normalization,
- delivery rules,
- reservation rules,
- confirmation summary generation,
- sanitized error responses,
- Google Sheets append logic,
- readiness and health endpoints.

## Voice-agent responsibilities

The voice agent owns:

- automated-assistant disclosure,
- caller conversation flow,
- collection of confirmed request details,
- concise responses suitable for phone calls,
- use of the backend logging tool only after confirmation,
- fallback to callback logging when a request is outside supported scope.

The voice agent must not invent menu items, prices, discounts, policies, or availability.

## Google Sheets responsibility

Google Sheets is the visible business log.

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
```

Google Sheets is not the business-rule engine. The backend validates before append.

## Production authentication model

```text
Vercel OIDC
  -> Google Workload Identity Federation
  -> service account impersonation
  -> Google Sheets append
```

Do not use Google private keys for production.

## Backend endpoints

```text
GET  /healthz
GET  /readiness
POST /api/call-logs
```

Expected readiness response:

```json
{
  "status": "ready",
  "webhook_auth_configured": true,
  "log_destination": "google_sheets",
  "google_sheets_configured": true,
  "google_sheets_auth_mode": "workload_identity",
  "business_timezone": "Africa/Lagos"
}
```

## Business-rule boundary

The backend and prompt both reflect the same restaurant rules, but the backend is the enforcement boundary for persisted records.

Rules that must remain stable:

- delivery Monday to Saturday only,
- delivery hours 10:00am to 7:00pm,
- no Sunday delivery,
- minimum delivery order ₦3,000,
- payment before dispatch,
- reservations only for groups of 5 or more,
- reservations require at least 24 hours notice,
- reservation deposit ₦5,000,
- deposit applies to the bill,
- supported delivery-fee bands must not be changed without client approval.

## Current external service state

```text
Production backend: https://mama-tees-ai-concierge.vercel.app
Retell phone number: +1 (431) 500-6652
Retell agent: agent_18dafa1d3bf6038320ad0be4a7
Retell LLM: llm_5bf4bf80d471d52a9de7f0aec4a8
Retell voice: custom_voice_2078deacf9cdf5096ba2124a06
```

Live Retell call validation and final n8n fallback validation remain separate evidence items.
