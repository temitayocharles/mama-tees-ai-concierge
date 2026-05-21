# Client Requirements

## Client

Mama Tee's Kitchen.

## Delivery partner

InfraForge.

## Business need

Mama Tee's Kitchen needed a phone-first assistant that could handle common customer calls, reduce missed inquiries, collect structured requests, and give staff a simple visible call log.

The chosen implementation deliberately avoids unnecessary infrastructure. It uses managed voice tooling, a secure backend, and Google Sheets as the operations-facing log.

## Required outcomes

The system must:

- answer common restaurant questions accurately,
- disclose that the caller is speaking with an automated assistant,
- collect structured orders, reservations, callback requests, complaints, catering requests, and general inquiries,
- enforce delivery and reservation rules,
- avoid inventing menu items, prices, discounts, policies, or availability,
- send confirmed requests to the backend only after caller confirmation,
- write accepted call logs to Google Sheets,
- keep credentials out of prompts, documentation, screenshots, transcripts, and recordings.

## Primary architecture

```text
Retell AI phone agent
  -> ElevenLabs custom voice
  -> Vercel Node.js backend webhook
  -> Google Sheets visible call log
```

## Optional fallback architecture

```text
Voice platform or HTTP caller
  -> n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

n8n must remain optional and must not replace the primary Retell path. The preferred n8n design forwards to the backend rather than writing directly to Google Sheets.

## Business rules

### Delivery

- Monday to Saturday only.
- Delivery hours: 10:00am to 7:00pm.
- No Sunday delivery.
- Minimum delivery order: ₦3,000.
- Payment before dispatch.

### Delivery fees

- Wuse 2, Maitama, Asokoro, Central Area: ₦500.
- Garki, Utako, Jabi, Wuse 1: ₦800.
- Gwarinpa, Lugbe, Kubwa, Karu, Nyanya: ₦1,200.

### Reservations

- Groups of 5 or more only.
- At least 24 hours notice.
- Reservation deposit: ₦5,000.
- Deposit goes toward the bill.

### Specials

- Friday Catfish Pepper Soup with Agidi is ₦3,500, Fridays from 12pm until finished, no advance orders.
- Sunday Family Meal Deal is ₦7,000.

## Acceptance evidence

The delivery is considered validated when the following evidence is available:

- backend readiness returns ready status,
- Google Sheets logging works through the backend,
- Retell phone number is attached and reachable,
- Retell live call writes verified rows to Google Sheets,
- invalid delivery and reservation scenarios are handled correctly,
- n8n fallback is validated only if used as an optional extension,
- no credentials are exposed in public artifacts.
