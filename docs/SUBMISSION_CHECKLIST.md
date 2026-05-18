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
- Backend is deployed or n8n fallback is active.
- `/healthz` returns ok.
- Google Sheet is accessible.
- Retell AI agent is configured.
- ElevenLabs custom voice is selected or fallback voice is documented.
- Tool/webhook points to the correct deployed endpoint.
- Webhook secret is configured.
- Test order logs to Google Sheets.
- Test reservation logs to Google Sheets.
- Test callback logs to Google Sheets.

## Required screenshots

Capture these screenshots:

1. GitHub repository README.
2. `docs/CAPSTONE_BRIEF_REQUIREMENTS.md`.
3. GitHub Issues page showing project tracking.
4. Backend deployment dashboard.
5. `/healthz` response.
6. Retell AI agent configuration.
7. ElevenLabs voice configuration or selected voice setting.
8. Prompt/tool configuration.
9. Google Sheet with logged order, reservation, and callback rows.
10. n8n workflow if used.

## Required Loom scenes

The Loom video should show:

1. Project overview and architecture.
2. Voice-agent setup.
3. Backend or workflow setup.
4. Google Sheet before test.
5. Live call with audible assistant response.
6. Successful order capture.
7. Invalid reservation or Sunday delivery rule handling.
8. Callback fallback behavior.
9. Google Sheet after test rows are added.

## Security checklist

Before recording:

- Hide or blur API keys.
- Hide or blur Google private key.
- Hide or blur webhook secret.
- Use demo customer names and phone numbers.
- Do not show real account recovery pages or billing pages.
- Rotate secrets if exposed accidentally.

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
