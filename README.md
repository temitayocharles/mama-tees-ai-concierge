# Mama Tee's Kitchen AI Voice Concierge

AI-powered phone concierge built for Mama Tee's Kitchen by InfraForge.

The system gives the restaurant a practical, low-cost voice automation path for customer calls, order capture, reservation handling, callback requests, and visible operations logging. It is intentionally simple: a managed voice agent, a secure Node.js webhook backend, and Google Sheets as the business-visible call log.

## Delivery context

Mama Tee's Kitchen needed a phone-first assistant that could reduce missed calls, answer common customer questions, collect structured requests, and give staff a visible call log without adding a database or heavy operational overhead.

The selected implementation prioritizes:

- fast deployment,
- low operating cost,
- clear business-rule enforcement,
- visible call-log review for staff,
- secure webhook authentication,
- minimal infrastructure burden,
- a credible path to future production hardening.

## Primary architecture

```text
Customer phone call
  -> Retell AI phone agent using ElevenLabs custom voice
  -> Vercel Node.js backend webhook
  -> Google Sheets visible call log
```

Optional fallback and extension path:

```text
Voice platform or HTTP caller
  -> n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

n8n is not the core production path. It is an optional integration layer and should forward to the backend rather than writing directly to Google Sheets. The backend remains the authority for authentication, payload validation, business rules, confirmation summaries, sanitized errors, and the Google Sheets schema.

## What the system does

The assistant supports restaurant operations by helping callers with:

- menu, pricing, opening hours, delivery, pickup, reservations, payment, catering, seating, halal status, and complaint questions,
- structured order requests,
- structured reservation requests,
- callback and complaint logging,
- delivery-policy enforcement,
- reservation-policy enforcement,
- safe fallback when a request is outside the supported scope.

The assistant must disclose that it is automated and must not invent menu items, prices, discounts, policies, or availability.

## Business rules enforced

Delivery:

- Monday to Saturday only.
- Delivery hours: 10:00am to 7:00pm.
- No Sunday delivery.
- Minimum delivery order: ₦3,000.
- Payment before dispatch.

Delivery fees:

- Wuse 2, Maitama, Asokoro, Central Area: ₦500.
- Garki, Utako, Jabi, Wuse 1: ₦800.
- Gwarinpa, Lugbe, Kubwa, Karu, Nyanya: ₦1,200.

Reservations:

- Only for groups of 5 or more.
- At least 24 hours notice required.
- Reservation deposit: ₦5,000.
- Deposit goes toward the bill.

Specials:

- Friday Catfish Pepper Soup with Agidi: ₦3,500, Fridays from 12pm until finished, no advance orders.
- Sunday Family Meal Deal: ₦7,000.

## Live production backend

```text
https://mama-tees-ai-concierge.vercel.app
```

Endpoints:

```text
GET  /healthz
GET  /readiness
POST /api/call-logs
```

Expected production readiness:

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

## Persistence model

There is no application database.

Google Sheets is the visible call-log persistence layer for this implementation.

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
```

Production Google authentication path:

```text
Vercel OIDC
  -> Google Workload Identity Federation
  -> service account impersonation
  -> Google Sheets append
```

Do not use Google private keys for production.

## Current voice-agent configuration

Retell AI objects configured for the Mama Tee voice path:

```text
Retell LLM: llm_5bf4bf80d471d52a9de7f0aec4a8
Retell Agent: agent_18dafa1d3bf6038320ad0be4a7
Retell Voice: custom_voice_2078deacf9cdf5096ba2124a06
Phone number: +1 (431) 500-6652
```

The live-call validation path still requires successful inbound test calls and verified Google Sheets rows before the voice path is treated as fully validated.

## n8n status

The n8n fallback package has been prepared and a live workflow was created, but the fallback path is not fully validated yet.

Current known blockers before n8n can be considered complete:

- required n8n runtime variable must be configured securely,
- live n8n workflow must be updated or re-imported from the repository export,
- manual execution must return backend HTTP 201,
- Google Sheet row must be verified,
- evidence must be captured without exposing credentials.

## Repository layout

```text
.
├── .github/workflows/ci.yml
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CLIENT_REQUIREMENTS.md
│   ├── DEPLOYMENT.md
│   ├── GOOGLE_SHEETS_SETUP.md
│   ├── N8N_WORKFLOW_SETUP.md
│   ├── QA_ACCEPTANCE_MATRIX.md
│   ├── TEST_PLAN.md
│   └── VOICE_AGENT_PLATFORM_SETUP.md
├── examples/
├── n8n/
├── prompts/
│   ├── voice-agent-system-prompt.md
│   └── voice-agent-tool-schema.md
├── scripts/
├── src/
└── tests/
```

## Local development

Install dependencies:

```bash
npm ci
```

Create a local environment file:

```bash
cp .env.example .env
```

For local development without Google Sheets, use local JSON logging:

```bash
LOG_DESTINATION=local_json
```

Run locally:

```bash
npm run dev
```

Expected result:

```text
Mama Tee's Kitchen concierge API listening on port 8080
```

Health check:

```bash
curl http://localhost:8080/healthz
```

Expected result:

```json
{"status":"ok"}
```

Run validation:

```bash
npm ci
npm run build
npm test
```

Optional audit:

```bash
npm audit --omit=dev
```

## Security notes

- Do not commit `.env` files.
- Do not hard-code webhook values, API keys, Google credentials, Retell credentials, ElevenLabs credentials, or Vercel environment values.
- Use `WEBHOOK_SECRET` and require the voice platform to send it in the `X-Webhook-Secret` header.
- Keep Google production authentication on Workload Identity Federation.
- Restrict service account permissions to the target spreadsheet.
- Do not expose credentials in screenshots, recordings, pull requests, issue comments, transcripts, or documentation.
- Rotate any credential that is accidentally exposed.

## Delivery evidence still required

Before this project should be presented as fully live-validated, capture evidence for:

- backend readiness,
- Retell phone number routing,
- inbound call behavior,
- successful call-log write to Google Sheets,
- invalid delivery and reservation rule handling,
- optional n8n fallback execution after runtime configuration is complete.
