# Replit Interface Caveats

A custom Replit interface is valid for a demo dashboard, admin screen, or prototype UI. It should not be treated as the primary production voice-call layer for this capstone unless the deployment, security, and reliability risks are explicitly handled.

## Where Replit fits well

Use Replit for:

- A simple admin dashboard that reads call logs.
- A demo control panel.
- A public landing page that explains the project.
- A quick prototype for viewing orders, reservations, and callbacks.

## Where Replit is weaker

Avoid making Replit the critical production dependency for:

- Real-time voice telephony.
- Reliable webhook hosting without uptime planning.
- Secret-heavy production services.
- Long-term data storage.
- Compliance-sensitive customer data handling.

## Main caveats

### 1. Uptime and cold starts

A demo interface can tolerate downtime. A restaurant call assistant cannot. If the voice platform calls a webhook and the server is sleeping or slow, the customer experience fails.

### 2. Secret handling

The project uses secrets such as `WEBHOOK_SECRET`, Google service account credentials, and possibly ElevenLabs credentials. These should be stored in a secrets manager or deployment environment variables, not hard-coded into a public Replit project.

### 3. Persistence

Local filesystem storage is not a reliable source of truth. Use Google Sheets, Airtable, Postgres, or another external data store for records.

### 4. Observability

For a capstone, basic logs may be enough. For a real business, you need structured logs, error tracking, webhook failure visibility, and replay capability.

### 5. Security controls

A public interface needs authentication, role separation, input validation, rate limiting, and least-privilege access to customer data.

### 6. Vendor perception

A Replit UI can look good in a demo, but the core reliability story is stronger if the backend is deployed to Render, Railway, Fly.io, or another service designed for always-on APIs.

## Recommended use in this project

Use Replit only as an optional interface:

```text
Retell AI + ElevenLabs voice
→ Node.js backend
→ Google Sheets
→ Optional Replit dashboard
```

Do not replace the backend or voice platform with Replit alone.
