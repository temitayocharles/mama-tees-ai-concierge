# Retell AI and ElevenLabs Agent Configuration

## Issue

Tracks configuration progress for GitHub issue #4: Configure Retell AI phone agent with ElevenLabs custom voice.

## Selected architecture

```text
Retell AI phone agent
  -> ElevenLabs voice in Retell
  -> Vercel backend webhook
  -> Google Sheets call log
```

Production backend URL:

```text
https://mama-tees-ai-concierge.vercel.app
```

Production call-log endpoint:

```text
POST https://mama-tees-ai-concierge.vercel.app/api/call-logs
```

## Configured Retell objects

Retell LLM response engine:

```text
llm_5bf4bf80d471d52a9de7f0aec4a8
```

Retell voice agent:

```text
agent_18dafa1d3bf6038320ad0be4a7
```

Agent name:

```text
Mama Tee's Kitchen AI Voice Concierge
```

Agent channel:

```text
voice
```

## Retell phone number routing

Assigned Retell phone number:

```text
+1 (431) 500-6652
```

Phone number ID / E.164 value:

```text
+14315006652
```

Provider:

```text
Retell Twilio
```

Inbound routing:

```text
Inbound agent: agent_18dafa1d3bf6038320ad0be4a7
Inbound allowed countries: CA, US, NG
```

Outbound routing:

```text
Outbound agent: agent_18dafa1d3bf6038320ad0be4a7
Outbound agent version: 0
Outbound allowed countries: CA, US
```

SMS is not enabled for this number.


Agent publication state after issue #4 progress validation:

```text
Published version: 0
Current draft version: 1
```

Retell creates a new draft after publishing. The phone number is attached to the published agent path for live calls.

## ElevenLabs voice imported into Retell

Imported Retell voice ID:

```text
custom_voice_2078deacf9cdf5096ba2124a06
```

Retell voice name:

```text
Mama Tee Warm Professional - ElevenLabs Sarah
```

Provider:

```text
elevenlabs
```

Source voice selected:

```text
Sarah - Mature, Reassuring, Confident
```

Rationale: warm, professional, reassuring female voice suitable for a restaurant concierge demo.

## Prompt configuration

The Retell LLM was configured from:

```text
prompts/voice-agent-system-prompt.md
```

Critical behavior included:

- Identifies itself as an automated assistant.
- Answers from the Mama Tee's Kitchen knowledge base.
- Asks one question at a time.
- Enforces delivery and reservation policies.
- Confirms details before logging.
- Escalates unknown requests into callback logs.
- Does not invent menu items, prices, discounts, policies, or availability.

## Speech normalization and pronunciation

The active Retell LLM has been updated with a speech-normalization layer for Nigerian food terms, naira amounts, times, and numeric strings.

Currency guidance:

```text
N500 / ₦500 -> five hundred naira
N800 / ₦800 -> eight hundred naira
N1,200 / ₦1,200 -> one thousand two hundred naira
N3,000 / ₦3,000 -> three thousand naira
N3,500 / ₦3,500 -> three thousand five hundred naira
N5,000 / ₦5,000 -> five thousand naira
N7,000 / ₦7,000 -> seven thousand naira
```

Time guidance:

```text
10:00am -> 10am
7:00pm -> 7pm
12pm -> 12pm
```

Numeric-string guidance:

```text
Phone numbers and bank account numbers must be read digit by digit.
0123456789 -> zero, one, two, three, four, five, six, seven, eight, nine.
```

Food and location pronunciation guidance:

```text
Agidi: A-gi-di. Tone guide: do do mi.
Kunu: Ku-nu. Tone guide: do mi.
Akara: A-ka-ra. Tone guide: do do do.
Egusi: E-gu-si. Tone guide: do mi mi.
Ogbono: Og-bo-no. Tone guide: do do do.
Ewedu: E-we-du. Tone guide: re mi mi.
Gbegiri: Gbe-gi-ri. Tone guide: do do do.
Shaki: Sha-ki. Tone guide: do do.
Ponmo: Pon-mo. Tone guide: do mi.
Eba: E-ba. Tone guide: do do.
Amala: A-ma-la. Tone guide: do do do.
Adetokunbo: A-de-to-kun-bo. Tone guide: re mi do re do.
Ademola: A-de-mo-la. Tone guide: re mi mi mi.
Wuse: Wu-se. Tone guide: mi mi.
Abuja: A-bu-ja. Tone guide: do mi mi.
```

The tone guides are agent/operator guidance only. The assistant must not explain tone notes to callers.

## Tool configuration

Configured tool name:

```text
log_call_request
```

Configured tool endpoint:

```text
https://mama-tees-ai-concierge.vercel.app/api/call-logs
```

Expected production header:

```text
X-Webhook-Secret: configured in Retell only
```

Expected body schema source:

```text
prompts/voice-agent-tool-schema.md
```

The tool is configured to be called only after the caller confirms an order, reservation, callback request, complaint, catering request, or general inquiry.

## Current blockers before issue #4 can close

1. Confirm the Retell `log_call_request` tool sends the current `X-Webhook-Secret` request header without exposing the value in GitHub, chat, screenshots, or Loom. The API confirms the endpoint URL, but it does not expose the configured header value.
2. Run end-to-end Retell phone tests through the assigned number.
3. Confirm new rows appear in the `Call Logs` Google Sheet from Retell calls.
4. Capture execution evidence without exposing secrets, credentials, account security pages, billing pages, or raw environment values.

## Required manual Retell dashboard steps

1. Open the Retell dashboard.
2. Open the agent `Mama Tee's Kitchen AI Voice Concierge`.
3. Confirm the LLM is `llm_5bf4bf80d471d52a9de7f0aec4a8`.
4. Confirm the voice is `custom_voice_2078deacf9cdf5096ba2124a06`.
5. Open the `log_call_request` tool.
6. Configure the rotated webhook secret as the `X-Webhook-Secret` request header, if the Retell dashboard exposes custom headers for tools.
7. If the dashboard does not expose custom tool headers, do not place the secret in the prompt or in a body field. Use a secure backend-compatible authentication design change instead.
8. Confirm the assigned Retell phone number is `+1 (431) 500-6652`.
9. Confirm the phone number is attached to `agent_18dafa1d3bf6038320ad0be4a7`.
10. Confirm published version `0` remains the live phone-call target.

## Required test calls before closure

Run these tests after the phone number and tool authentication are configured:

1. Opening-hours FAQ.
2. Price/menu FAQ.
3. Delivery order to Wuse 2.
4. Sunday delivery rejection.
5. Invalid reservation for 4 guests.
6. Valid reservation for 5 or more guests.
7. Unknown catering request converted into callback logging.
8. Pronunciation test for naira amounts, 10am, Agidi, Egusi, Ewedu, Gbegiri, Shaki, Ponmo, Eba, Amala, Adetokunbo Ademola Crescent, Wuse, and Abuja.

Expected validation:

- Caller hears automated-assistant disclosure.
- Business rules are preserved.
- Pronunciation and numeric speech are acceptable for the demo.
- Tool calls succeed with authenticated backend writes.
- New rows appear in the `Call Logs` Google Sheet.
- No secrets appear in Retell transcripts, GitHub, screenshots, or Loom evidence.

## Security notes

- Do not store the webhook secret in the Retell prompt.
- Do not store the webhook secret in repository files.
- Do not include the webhook secret in screenshots or Loom recordings.
- If the secret is exposed, rotate it in Vercel and Retell immediately.
