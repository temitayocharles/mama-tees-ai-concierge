# Voice Agent Platform Setup

## Primary voice stack

```text
Retell AI phone agent
  -> ElevenLabs custom voice
  -> Vercel Node.js backend webhook
  -> Google Sheets visible call log
```

The backend remains the control boundary for authentication, validation, delivery rules, reservation rules, sanitized errors, and call-log persistence.

## Configured Retell objects

```text
Retell LLM: llm_5bf4bf80d471d52a9de7f0aec4a8
Retell Agent: agent_18dafa1d3bf6038320ad0be4a7
Retell Voice: custom_voice_2078deacf9cdf5096ba2124a06
Phone number: +1 (431) 500-6652
```

Retell phone routing:

```text
Inbound agent: agent_18dafa1d3bf6038320ad0be4a7
Outbound agent: agent_18dafa1d3bf6038320ad0be4a7 version 0
Published agent version: 0
Current draft agent version: 1
```

## Production backend

```text
https://mama-tees-ai-concierge.vercel.app
```

Tool endpoint:

```text
POST https://mama-tees-ai-concierge.vercel.app/api/call-logs
```

The voice tool must send:

```text
Content-Type: application/json
X-Webhook-Secret: configured securely in Retell only
```

Do not place the header value in the prompt, repository, screenshots, transcripts, or recordings.

## Assistant behavior requirements

The assistant must:

- identify itself as automated,
- answer only from the approved restaurant knowledge base,
- ask one question at a time,
- confirm details before logging,
- enforce delivery and reservation policies,
- log confirmed orders, reservations, callbacks, complaints, catering requests, and general inquiries,
- offer callback logging when a request is outside supported scope,
- avoid collecting card details or banking passwords,
- avoid promising unsupported delivery areas or availability.

## Validation calls

Run live calls through:

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
8. Pronunciation check for naira amounts, 10am, Agidi, Egusi, Ewedu, Gbegiri, Shaki, Ponmo, Eba, Amala, Adetokunbo Ademola Crescent, Wuse, and Abuja.

Expected evidence:

- caller hears automated-assistant disclosure,
- policies are followed,
- confirmed tool calls write rows to Google Sheets,
- no credentials appear in evidence,
- unsupported requests become callback logs rather than invented answers.

## Optional automation fallback

n8n is an optional fallback and extension path:

```text
Voice platform or HTTP caller
  -> n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

Do not use n8n to bypass the backend validation layer.
