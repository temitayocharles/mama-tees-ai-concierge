# Submission Checklist

## Required by capstone brief

The final submission must include:

- Loom video link.
- Screenshots of the build.

Both must be submitted together. A submission without the Loom link is incomplete.

## Before recording Loom

Confirm:

- GitHub repository is populated.
- `docs/CAPSTONE_BRIEF_REQUIREMENTS.md` is present.
- Backend is deployed to Vercel.
- `/healthz` returns ok.
- `/readiness` returns ready.
- Google Sheet is accessible.
- Google Sheets write path is verified.
- Retell AI agent is configured.
- ElevenLabs voice is selected or fallback voice is documented.
- Retell phone number is assigned.
- Retell tool/webhook points to the production backend endpoint.
- Retell tool includes the current `X-Webhook-Secret` header without exposing the value.
- Test order logs to Google Sheets.
- Test reservation logs to Google Sheets.
- Test callback or complaint logs to Google Sheets.
- Pronunciation and numeric speech have been checked.
- `docs/QA_ACCEPTANCE_MATRIX.md` has been executed and evidence recorded.

## Required screenshots

Capture these screenshots:

1. GitHub repository README.
2. `docs/CAPSTONE_BRIEF_REQUIREMENTS.md`.
3. GitHub Issues page showing project tracking.
4. Vercel deployment dashboard showing production deployment.
5. `/healthz` response.
6. `/readiness` response.
7. Retell AI agent configuration.
8. Retell LLM/prompt configuration.
9. Retell tool endpoint configuration with secret value hidden.
10. ElevenLabs voice configuration or Retell imported voice setting.
11. Google Sheet before live test rows.
12. Google Sheet after logged order, reservation, and callback rows.
13. PR/issues evidence showing core demo issues closed or explicitly documented.
14. n8n workflow only if activated.

## Required Loom scenes

The Loom video should show:

1. Project overview and architecture.
2. GitHub repository and issue tracking.
3. Production backend deployment.
4. `/healthz` and `/readiness` checks.
5. Retell agent setup.
6. ElevenLabs or imported Retell voice setup.
7. Webhook/tool setup with secret hidden.
8. Google Sheet before test.
9. Live call with audible automated-assistant disclosure.
10. Successful order capture.
11. Invalid reservation or Sunday delivery rule handling.
12. Callback fallback behavior.
13. Pronunciation or numeric-speech example.
14. Google Sheet after test rows are added.
15. Short closing summary tying evidence back to the capstone brief.

## Security checklist

Before recording:

- Hide or blur API keys.
- Hide or blur webhook secret.
- Hide or blur Google account security pages.
- Hide or blur Retell credentials and billing details.
- Hide or blur Vercel secret values.
- Hide or blur any Google private key if one exists locally.
- Use demo customer names and phone numbers.
- Do not show real account recovery pages or billing pages.
- Do not expose customer data in Google Sheets.
- Rotate secrets immediately if exposed accidentally.

## Evidence naming convention

Use these names for screenshot files:

```text
01-github-readme.png
02-capstone-brief-requirements.png
03-github-issues.png
04-vercel-production-deployment.png
05-healthz-response.png
06-readiness-response.png
07-retell-agent-config.png
08-retell-llm-prompt.png
09-retell-tool-config-secret-hidden.png
10-elevenlabs-retell-voice.png
11-google-sheet-before-tests.png
12-google-sheet-after-tests.png
13-qa-matrix-evidence.png
14-n8n-workflow-if-used.png
```

## Submission form

The uploaded brief references this submission URL:

```text
https://forms.gle/7sUpTisDqW1f3j7h9
```

Before submitting, verify that the link is still accepted by the course provider.

## Final pass criteria

The project is ready to submit when:

- The Loom video proves the assistant works live.
- The assistant is heard responding correctly.
- The Google Sheet visibly receives logged records.
- Screenshots show the build, not only the final Sheet.
- The repo documents what was built and why.
- GitHub issues show remaining enhancements separately from core submission blockers.
- No optional layer such as n8n, Composio, Replit, or Vapi is presented as required for the core demo.
