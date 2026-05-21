# Test Plan

## Scope

This test plan validates the Mama Tee's Kitchen AI Voice Concierge backend, Google Sheets logging path, Retell voice-agent path, and optional n8n fallback path.

## Validation commands

Install dependencies:

```bash
npm ci
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Optional audit:

```bash
npm audit --omit=dev
```

## Backend tests

Run automated tests for:

- payload validation,
- webhook authentication,
- business rules,
- confirmation summaries,
- logging sink behavior,
- sanitized errors.

Expected result:

```text
All tests pass.
```

## Production readiness validation

```bash
curl https://mama-tees-ai-concierge.vercel.app/readiness
```

Expected result:

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

## Google Sheets validation

Send a safe validation payload through the backend and confirm a row appears in:

```text
Mama Tee's Kitchen Call Logs / Call Logs
```

The row should include:

- request type,
- customer name,
- phone number,
- confirmation summary,
- status,
- source,
- call ID,
- timestamp.

## Retell live-call validation

Call:

```text
+1 (431) 500-6652
```

Required scenarios:

1. Opening-hours FAQ.
2. Menu and price FAQ.
3. Delivery order to Wuse 2.
4. Sunday delivery rejection.
5. Invalid reservation for 4 guests.
6. Valid reservation for 5 or more guests.
7. Callback request for an unsupported or uncertain request.
8. Pronunciation check for naira amounts, times, Nigerian food terms, and Abuja location names.

Expected results:

- assistant discloses it is automated,
- answers stay within approved knowledge,
- business rules are enforced,
- confirmed requests write to Google Sheets,
- unsupported requests become callback logs.

## n8n fallback validation

Only run after the n8n runtime variable is configured securely and the live workflow is updated from the repository export.

Payload:

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

Expected results:

```text
n8n execution status=success
backend_status=201
Google Sheet row contains source=n8n_fallback
Google Sheet row contains call_id=issue-5-n8n-fallback-validation
```

## Evidence handling

Do not expose:

- webhook values,
- API keys,
- private keys,
- Retell credentials,
- ElevenLabs credentials,
- Vercel environment values,
- Google credential material,
- billing pages,
- account security pages.
