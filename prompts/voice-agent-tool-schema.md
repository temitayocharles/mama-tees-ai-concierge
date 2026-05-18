# Voice Agent Tool Schema

Use this tool after the caller has confirmed an order, reservation, callback request, complaint, catering request, or general inquiry.

## Endpoint

```text
POST https://YOUR_DEPLOYED_BACKEND_URL/api/call-logs
```

## Headers

```json
{
  "Content-Type": "application/json",
  "X-Webhook-Secret": "YOUR_WEBHOOK_SECRET"
}
```

## Body schema

```json
{
  "request_type": "order | reservation | callback | complaint | catering | general_inquiry",
  "customer_name": "string",
  "phone_number": "string",
  "order_details": "string, optional",
  "order_total": 0,
  "fulfillment_type": "pickup | delivery | walk_in | not_applicable",
  "delivery_address": "string, optional",
  "delivery_area": "string, optional",
  "delivery_fee": 0,
  "reservation_date": "YYYY-MM-DD, optional",
  "reservation_time": "HH:mm:ss, optional",
  "guest_count": 0,
  "callback_reason": "string, optional",
  "notes": "string, optional",
  "confirmation_summary": "string",
  "status": "new",
  "source": "retell_ai | elevenlabs | voice_agent | n8n",
  "call_id": "string, optional",
  "raw_transcript": "string, optional"
}
```

## Required by request type

### Order

```json
{
  "request_type": "order",
  "customer_name": "Ada Okafor",
  "phone_number": "08012345678",
  "order_details": "1 large Jollof Rice, 1 chicken, 1 Malt. Extra pepper.",
  "order_total": 4000,
  "fulfillment_type": "delivery",
  "delivery_address": "22 Aminu Kano Crescent, Wuse 2, Abuja",
  "delivery_area": "Wuse 2",
  "confirmation_summary": "Order for Ada Okafor, phone 08012345678. Items: 1 large Jollof Rice, 1 chicken, 1 Malt. Delivery area: Wuse 2. Delivery fee: ₦500. Payment before dispatch."
}
```

### Reservation

```json
{
  "request_type": "reservation",
  "customer_name": "Chinedu Nwosu",
  "phone_number": "08087654321",
  "fulfillment_type": "not_applicable",
  "reservation_date": "2026-06-01",
  "reservation_time": "18:30:00",
  "guest_count": 6,
  "notes": "Birthday dinner.",
  "confirmation_summary": "Reservation for Chinedu Nwosu, phone 08087654321, 6 guests, on 2026-06-01 at 18:30. ₦5,000 deposit required."
}
```

### Callback

```json
{
  "request_type": "callback",
  "customer_name": "Aisha Bello",
  "phone_number": "08123450000",
  "fulfillment_type": "not_applicable",
  "callback_reason": "Customer asked about a custom corporate lunch package not listed in the knowledge base.",
  "confirmation_summary": "Callback request for Aisha Bello, phone 08123450000. Reason: custom corporate lunch package."
}
```

## Expected successful response

```json
{
  "status": "logged",
  "id": "generated-id",
  "validation_warnings": [],
  "confirmation_summary": "Summary saved to the log."
}
```

## Tool behavior rules

- Call the tool only after the caller confirms the summary.
- Do not call the tool for casual FAQ conversations unless the caller explicitly requests follow-up.
- If the tool fails, apologize briefly and tell the caller someone will follow up manually.
- Never expose the webhook secret to the caller.
