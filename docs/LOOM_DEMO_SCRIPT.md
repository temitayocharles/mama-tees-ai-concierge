# Loom Demo Script

## Goal

Show that the project works end to end:

```text
Live voice call
→ Assistant answers correctly
→ Assistant collects order or reservation details
→ Assistant confirms details
→ Backend or n8n logs the request
→ Google Sheet shows the new row
```

## Recording length

Recommended length: 4 to 7 minutes.

## Scene 1: Project overview

Show:

- GitHub repository README.
- `docs/CAPSTONE_BRIEF_REQUIREMENTS.md`.
- Architecture summary.

Say:

```text
This project is an AI-powered voice concierge for Mama Tee's Kitchen, a Nigerian restaurant in Abuja. The assistant handles phone calls, answers from the approved knowledge base, collects orders, reservations, and callback requests, and logs them to a visible Google Sheet.
```

## Scene 2: Backend and logging setup

Show:

- Deployed backend `/healthz` endpoint.
- Google Sheet `Mama Tee's Kitchen Call Logs`.
- Environment variables screen only if secrets are hidden.

Say:

```text
The backend exposes a secured logging endpoint. The voice agent calls it only after the customer confirms the details. The backend validates the payload and appends it to the Google Sheet.
```

## Scene 3: Voice agent configuration

Show:

- Retell AI agent configuration.
- ElevenLabs voice selection if available.
- Prompt loaded from `prompts/voice-agent-system-prompt.md`.
- Tool/webhook schema from `prompts/voice-agent-tool-schema.md`.

Do not show secrets.

## Scene 4: Test call, FAQ

Ask:

```text
What time do you close on Saturday?
```

Expected answer:

```text
Mama Tee's Kitchen closes at 10:00pm on Saturday.
```

## Scene 5: Test call, order

Ask:

```text
How much is large Jollof Rice with chicken and Malt?
```

Expected answer:

```text
Large Jollof Rice is ₦2,500, chicken is ₦1,000, and Malt is ₦500. The total is ₦4,000.
```

Then place the order for delivery to Wuse 2.

Expected behavior:

- Collect name.
- Collect phone number.
- Confirm order items.
- Confirm delivery address and area.
- Apply ₦500 delivery fee.
- Mention payment before dispatch.
- Log the request.
- New row appears in Google Sheets.

## Scene 6: Test call, reservation rule

Ask:

```text
Can I reserve a table for 4 people tomorrow evening?
```

Expected answer:

```text
Reservations are for groups of 5 or more. For fewer than 5 guests, walk-ins are welcome.
```

## Scene 7: Test call, fallback callback

Ask an out-of-scope question, such as a custom corporate catering package not in the knowledge base.

Expected behavior:

- Assistant does not invent a package or price.
- Assistant offers callback.
- Assistant collects name and phone number.
- Assistant confirms the callback request.
- New callback row appears in Google Sheets.

## Scene 8: Submission evidence

Show:

- Google Sheet rows.
- GitHub repository.
- Issues tab showing active work tracking.
- Screenshots folder or prepared screenshots.

Say:

```text
This completes the required voice assistant, knowledge base, data capture, automation, and visible logging flow for the capstone submission.
```

## Screenshot checklist

Capture screenshots of:

- Retell AI agent configuration.
- ElevenLabs voice configuration.
- Prompt/tool configuration.
- Backend deployment dashboard.
- `/healthz` response.
- Google Sheet with test rows.
- GitHub repository README.
- GitHub issues page.
- n8n workflow if activated.

## Recording rules

- Do not show API keys, private keys, or webhook secrets.
- Blur or hide credentials.
- Use test phone numbers and demo customer names.
- Keep the assistant responses audible.
- Make sure Google Sheet updates are visible during or immediately after the call.
