# Project Handoff: Mama Tee's Kitchen AI Voice Concierge

## Current implementation decision

Primary implementation path:

```text
Retell AI phone agent
→ ElevenLabs custom voice
→ Node.js backend webhook
→ Google Sheets call log
```

Fallback or extension path:

```text
Retell AI or ElevenLabs Conversational AI
→ n8n webhook
→ Google Sheets call log
```

Vapi is not required by the project brief. It remains a valid alternative, but the selected direction is Retell plus ElevenLabs to differentiate the submission while keeping the voice-agent requirements intact.

## Live Google Sheet

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
URL: https://docs.google.com/spreadsheets/d/1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8/edit
```

The Sheet has already been created and seeded with the expected 22-column schema.

## Repository status

The GitHub repository has been created and populated through the direct GitHub connector:

```text
https://github.com/temitayocharles/mama-tees-ai-concierge
```

Core files committed:

- `README.md`
- `package.json`
- `.env.example`
- `src/`
- `tests/`
- `examples/`
- `prompts/`
- `docs/`
- `n8n/mama-tees-call-logger.workflow.json`
- `Dockerfile`
- `docker-compose.yml`
- `render.yaml`
- `.github/workflows/ci.yml`

## What is already built

- Express backend with health and readiness endpoints.
- `POST /api/call-logs` webhook endpoint.
- Webhook secret validation through `X-Webhook-Secret`.
- Zod payload validation.
- Delivery-rule validation.
- Reservation-rule validation.
- Google Sheets logging sink.
- Local JSONL fallback sink.
- Knowledge base module.
- Retell plus ElevenLabs voice-agent prompt.
- Voice-agent tool schema.
- n8n importable workflow.
- Test payload examples.
- CI workflow.
- Deployment configuration.

## Remaining account-bound work

1. Configure Retell AI phone agent.
2. Connect ElevenLabs custom voice to the selected voice platform.
3. Deploy backend to Render or another Node.js host.
4. Configure backend secrets.
5. Test backend-to-Google-Sheets logging.
6. Activate/import n8n workflow if using the automation fallback.
7. Record Loom demo.
8. Capture screenshots for submission.

## Important implementation notes

- Do not commit `.env` or Google service account credentials.
- Keep `WEBHOOK_SECRET` secret and rotate it after the demo if shown on screen.
- Use an automated-assistant disclosure in the call greeting.
- Do not let the assistant invent prices or policies.
- Confirm every order, reservation, and callback before logging.

## Recommended next action

Complete GitHub issues in order. Start with deployment and voice-platform configuration before n8n or Composio enhancements.
