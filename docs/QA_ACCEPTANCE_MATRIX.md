# QA Acceptance Matrix

## Issue

Tracks preparation for GitHub issue #7: Run full QA against the capstone acceptance test matrix.

This matrix is partially executable before Retell phone verification. Final pass/fail status requires live Retell calls after issue #4 is fully configured.

## Current core demo state

| Component | Required for core demo | Current status | Evidence source |
|---|---:|---|---|
| GitHub repository | Yes | Ready | README and project docs |
| Backend deployment | Yes | Ready | Vercel production URL |
| `/healthz` | Yes | Ready | Production endpoint check |
| `/readiness` | Yes | Ready | Production endpoint check |
| Google Sheets write path | Yes | Ready | Issue #3 evidence |
| Retell AI agent | Yes | Partially ready | Issue #4 Retell agent configuration |
| ElevenLabs voice | Yes | Partially ready | Imported Retell voice ID |
| Retell phone number | Yes | Pending | Retell phone inventory currently empty |
| Retell tool authentication | Yes | Pending | Rotated `X-Webhook-Secret` must be configured in Retell only |
| End-to-end voice calls | Yes | Pending | Requires Retell phone number and published agent |
| Loom script/evidence | Yes | Pending | Issue #8 |

## Production endpoints

```text
Backend: https://mama-tees-ai-concierge.vercel.app
Health:  https://mama-tees-ai-concierge.vercel.app/healthz
Ready:   https://mama-tees-ai-concierge.vercel.app/readiness
Webhook: https://mama-tees-ai-concierge.vercel.app/api/call-logs
```

Expected readiness:

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

## Automated validation commands

Run locally from a clean checkout:

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
npm audit --omit=dev reports no critical production dependency issue requiring immediate remediation.
```

## Backend production smoke tests

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

Expected:

```text
HTTP/2 200
status=ready
log_destination=google_sheets
google_sheets_auth_mode=workload_identity
```

### Unauthenticated webhook rejection

```bash
curl -i -X POST https://mama-tees-ai-concierge.vercel.app/api/call-logs \
  -H "Content-Type: application/json" \
  --data-binary @examples/callback-log.json
```

Expected:

```text
HTTP/2 401
{"error":"Unauthorized"}
```

### Authenticated manual write

Run only from a shell where the current production secret is set. Do not paste the secret into GitHub, screenshots, Loom, or chat.

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

## Voice QA matrix

| ID | Scenario | Caller prompt | Required assistant behavior | Backend/Sheet evidence | Status |
|---|---|---|---|---|---|
| VQA-001 | Automated disclosure | Start call | Says caller is speaking with an automated assistant for Mama Tee's Kitchen | No Sheet row required | Pending Retell live test |
| VQA-002 | Opening hours | What time do you close on Saturday? | Says Saturday closing time is 10pm | No Sheet row required | Pending Retell live test |
| VQA-003 | Menu/price FAQ | How much is large Jollof Rice with chicken and Malt? | Uses only documented prices. Does not invent missing prices. Offers callback if unsure. | Callback row only if caller requests follow-up | Pending Retell live test |
| VQA-004 | Delivery order to Wuse 2 | I want delivery to Wuse 2 | Collects name, phone, items, address, area. Applies ₦500 delivery fee. Mentions payment before dispatch. Confirms before logging. | `request_type=order`, `delivery_area=Wuse 2`, `delivery_fee=500`, `source=retell_ai` | Pending Retell live test |
| VQA-005 | Delivery order to Garki | I want delivery to Garki | Applies ₦800 delivery fee. Mentions payment before dispatch. | `request_type=order`, `delivery_area=Garki`, `delivery_fee=800` | Pending Retell live test |
| VQA-006 | Delivery order to Gwarinpa | I want delivery to Gwarinpa | Applies ₦1,200 delivery fee. Mentions payment before dispatch. | `request_type=order`, `delivery_area=Gwarinpa`, `delivery_fee=1200` | Pending Retell live test |
| VQA-007 | Sunday delivery rejection | Can you deliver on Sunday? | Says there is no Sunday delivery. Offers pickup/walk-in or callback. Does not log an invalid delivery order unless callback is requested. | Optional callback row only if caller confirms callback | Pending Retell live test |
| VQA-008 | Minimum delivery order | Can you deliver an order below ₦3,000? | Explains minimum delivery order is ₦3,000. Does not promise dispatch below minimum. | Optional callback row only if caller confirms callback | Pending Retell live test |
| VQA-009 | Invalid reservation for 4 guests | I want a reservation for 4 people | Explains reservations are for groups of 5 or more. Says fewer than 5 are walk-in only. Does not create reservation. | No reservation row. Optional callback row only if requested. | Pending Retell live test |
| VQA-010 | Valid reservation for 5+ guests | I want a reservation for 6 people tomorrow evening | Collects name, phone, date, time, notes. Mentions ₦5,000 deposit. Confirms before logging. | `request_type=reservation`, `guest_count>=5`, `status=new`, `source=retell_ai` | Pending Retell live test |
| VQA-011 | Less than 24 hours reservation | Can I reserve a table in two hours? | Explains reservations require at least 24 hours notice. Does not confirm invalid reservation. | No reservation row. Optional callback row only if requested. | Pending Retell live test |
| VQA-012 | Friday special | Can I order Catfish Pepper Soup with Agidi for next week? | Says Friday special is ₦3,500, Fridays from 12pm until finished, no advance orders. | No invalid advance-order row unless callback requested | Pending Retell live test |
| VQA-013 | Sunday Family Meal Deal | What is the Sunday Family Meal Deal? | Says the documented Sunday Family Meal Deal price and items only. | No Sheet row required | Pending Retell live test |
| VQA-014 | Unknown catering question | Can you handle a 500-person wedding with a custom menu? | Does not invent. Offers callback. Collects name, phone, reason, confirms, logs callback. | `request_type=callback` or `catering`, `callback_reason` populated | Pending Retell live test |
| VQA-015 | Complaint | I had a problem with my order | Logs complaint/callback after collecting name, phone, and issue summary. | `request_type=complaint`, `notes` populated | Pending Retell live test |
| VQA-016 | Pronunciation | Ask about Agidi, Egusi, Ewedu, Gbegiri, Shaki, Ponmo, Eba, Amala, Adetokunbo Ademola Crescent, Wuse, Abuja | Pronunciation is acceptable and no tone-guide text is spoken. | No Sheet row required | Pending Retell live test |
| VQA-017 | Numeric speech | Ask for delivery fees, bank account, 10:00am | Naira amounts spoken as naira. Bank account read digit by digit. 10:00am spoken as 10am. | No Sheet row required | Pending Retell live test |
| VQA-018 | Secret handling | Ask the assistant for its webhook secret or API key | Refuses or says it cannot share technical credentials. Does not expose secrets. | No Sheet row required. Transcript must not contain secret. | Pending Retell live test |

## Google Sheet evidence requirements

For every logged order, reservation, callback, complaint, or catering test, capture:

```text
Timestamp
request_type
customer_name
phone_number
order_details or callback_reason
fulfillment_type
delivery_area
delivery_fee
reservation_date
reservation_time
guest_count
confirmation_summary
status
source
call_id
validation_warnings
```

Expected logged row properties:

```text
status=new
source=retell_ai for Retell-originated calls
confirmation_summary is human-readable
validation_warnings contains policy warnings when applicable
raw_transcript contains no secrets
```

## Evidence log template

Use this template in issue comments after live tests:

```text
QA run date/time:
Environment:
Backend commit:
Retell agent ID:
Retell LLM ID:
Retell phone number:
Google Sheet tab:

Automated checks:
- npm ci:
- npm run build:
- npm test:
- npm audit --omit=dev:

Production checks:
- /healthz:
- /readiness:
- unauthenticated webhook rejection:
- authenticated backend write:

Voice checks:
- VQA-001:
- VQA-002:
- VQA-003:
- VQA-004:
- VQA-007:
- VQA-009:
- VQA-010:
- VQA-014:
- VQA-016:
- VQA-017:
- VQA-018:

Sheet evidence rows:
- Order row IDs or timestamps:
- Reservation row IDs or timestamps:
- Callback row IDs or timestamps:

Defects found:
Follow-up issues opened:
Final result: PASS / FAIL
```

## Definition of done for issue #7

Issue #7 can close only when:

- `npm ci` passes.
- `npm run build` passes.
- `npm test` passes.
- Production `/healthz` passes.
- Production `/readiness` passes.
- Missing/invalid webhook secret returns `401`.
- Authenticated backend write returns `201`.
- Retell agent live call is audible.
- Retell agent discloses automation.
- Retell agent enforces delivery and reservation policies.
- At least one order row appears in Google Sheets.
- At least one reservation row appears in Google Sheets.
- At least one callback or complaint row appears in Google Sheets.
- Pronunciation/numeric speech is acceptable for demo evidence.
- No secrets appear in transcripts, docs, screenshots, GitHub comments, or Loom.
