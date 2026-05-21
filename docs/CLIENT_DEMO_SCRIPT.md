# Client Demo Script

## Objective

Show Mama Tee's Kitchen how the AI Voice Concierge handles phone calls, applies restaurant rules, and records confirmed requests in the visible Google Sheets call log.

## Safety rules

- Do not show credentials.
- Do not show environment variable values.
- Do not show billing or account security pages.
- Do not expose webhook values, API keys, private keys, Retell credentials, ElevenLabs credentials, Vercel environment values, or Google credentials.
- Use safe test customer data.

## Suggested flow

### 1. Backend readiness

Show:

```text
https://mama-tees-ai-concierge.vercel.app/readiness
```

Expected result:

```json
{
  "status": "ready",
  "webhook_auth_configured": true,
  "log_destination": "google_sheets",
  "google_sheets_configured": true,
  "google_sheets_auth_mode": "workload_identity",
  "business_timezone": "Africa/Lagos"
}
```

### 2. Voice call

Call:

```text
+1 (431) 500-6652
```

Confirm the assistant:

- identifies itself as automated,
- answers opening-hours questions,
- answers menu and price questions without inventing unsupported items,
- enforces no Sunday delivery,
- rejects reservations under 5 guests,
- collects a valid callback or reservation only after confirmation.

### 3. Google Sheets evidence

Open the `Call Logs` sheet and show the new row created from the validated interaction.

Confirm visible fields such as:

- request type,
- customer name,
- phone number,
- confirmation summary,
- source,
- call ID,
- timestamp.

### 4. Optional n8n fallback

Only show n8n after the fallback workflow is fully configured and validated.

Expected fallback flow:

```text
n8n webhook
  -> Vercel backend /api/call-logs
  -> Google Sheets visible call log
```

Do not present n8n as the primary path.

## Closing message

The solution gives Mama Tee's Kitchen a practical voice concierge with centralized validation, secure backend authentication, and a visible operations log that staff can review without a custom database dashboard.
