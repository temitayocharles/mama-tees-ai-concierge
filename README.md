# Mama Tee's Kitchen AI Voice Concierge

Production-ready capstone implementation package for **AI-Powered Business Concierge for Mama Tee's Kitchen**.

This repository provides a deployable webhook backend, restaurant knowledge base, voice-agent prompts, Google Sheets logging integration, validation rules, demo test cases, and submission assets.

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
  -> Voice agent platform, such as Vapi, Retell, Bland, or Twilio voice workflow
  -> Voice agent uses prompts/voice-agent-system-prompt.md
  -> Voice agent calls POST /api/call-logs when a request must be logged
  -> Backend validates payload and business rules
  -> Backend appends row to Google Sheet
  -> Owner reviews visible call log
```

## Repository layout

```text
.
├── .github/workflows/ci.yml
├── data/
│   ├── google-sheet-template.csv
│   └── knowledge-base.json
├── docs/
│   ├── DEPLOYMENT.md
│   ├── EXECUTION_STATUS.md
│   ├── GITHUB_REPOSITORY_SETUP.md
│   ├── GOOGLE_SHEETS_SETUP.md
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── LOOM_DEMO_SCRIPT.md
│   ├── N8N_WORKFLOW_SETUP.md
│   ├── SUBMISSION_CHECKLIST.md
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
│   ├── create-github-repo.sh
│   ├── push-to-existing-github-repo.sh
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


## Live setup completed in this handoff

A Google Sheet has already been created and seeded for the capstone demo.

```text
Title: Mama Tee's Kitchen Call Logs
Spreadsheet ID: 1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
Tab: Call Logs
URL: https://docs.google.com/spreadsheets/d/1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8/edit
```

The repository also includes an importable n8n workflow at `n8n/mama-tees-call-logger.workflow.json`. Use `docs/N8N_WORKFLOW_SETUP.md` for import and credential mapping.

To create and push the GitHub repository from this package, use `docs/GITHUB_REPOSITORY_SETUP.md`.

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

For final submission with Google Sheets logging, configure Google Sheets credentials using `docs/GOOGLE_SHEETS_SETUP.md`.

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
./scripts/test-api.sh
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

## Validation status

The updated package was validated after execution updates.

```text
npm ci: completed
TypeScript build: passed
Test files: 2 passed
Tests: 8 passed
Production dependency audit: 0 vulnerabilities
Google Sheet A1:V4 verification: passed
```

## Deployment options

Recommended capstone deployment path:

1. Deploy backend to Render, Railway, Fly.io, or any Node.js host.
2. Configure environment variables.
3. Create and share Google Sheet with service account.
4. Configure voice agent webhook tool to call `POST /api/call-logs`.
5. Record Loom demo with live call and visible log update.

See `docs/DEPLOYMENT.md` for exact steps.

## Security notes

- Do not commit `.env` or service account credentials.
- Use `WEBHOOK_SECRET` and require the voice platform to send it in the `X-Webhook-Secret` header.
- Share the Google Sheet only with the service account email and required human reviewers.
- Restrict service account permissions to the target spreadsheet.
- Rotate secrets after demo if they were displayed during screen recording.

## Required submission assets

The capstone requires:

- Loom video link showing live call test and backend log.
- Screenshots of the build.
- Both must be submitted together.

Use `docs/LOOM_DEMO_SCRIPT.md` and `docs/SUBMISSION_CHECKLIST.md`.
