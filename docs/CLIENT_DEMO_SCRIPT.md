# Client Demo Script

## Purpose

Use this runbook to record a smooth client-facing walkthrough of Mama Tee's Kitchen AI Voice Concierge.

The script is written as a screen-recording guide. It tells the presenter what to open, what to click, what to show, and what to say.

## Safety rules before recording

Do not show:

- environment variable values,
- webhook values,
- API keys,
- private keys,
- Retell credentials,
- ElevenLabs credentials,
- Vercel environment values,
- Google credential material,
- billing pages,
- account security pages,
- unrelated customer data.

Use only safe validation data.

## Browser and screen setup

Open these tabs before recording, in this order:

```text
Tab 1: GitHub repository README
https://github.com/temitayocharles/mama-tees-ai-concierge

Tab 2: Backend readiness
https://mama-tees-ai-concierge.vercel.app/readiness

Tab 3: Retell phone number routing
https://dashboard.retellai.com/phoneNumbers?phone=%2B14315006652

Tab 4: Google Sheet Call Logs
https://docs.google.com/spreadsheets/d/1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8/edit

Tab 5: n8n Automation Bridge workflow
https://n8n-uev8.onrender.com/workflow/FpRh13SdgO1NmEEe

Tab 6: Terminal
A terminal window ready to run the safe n8n validation curl command.
```

Recommended recording setup:

```text
Browser zoom: 100% or 110%
Screen: full screen browser
Terminal: large enough for curl response visibility
Do not keep Render, Vercel env settings, Retell API settings, or n8n environment pages open.
```

## Opening narration

### Action

Start on the GitHub README tab.

### Say

```text
This is Mama Tee's Kitchen AI Voice Concierge, delivered by InfraForge. The goal is to reduce missed customer calls, answer common restaurant questions, collect structured requests, and give staff a visible call log without introducing a database or heavy operational overhead.
```

### Show

Scroll slowly through the README sections for:

```text
Primary architecture
Business rules
Live production backend
Current voice-agent configuration
n8n automation bridge status
```

### Say

```text
The primary path is Retell AI for the phone conversation, ElevenLabs for the voice, a secure Vercel backend for validation, and Google Sheets as the visible operations log. n8n is used as an automation bridge for structured workflow intake, while the backend remains the authority for validation and logging.
```

## Segment 1: Backend readiness

### Action

Click Tab 2: Backend readiness.

### Show

The browser should show:

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

### Say

```text
This readiness endpoint confirms that the production backend is live, webhook authentication is configured, Google Sheets logging is enabled, and production Google authentication uses Workload Identity Federation rather than private keys.
```

### Do not show

Do not open Vercel environment variables.

## Segment 2: Retell phone number routing

### Action

Click Tab 3: Retell phone number routing.

### Show

Show the phone number page only. Keep the view on the phone number assignment and agent routing.

Expected visible items:

```text
Phone number: +1 (431) 500-6652
Inbound call agent: Mama Tee's Kitchen AI Voice Concierge
Provider: Twilio / Retell
```

### Say

```text
The Retell phone number is assigned to Mama Tee's Kitchen AI Voice Concierge. This is the customer-facing phone entry point for the voice assistant.
```

### Optional click

If visible without exposing credentials, click or point to:

```text
Inbound Call Agent
Allowed Inbound Countries
```

### Say

```text
The phone number routes inbound calls to the configured Mama Tee voice agent. Access is restricted to the countries needed for this delivery to reduce unnecessary exposure.
```

### Do not show

Do not open Retell API keys, billing, security, or webhook secret fields.

## Segment 3: Live voice call walkthrough

Use this segment only when the Retell live-call path is ready for final recording.

### Action

Use a phone to call:

```text
+1 (431) 500-6652
```

Keep the screen on the Retell phone number page or switch to the Google Sheet tab while the call is happening.

### Say before placing the call

```text
Now I will place a live test call and demonstrate how the assistant handles restaurant questions, enforces policy, and logs a confirmed request for staff review.
```

### Caller script

Use this sequence during the call.

#### Step 1: Opening-hours question

Say to the assistant:

```text
Hi, what time do you open for delivery?
```

Expected assistant behavior:

```text
The assistant should disclose it is automated if it has not already done so, then answer that delivery is Monday to Saturday from 10am to 7pm.
```

#### Step 2: Delivery-policy rejection

Say:

```text
Can I get delivery on Sunday?
```

Expected assistant behavior:

```text
The assistant should clearly explain that Mama Tee's Kitchen does not offer Sunday delivery.
```

#### Step 3: Reservation-policy rejection

Say:

```text
Can I reserve a table for four people tomorrow?
```

Expected assistant behavior:

```text
The assistant should explain that reservations are only for groups of five or more and require at least 24 hours notice.
```

#### Step 4: Valid callback request

Say:

```text
Please have someone call me back. My name is Demo Customer. My phone number is 08000000000. The reason is that I want to confirm a catering request for this weekend.
```

Expected assistant behavior:

```text
The assistant should repeat the callback details and ask for confirmation before logging.
```

When the assistant asks for confirmation, say:

```text
Yes, that is correct.
```

Expected result:

```text
The assistant should confirm that the callback request has been logged for staff follow-up.
```

### Do not claim

Do not claim the Retell path is fully validated unless a new Google Sheet row appears from the live call.

## Segment 4: Google Sheets call-log evidence

### Action

Click Tab 4: Google Sheet Call Logs.

### Show

Open the `Call Logs` tab.

If you just completed a live Retell call, search or scroll to the newest row from that call.

For the n8n Automation Bridge evidence, search for:

```text
issue-5-n8n-automation-bridge-validation
```

### Say

```text
This sheet is the visible operations log for staff. The system does not use an application database. Accepted requests are validated by the backend and then appended here for review.
```

### Point out these columns

```text
request_type
customer_name
phone_number
callback_reason or notes
confirmation_summary
status
source
call_id
timestamp
```

### Say

```text
This row shows the structured request that reached the backend, passed validation, and was written to the business-visible call log.
```

### Do not show

Do not show unrelated real customer rows if they exist. Filter, crop, or zoom into the safe validation row only.

## Segment 5: n8n Automation Bridge

### Action

Click Tab 5: n8n Automation Bridge workflow.

### Show

The n8n canvas should show:

```text
Automation Bridge Webhook
-> Normalize Payload
-> Forward to Vercel Backend
-> Build Sanitized Response
-> Respond to Webhook
```

### Say

```text
This is the n8n Automation Bridge. It gives us a workflow automation intake path for structured payloads. It does not write directly to Google Sheets. It forwards to the Vercel backend so authentication, validation, business rules, sanitized errors, and schema control stay centralized.
```

### Click

Click once on the `Forward to Vercel Backend` node only if the header value is safely shown as an expression and no secret value appears.

Expected safe value:

```text
{{ $env.MAMA_TEES_WEBHOOK_SECRET }}
```

### Say

```text
The workflow reads the webhook value securely from the Render runtime environment. The secret value is not stored in the workflow export or documentation.
```

### Do not show

Do not open Render environment variables. Do not open n8n settings pages that expose runtime values.

## Segment 6: n8n production validation command

### Action

Click Tab 6: Terminal.

Paste and run:

```bash
curl -i -X POST "https://n8n-uev8.onrender.com/webhook/mama-tees-automation-bridge-call-log" \
  -H "Content-Type: application/json" \
  -d '{
    "request_type": "callback",
    "customer_name": "n8n Automation Bridge Validation",
    "phone_number": "08000000000",
    "callback_reason": "Validate n8n automation bridge webhook to production backend",
    "notes": "Safe validation row for issue #5 after automation bridge rename",
    "source": "n8n_automation_bridge",
    "call_id": "issue-5-n8n-automation-bridge-validation"
  }'
```

### Expected terminal result

```text
HTTP/2 201
```

Expected response body:

```json
{"status":"success","message":"Call log accepted by backend.","backend_status":201}
```

### Say

```text
The n8n Automation Bridge accepted the payload, forwarded it to the production backend, and the backend returned HTTP 201. That confirms the automation path is integrated with the same secure backend and Google Sheets logging path.
```

## Segment 7: Verify n8n row in Google Sheets

### Action

Click Tab 4: Google Sheet Call Logs again.

Use browser find or sheet search for:

```text
issue-5-n8n-automation-bridge-validation
```

### Show

The row should contain:

```text
request_type=callback
customer_name=n8n Automation Bridge Validation
source=n8n_automation_bridge
call_id=issue-5-n8n-automation-bridge-validation
```

### Say

```text
This confirms the automation bridge path completed end to end: n8n received the structured payload, the backend accepted it, and Google Sheets received the visible operations record.
```

## Segment 8: Close with architecture summary

### Action

Return to Tab 1: GitHub README or stay on the Google Sheet row.

### Say

```text
The final architecture is intentionally lean. Retell handles the phone conversation. ElevenLabs provides the custom voice. n8n provides the workflow automation bridge for structured intake. The Vercel backend provides authentication, validation, and business-rule enforcement. Google Sheets gives Mama Tee's Kitchen a simple visible operations log without the cost and maintenance of a custom database dashboard.
```

### Say

```text
This gives the client a practical production-minded solution that is simple to operate, secure by design, and ready for future enhancements if the business needs them.
```

## Final recording checklist

Before publishing the video, confirm:

- no secret values are visible,
- no environment variable pages are visible,
- no billing or security pages are visible,
- no unrelated customer data is visible,
- the n8n segment says `Automation Bridge`, not `fallback`,
- the Google Sheet row shown is safe validation data,
- Retell live-call claims match actual evidence,
- backend readiness is visible,
- n8n returns HTTP 201,
- the Google Sheet row exists.
