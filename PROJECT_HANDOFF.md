# Mama Tee's Kitchen AI Voice Concierge Engineering Handoff

## Project summary

Mama Tee's Kitchen contracted InfraForge to deliver a practical phone-based AI concierge that can answer common restaurant questions, collect structured customer requests, and write visible call logs for staff review.

The implementation uses a deliberately lean architecture: Retell AI for phone calls, ElevenLabs for the custom voice, a Vercel-hosted Node.js backend for authentication and validation, n8n as a workflow automation bridge, and Google Sheets as the visible operations log.

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

## n8n automation bridge path

```text
Voice platform or HTTP caller
  -> n8n Automation Bridge
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

n8n is an automation layer. It forwards to the backend and does not become the system of record.

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

## n8n Automation Bridge state

The n8n Automation Bridge is active and validated.

```text
Workflow name: Mama Tee - n8n Automation Bridge
Workflow ID: FpRh13SdgO1NmEEe
Active version: 47640a03-39b8-4552-bfd5-1d5fa8a990dd
Production webhook: https://n8n-uev8.onrender.com/webhook/mama-tees-automation-bridge-call-log
Backend validation through n8n: HTTP 201
Google Sheet row verification: complete
Verified call_id: issue-5-n8n-automation-bridge-validation
Verified source: n8n_automation_bridge
```

## Demo script

Use the screen-by-screen recording script at:

```text
docs/CLIENT_DEMO_SCRIPT.md
```

It contains tab setup, click paths, narration, live-call prompts, n8n validation command, and Google Sheets evidence checks.

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
5. Keep documentation aligned with the client-delivery narrative.

## Security rules

- Never commit credentials.
- Never commit `.env`.
- Never display credentials in screenshots, recordings, issues, pull requests, transcripts, or documentation.
- Rotate exposed credentials immediately.
- Keep Google Workload Identity Federation for production.
- Keep the backend as the validation and authorization boundary.
