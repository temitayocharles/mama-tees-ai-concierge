# QA Acceptance Matrix

## Purpose

This matrix verifies that Mama Tee's Kitchen AI Voice Concierge behaves correctly across backend logging, Google Sheets persistence, Retell voice calls, and optional n8n fallback automation.

## Acceptance summary

| Area | Requirement | Status |
|---|---|---|
| Backend | `/healthz` returns healthy status | Complete |
| Backend | `/readiness` confirms webhook auth and Google Sheets configuration | Complete |
| Backend | `POST /api/call-logs` validates payloads | Complete |
| Backend | Invalid requests return sanitized errors | Complete |
| Google Sheets | Backend writes rows to `Call Logs` | Complete |
| Google Sheets | Production auth uses Workload Identity Federation | Complete |
| Voice | Retell LLM configured | Complete |
| Voice | ElevenLabs voice imported into Retell | Complete |
| Voice | Retell phone number assigned | Complete |
| Voice | Agent published for live phone path | Complete |
| Voice | Live inbound call creates Google Sheet row | Pending |
| n8n | Fallback workflow export prepared | Complete |
| n8n | Live workflow runtime configured | Pending |
| n8n | Manual execution returns backend HTTP 201 | Pending |
| n8n | Google Sheet row from n8n validation exists | Pending |

## Backend test cases

| ID | Scenario | Expected result |
|---|---|---|
| API-001 | Health check | HTTP 200 with `{ "status": "ok" }` |
| API-002 | Readiness check | HTTP 200 with ready status and Google Sheets configuration |
| API-003 | Valid order log | HTTP 201 and appended row |
| API-004 | Valid reservation log | HTTP 201 and appended row |
| API-005 | Valid callback log | HTTP 201 and appended row |
| API-006 | Missing required fields | HTTP 400 with sanitized validation error |
| API-007 | Missing or invalid webhook header | HTTP 401 with sanitized auth error |
| API-008 | Unsupported delivery request | Rejected according to delivery rules |
| API-009 | Invalid reservation under 5 guests | Rejected according to reservation rules |

## Voice call test cases

| ID | Scenario | Expected result |
|---|---|---|
| VOICE-001 | Greeting | Assistant identifies itself as automated |
| VOICE-002 | Opening-hours FAQ | Accurate hours returned |
| VOICE-003 | Menu and price FAQ | No unsupported items or prices invented |
| VOICE-004 | Delivery order to Wuse 2 | Delivery fee ₦500 and payment-before-dispatch rule stated |
| VOICE-005 | Sunday delivery request | Sunday delivery rejected |
| VOICE-006 | Reservation for 4 guests | Walk-in policy explained, no reservation logged |
| VOICE-007 | Reservation for at least 5 guests | Deposit and 24-hour notice rules stated |
| VOICE-008 | Callback request | Confirmed callback request logged |
| VOICE-009 | Pronunciation and speech normalization | Nigerian terms, naira amounts, and times are spoken naturally |

## n8n fallback test case

| ID | Scenario | Expected result |
|---|---|---|
| N8N-001 | Send documented validation payload to n8n webhook | n8n forwards to backend, backend returns HTTP 201, Google Sheet row appears |

Validation payload identifier:

```text
call_id=issue-5-n8n-fallback-validation
```

## Evidence requirements

Capture evidence without exposing credentials or account security pages:

- backend readiness,
- successful backend write,
- Retell phone number routing,
- Retell live call result,
- Google Sheet row after live call,
- optional n8n execution after runtime configuration is complete.
