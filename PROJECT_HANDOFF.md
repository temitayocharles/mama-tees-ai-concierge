# Mama Tee's Kitchen AI Voice Concierge Engineering Handoff

## Project summary

Mama Tee's Kitchen contracted InfraForge to deliver a practical phone-based AI concierge that can answer common restaurant questions, collect structured customer requests, and write visible call logs for staff review.

The implementation uses a deliberately lean architecture: Retell AI for phone calls, ElevenLabs for the custom voice, a Vercel-hosted Node.js backend for authentication and validation, and Google Sheets as the visible operations log.

## Current production backend

```text
https://mama-tees-ai-concierge.vercel.app
```

Endpoints:

```text
GET  /healthz
GET  /readiness
POST /api/call-logs
```

## Primary operating path

```text
Retell AI phone agent
  -> ElevenLabs custom voice
  -> Vercel Node.js backend webhook
  -> Google Sheets visible call log
```

## Optional fallback path

```text
Voice platform or HTTP caller
  -> n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

n8n must remain optional. It should forward to the backend and must not become the system of record.

## Persistence decision

There is no application database.

Google Sheets is the visible persistence layer for call-log operations:

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
```

## Production Google authentication

```text
Vercel OIDC
  -> Google Workload Identity Federation
  -> service account impersonation
  -> Google Sheets append
```

Do not use Google service account private keys for production.

## Retell and ElevenLabs state

Configured objects:

```text
Retell LLM: llm_5bf4bf80d471d52a9de7f0aec4a8
Retell Agent: agent_18dafa1d3bf6038320ad0be4a7
Retell Voice: custom_voice_2078deacf9cdf5096ba2124a06
Phone number: +1 (431) 500-6652
```

Known current status:

```text
Published Retell agent version: 0
Current Retell draft version: 1
Inbound number attached: yes
Google Sheet Retell live-call row verification: pending
```

## n8n state

n8n work is prepared but not fully complete.

Known current status:

```text
Repository workflow export: prepared
Live n8n workflow: created
Runtime configuration: pending
Manual backend HTTP 201 validation: pending
Google Sheet row verification: pending
```

Do not mark the n8n path complete until the runtime configuration is complete, a manual execution returns HTTP 201, and the Google Sheet row is verified.

## Business rules that must remain unchanged

Delivery:

- Monday to Saturday only.
- 10:00am to 7:00pm.
- No Sunday delivery.
- Minimum delivery order: ₦3,000.
- Payment before dispatch.

Delivery fees:

- Wuse 2, Maitama, Asokoro, Central Area: ₦500.
- Garki, Utako, Jabi, Wuse 1: ₦800.
- Gwarinpa, Lugbe, Kubwa, Karu, Nyanya: ₦1,200.

Reservations:

- Groups of 5 or more only.
- At least 24 hours notice.
- ₦5,000 deposit.
- Deposit goes toward the bill.

Specials:

- Friday Catfish Pepper Soup with Agidi: ₦3,500, Fridays from 12pm until finished, no advance orders.
- Sunday Family Meal Deal: ₦7,000.

## Open validation items

1. Confirm Retell tool authentication header is configured without exposing the value.
2. Place live inbound calls through `+1 (431) 500-6652`.
3. Verify Google Sheets rows from Retell calls.
4. Capture sanitized evidence.
5. Finish n8n runtime configuration and validation.
6. Keep documentation aligned with the client-delivery narrative.

## Security rules

- Never commit credentials.
- Never commit `.env`.
- Never display credentials in screenshots, recordings, issues, pull requests, transcripts, or documentation.
- Rotate exposed credentials immediately.
- Keep Google Workload Identity Federation for production.
- Keep the backend as the validation and authorization boundary.
