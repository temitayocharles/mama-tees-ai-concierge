# Voice Agent Platform Setup

## Recommended stack

Use this direction for the capstone submission:

```text
Retell AI phone agent
-> ElevenLabs custom voice
-> Node.js backend webhook
-> Google Sheets call log
```

Use n8n as an optional fallback or extension:

```text
Retell AI phone agent
-> n8n webhook
-> Google Sheets call log
```

## Why Retell plus ElevenLabs

This project does not require Vapi. The brief requires a working voice assistant, accurate knowledge handling, data capture, and visible logging. Retell provides the phone-agent layer. ElevenLabs provides the differentiated custom voice asset. The backend in this repository provides the controlled webhook and validation layer.

## Current Retell configuration

Issue #4 configuration evidence is tracked in:

```text
docs/RETELL_AGENT_CONFIGURATION.md
```

Current configured Retell objects:

```text
Retell LLM: llm_5bf4bf80d471d52a9de7f0aec4a8
Retell Agent: agent_18dafa1d3bf6038320ad0be4a7
Retell Voice: custom_voice_2078deacf9cdf5096ba2124a06
```

Current production backend:

```text
https://mama-tees-ai-concierge.vercel.app
```

## Retell setup checklist

1. Create a Retell account.
2. Create a new phone agent.
3. Configure the LLM/system prompt using `prompts/voice-agent-system-prompt.md`.
4. Configure the agent voice using your ElevenLabs custom voice, if Retell account settings support ElevenLabs voice provider integration.
5. Add a webhook/tool that calls the deployed backend:

```text
POST https://YOUR_DEPLOYED_BACKEND_URL/api/call-logs
```

6. Add this header in Retell only:

```text
X-Webhook-Secret: YOUR_WEBHOOK_SECRET
```

7. Use the schema from `prompts/voice-agent-tool-schema.md`.
8. Assign a test phone number.
9. Place test calls for order, reservation, delivery rejection, and fallback callback.
10. Confirm new rows appear in Google Sheets.

## ElevenLabs setup checklist

1. Open ElevenLabs.
2. Confirm your cloned/custom voice is available.
3. Copy the voice ID if required by Retell.
4. Use the voice only if you have the right to use it for this project.
5. Keep disclosure in the greeting: callers should know they are speaking with an automated assistant.

## Required voice behavior

The assistant must:

- Identify itself as an automated assistant.
- Answer only from the knowledge base.
- Ask one question at a time.
- Confirm details before logging.
- Enforce delivery and reservation policies.
- Escalate unknown requests into callback logs.

## Demo tests

Use these test calls before recording Loom:

1. Ask opening hours.
2. Ask the price of large Jollof Rice, chicken, and Malt.
3. Place a delivery order to Wuse 2.
4. Ask for Sunday delivery.
5. Ask to reserve for 4 guests.
6. Ask an unknown catering question and confirm callback logging.

## Caveat

If Retell account setup or ElevenLabs voice integration becomes blocked by account limits, use the same backend with any voice platform that can make an HTTP POST tool call. The project is platform-agnostic.
