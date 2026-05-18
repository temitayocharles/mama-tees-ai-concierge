# Test Plan

## Purpose

Validate that the capstone works against the uploaded brief before recording the Loom demo.

## Local backend tests

Run:

```bash
npm install
npm run build
npm test
```

Expected:

```text
TypeScript build passes.
All tests pass.
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

## Backend security tests

### Missing secret

```bash
curl -X POST http://localhost:8080/api/call-logs \
  -H "Content-Type: application/json" \
  --data-binary @examples/order-log.json
```

Expected:

```text
HTTP 401
```

### Invalid secret

```bash
curl -X POST http://localhost:8080/api/call-logs \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: wrong-secret" \
  --data-binary @examples/order-log.json
```

Expected:

```text
HTTP 401
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

## Voice-agent tests

Use the selected voice platform, currently Retell AI with ElevenLabs custom voice.

### Test 1: Opening hours

Caller asks:

```text
What time do you close on Saturday?
```

Expected:

```text
Saturday closing time is 10:00pm.
```

### Test 2: Price calculation

Caller asks:

```text
How much is large Jollof Rice with chicken and Malt?
```

Expected:

```text
Large Jollof Rice is ₦2,500, chicken is ₦1,000, and Malt is ₦500. The total is ₦4,000.
```

### Test 3: Delivery order

Caller places a delivery order to Wuse 2.

Expected:

- Assistant collects name.
- Assistant collects phone number.
- Assistant collects order items.
- Assistant collects delivery address.
- Assistant applies ₦500 delivery fee.
- Assistant says payment is required before dispatch.
- Assistant confirms details before logging.
- Google Sheet receives a new order row.

### Test 4: Sunday delivery

Caller asks for delivery on Sunday.

Expected:

```text
Delivery is not available on Sundays. Pickup or walk-in is available.
```

### Test 5: Reservation for 4 guests

Caller asks to reserve for 4 people.

Expected:

```text
Reservations are only for groups of 5 or more. For fewer than 5 guests, walk-ins are welcome.
```

### Test 6: Valid reservation

Caller reserves for 6 people more than 24 hours ahead.

Expected:

- Assistant collects name.
- Assistant collects phone number.
- Assistant collects date and time.
- Assistant mentions ₦5,000 deposit.
- Assistant confirms details.
- Google Sheet receives a new reservation row.

### Test 7: Unknown request

Caller asks a question outside the knowledge base.

Expected:

- Assistant does not invent an answer.
- Assistant offers callback.
- Assistant collects name and phone number.
- Assistant logs callback request.

## Google Sheet validation

After each voice test, confirm:

- A new row appears.
- `request_type` is correct.
- `customer_name` and `phone_number` are populated.
- Relevant order, reservation, or callback fields are populated.
- `confirmation_summary` is understandable.
- `status` is `new`.

## Pass criteria

The project is demo-ready only when:

- Backend health check passes.
- At least one order logs successfully.
- At least one valid reservation logs successfully.
- At least one callback logs successfully.
- Invalid delivery/reservation scenarios are handled correctly.
- Voice responses are audible and clear enough for Loom grading.
