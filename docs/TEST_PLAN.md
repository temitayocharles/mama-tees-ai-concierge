# Test Plan

## Purpose

Validate that the capstone works against the uploaded brief before recording the Loom demo.

The detailed issue #7 QA matrix is maintained in:

```text
docs/QA_ACCEPTANCE_MATRIX.md
```

## Test sequencing

Run tests in this order:

1. Local dependency, build, and unit tests.
2. Production health and readiness checks.
3. Backend webhook security checks.
4. Authenticated backend-to-Google-Sheets write check.
5. Retell/ElevenLabs live call checks.
6. Google Sheets evidence review.
7. Screenshot and Loom evidence capture.

Do not close issue #7 until live Retell phone-call tests pass and Google Sheet rows are verified.

## Local backend tests

Run from a clean checkout:

```bash
npm ci
npm run build
npm test
npm audit --omit=dev
```

Expected:

```text
npm ci completes successfully.
TypeScript build passes.
All tests pass.
npm audit --omit=dev has no unresolved critical production dependency issue.
```

## Local API smoke test

Start the backend:

```bash
cp .env.example .env
npm run dev
```

In another terminal:

```bash
WEBHOOK_SECRET=replace-with-a-long-random-secret ./scripts/test-api.sh
```

Expected:

```text
Order log: HTTP 201
Reservation log: HTTP 201
Callback log: HTTP 201
```

## Production backend tests

### Health

```bash
curl -i https://mama-tees-ai-concierge.vercel.app/healthz
```

Expected:

```text
HTTP/2 200
{"status":"ok"}
```

### Readiness

```bash
curl -i https://mama-tees-ai-concierge.vercel.app/readiness
```

Expected readiness fields:

```text
status=ready
webhook_auth_configured=true
log_destination=google_sheets
google_sheets_configured=true
google_sheets_auth_mode=workload_identity
business_timezone=Africa/Lagos
```

## Backend security tests

### Missing secret

```bash
curl -i -X POST https://mama-tees-ai-concierge.vercel.app/api/call-logs \
  -H "Content-Type: application/json" \
  --data-binary @examples/order-log.json
```

Expected:

```text
HTTP/2 401
{"error":"Unauthorized"}
```

### Invalid secret

```bash
curl -i -X POST https://mama-tees-ai-concierge.vercel.app/api/call-logs \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: wrong-secret" \
  --data-binary @examples/order-log.json
```

Expected:

```text
HTTP/2 401
{"error":"Unauthorized"}
```

## Authenticated Google Sheets write test

Run only with the current secret set in your shell. Do not paste the secret into GitHub, docs, screenshots, Loom, or chat.

```bash
curl -i -X POST https://mama-tees-ai-concierge.vercel.app/api/call-logs \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  --data-binary @examples/callback-log.json
```

Expected:

```text
HTTP/2 201
{"status":"logged", ...}
```

Then verify a new row appears in:

```text
Spreadsheet: Mama Tee's Kitchen Call Logs
Tab: Call Logs
```

## Business rule tests

| Scenario | Expected result |
|---|---|
| Delivery to Wuse 2 | Delivery fee is ₦500. |
| Delivery to Garki | Delivery fee is ₦800. |
| Delivery to Gwarinpa | Delivery fee is ₦1,200. |
| Sunday delivery | Rejected or warning produced. |
| Delivery below ₦3,000 | Rejected or warning produced. |
| Reservation for 4 guests | Rejected or warning produced. |
| Reservation less than 24 hours ahead | Rejected or warning produced. |
| Reservation for 6 guests more than 24 hours ahead | Accepted. |
| Friday Catfish Pepper Soup advance order | Rejected because there are no advance orders. |

## Voice-agent tests

Use Retell AI with the ElevenLabs voice imported into Retell.

Current configured objects:

```text
Retell Agent: agent_18dafa1d3bf6038320ad0be4a7
Retell LLM: llm_5bf4bf80d471d52a9de7f0aec4a8
Retell Voice: custom_voice_2078deacf9cdf5096ba2124a06
```

Live tests remain blocked until:

```text
Retell phone number is assigned.
Rotated X-Webhook-Secret is configured in Retell tool headers.
Agent is published.
```

Required voice tests:

1. Opening-hours FAQ.
2. Price/menu FAQ.
3. Delivery order to Wuse 2.
4. Sunday delivery rejection.
5. Reservation for 4 guests.
6. Valid reservation for 5 or more guests.
7. Unknown catering request converted into callback logging.
8. Pronunciation and numeric speech test.
9. Secret-handling test.

## Pronunciation and numeric speech tests

Confirm the assistant speaks these acceptably:

```text
N500 / ₦500 -> five hundred naira
N1,200 / ₦1,200 -> one thousand two hundred naira
N3,500 / ₦3,500 -> three thousand five hundred naira
10:00am -> 10am
0123456789 -> zero, one, two, three, four, five, six, seven, eight, nine
Agidi
Egusi
Ewedu
Gbegiri
Shaki
Ponmo
Eba
Amala
Adetokunbo Ademola Crescent
Wuse
Abuja
```

## Google Sheet validation

After each voice test that should log data, confirm:

- A new row appears.
- `request_type` is correct.
- `customer_name` and `phone_number` are populated.
- Relevant order, reservation, callback, complaint, or catering fields are populated.
- `confirmation_summary` is understandable.
- `status` is `new`.
- `source` is `retell_ai` for Retell-originated calls.
- No secrets appear in `raw_transcript` or any notes fields.

## Pass criteria

The project is demo-ready only when:

- Backend health check passes.
- Backend readiness check passes.
- At least one order logs successfully.
- At least one valid reservation logs successfully.
- At least one callback or complaint logs successfully.
- Invalid delivery/reservation scenarios are handled correctly.
- Voice responses are audible and clear enough for Loom grading.
- Pronunciation and numeric speech are acceptable.
- No secrets are exposed in evidence.
