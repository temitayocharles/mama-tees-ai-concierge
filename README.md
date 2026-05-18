# Mama Tee's Kitchen AI Voice Concierge

Capstone implementation package for **AI-Powered Business Concierge for Mama Tee's Kitchen**.

This repository provides a deployable webhook backend, restaurant knowledge base, voice-agent prompts, Google Sheets logging integration, validation rules, demo test cases, n8n fallback workflow, and submission documentation.

## Source of truth

Start here before changing anything:

```text
docs/CAPSTONE_BRIEF_REQUIREMENTS.md
PROJECT_HANDOFF.md
```

`docs/CAPSTONE_BRIEF_REQUIREMENTS.md` extracts the project requirements from the uploaded capstone brief and maps them to repository files, acceptance tests, and submission evidence.

## Selected implementation direction

Primary stack:

```text
Retell AI phone agent
→ ElevenLabs custom voice
→ Node.js backend webhook
→ Google Sheets visible log
```

Optional fallback or extension:

```text
Voice platform
→ n8n webhook
→ Google Sheets visible log
```

Vapi is not required by the capstone brief. It remains a valid alternative, but this repository is now oriented around Retell plus ElevenLabs to create a differentiated submission without weakening the project.

## What this project does

The system supports a restaurant voice assistant that can:

- Answer customer questions about menu, prices, hours, delivery, reservations, payment, catering, seating, halal status, pickup, and complaints.
- Collect structured order requests.
- Collect structured reservation requests.
- Enforce delivery and reservation business rules.
- Log orders, reservations, callbacks, complaints, catering requests, and general inquiries to Google Sheets or local JSONL.
- Provide deterministic fallback behavior when a caller asks for something outside the supported scope.

## Recommended architecture

```text
Customer phone call
  -> Retell AI phone agent using ElevenLabs custom voice
  -> Agent uses prompts/voice-agent-system-prompt.md
  -> Agent calls POST /api/call-logs after confirmed order/reservation/callback
  -> Backend validates payload and business rules
  -> Backend appends row to Google Sheet
  -> Owner reviews visible call log
```

## Repository layout

```text
.
├── .github/workflows/ci.yml
├── docs/
│   ├── CAPSTONE_BRIEF_REQUIREMENTS.md
│   ├── REPLIT_INTERFACE_CAVEATS.md
│   └── VOICE_AGENT_PLATFORM_SETUP.md
├── examples/
│   ├── callback-log.json
│   ├── order-log.json
│   └── reservation-log.json
├── n8n/
│   └── mama-tees-call-logger.workflow.json
├── prompts/
│   ├── voice-agent-system-prompt.md
│   └── voice-agent-tool-schema.md
├── scripts/
│   ├── render-env-summary.sh
│   ├── seed-google-sheet.ts
│   └── test-api.sh
├── src/
│   ├── app.ts
│   ├── config.ts
│   ├── domain/businessRules.ts
│   ├── domain/knowledgeBase.ts
│   ├── logger.ts
│   ├── routes/callLogs.ts
│   ├── routes/health.ts
│   ├── server.ts
│   ├── services/googleSheets.ts
│   ├── services/logSink.ts
│   └── types.ts
└── tests/
    ├── api.test.ts
    └── businessRules.test.ts
```

## Live setup completed

A Google Sheet has already been created and seeded for the capstone demo.

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
URL: https://docs.google.com/spreadsheets/d/1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8/edit
```

The repository also includes an importable n8n workflow at:

```text
n8n/mama-tees-call-logger.workflow.json
```

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

For a fast local demo, leave:

```bash
LOG_DESTINATION=local_jsonl
```

For final submission with Google Sheets logging, configure the Google service account values in `.env` or your deployment host secret manager.

### 3. Run locally

```bash
npm run dev
```

Expected result:

```text
Mama Tee's Kitchen concierge API listening on port 8080
```

### 4. Health check

```bash
curl http://localhost:8080/healthz
```

Expected result:

```json
{"status":"ok"}
```

### 5. Test API logging

```bash
WEBHOOK_SECRET=replace-with-a-long-random-secret ./scripts/test-api.sh
```

Expected result:

```text
Order log: HTTP 201
Reservation log: HTTP 201
Callback log: HTTP 201
```

If `LOG_DESTINATION=local_jsonl`, records are appended to:

```text
storage/call-logs.jsonl
```

## Deployment options

Recommended capstone deployment path:

1. Deploy backend to Render, Railway, Fly.io, or another Node.js host.
2. Configure environment variables.
3. Share the Google Sheet with the Google service account.
4. Configure Retell AI agent tool/webhook to call `POST /api/call-logs`.
5. Configure ElevenLabs custom voice in the selected voice platform.
6. Test order, reservation, invalid reservation, Sunday delivery, and callback flows.
7. Record Loom demo with live call and visible Google Sheet update.

## Security notes

- Do not commit `.env` or service account credentials.
- Use `WEBHOOK_SECRET` and require the voice platform to send it in the `X-Webhook-Secret` header.
- Share the Google Sheet only with the service account email and required human reviewers.
- Restrict service account permissions to the target spreadsheet.
- Rotate secrets after the demo if they were displayed during screen recording.

## Required submission assets

The capstone requires:

- Loom video link showing live call test and backend log.
- Screenshots of the build.
- Both must be submitted together.

Use `docs/CAPSTONE_BRIEF_REQUIREMENTS.md` for the acceptance test matrix and `PROJECT_HANDOFF.md` for current project state.
