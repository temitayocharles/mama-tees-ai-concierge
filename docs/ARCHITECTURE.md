# Architecture

## Selected architecture

```text
Customer phone call
  -> Retell AI phone agent
  -> ElevenLabs custom voice
  -> Node.js backend API
  -> Google Sheets visible log
```

Optional fallback or extension:

```text
Customer phone call
  -> Voice platform
  -> n8n webhook
  -> Google Sheets visible log
```

## Why this architecture

The capstone brief requires a working voice assistant, accurate knowledge-base behavior, structured data capture, automation, and a visible log. It does not require any specific vendor.

Retell AI plus ElevenLabs was selected because:

- It avoids overusing Vapi if many submissions use it.
- It keeps the project differentiated through the custom ElevenLabs voice.
- It still satisfies the core requirement: live voice agent plus structured logging.
- It lets the Node.js backend enforce business rules before records hit Google Sheets.

## Components

| Component | Role |
|---|---|
| Retell AI | Phone-call voice agent layer. |
| ElevenLabs | Custom voice provider. |
| Node.js backend | Secured webhook, payload validation, business rules, logging. |
| Google Sheets | Visible owner-facing log. |
| n8n | Optional automation fallback or extension. |
| Composio | Optional connector layer for future enhancements. |

## Backend API

### Health

```text
GET /healthz
```

Expected:

```json
{"status":"ok"}
```

### Readiness

```text
GET /readiness
```

Expected:

```json
{
  "status": "ready",
  "log_destination": "google_sheets",
  "business_timezone": "Africa/Lagos"
}
```

### Call logging

```text
POST /api/call-logs
```

Required header:

```text
X-Webhook-Secret: <configured secret>
```

Purpose:

- Log confirmed orders.
- Log confirmed reservations.
- Log callback requests.
- Log complaints, catering requests, or general inquiries.

## Data flow

```text
1. Customer calls the Retell phone number.
2. Retell agent answers using the approved system prompt.
3. Agent answers FAQ questions from the knowledge base.
4. If customer wants an order/reservation/callback, agent collects required details.
5. Agent repeats the summary and asks for confirmation.
6. After confirmation, agent calls POST /api/call-logs.
7. Backend validates request body and business rules.
8. Backend appends row to Google Sheets.
9. Owner reviews the row.
```

## Business-rule enforcement

Implemented in:

```text
src/domain/businessRules.ts
```

Rules enforced:

- Delivery only applies to delivery orders.
- No Sunday delivery.
- Delivery hours are 10:00am to 7:00pm.
- Minimum delivery order is ₦3,000.
- Delivery area fee lookup.
- Reservations require at least 5 guests.
- Reservations require at least 24 hours notice.

## Source of truth

The capstone brief facts are documented in:

```text
docs/CAPSTONE_BRIEF_REQUIREMENTS.md
```

Do not update prompts, backend rules, or tests without checking that document first.

## Security design

- Webhook endpoint requires `X-Webhook-Secret`.
- Secrets are configured through environment variables.
- Google Sheets access should be limited to the target spreadsheet.
- `.env` is ignored by Git.
- Logs redact sensitive headers.
- The assistant must disclose it is automated.

## Reliability considerations

- Backend should be deployed to an always-on host before Loom recording.
- Google Sheets is acceptable for capstone logging but not ideal for high-volume production use.
- Local JSONL logging is for development only.
- n8n should be treated as fallback or extension unless it is tested end to end.

## Future production improvements

- Add rate limiting.
- Add request signing or HMAC validation.
- Add structured audit logs.
- Add dead-letter queue for failed Sheet writes.
- Add monitoring and alerting.
- Add authenticated admin dashboard.
- Add data retention policy.
