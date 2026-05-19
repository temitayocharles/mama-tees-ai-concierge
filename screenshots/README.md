# Screenshots

Use this folder to store final capstone screenshots before submission.

Do not commit screenshots that reveal secrets, API keys, private keys, webhook secrets, account recovery pages, customer data, or billing information.

## Required screenshots

Use this naming convention:

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

## Capture checklist

1. GitHub repository README.
2. `docs/CAPSTONE_BRIEF_REQUIREMENTS.md`.
3. GitHub Issues page showing project tracking.
4. Vercel production deployment dashboard.
5. `/healthz` response.
6. `/readiness` response.
7. Retell AI agent configuration.
8. Retell LLM/prompt configuration.
9. Retell tool endpoint configuration with the secret value hidden.
10. ElevenLabs voice configuration or Retell imported voice setting.
11. Google Sheet before live voice test rows.
12. Google Sheet after order, reservation, and callback rows.
13. QA matrix evidence from `docs/QA_ACCEPTANCE_MATRIX.md`.
14. n8n workflow only if activated.

## Redaction requirements

Before saving or committing any screenshot, verify:

- No `WEBHOOK_SECRET` value is visible.
- No API key is visible.
- No Google private key is visible.
- No Vercel secret value is visible.
- No Retell or ElevenLabs API credential is visible.
- No billing page is visible.
- No real customer information is visible.
- Demo phone numbers and demo names are used.

If any secret appears in a screenshot, delete the screenshot and rotate the exposed secret before continuing.
