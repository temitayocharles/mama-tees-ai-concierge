# Evidence Capture Guide

## Purpose

Use this folder only for sanitized delivery evidence.

Do not store credentials, billing screens, account security pages, raw environment values, webhook values, API keys, private keys, or screenshots that reveal sensitive account details.

## Recommended evidence

Capture sanitized screenshots for:

- backend readiness response,
- Retell phone number routing,
- successful inbound call result,
- Google Sheet row created from a live Retell call,
- optional n8n execution only after the fallback workflow is fully configured and validated,
- CI checks passing.

## Redaction rules

Before committing evidence:

- crop or blur account navigation that exposes sensitive information,
- hide environment values,
- hide credentials,
- hide API keys,
- hide webhook values,
- hide private Google configuration values,
- hide billing details,
- hide unrelated customer data.

## Naming convention

Use clear filenames:

```text
backend-readiness.png
retell-phone-routing.png
retell-live-call-google-sheet-row.png
n8n-fallback-execution.png
ci-green.png
```

Only commit evidence that is safe for public repository review.
