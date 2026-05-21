# Delivery Checklist

Use this checklist before presenting the Mama Tee's Kitchen AI Voice Concierge as ready for client handoff.

## Backend

- [x] Production backend deployed.
- [x] `GET /healthz` available.
- [x] `GET /readiness` available.
- [x] `POST /api/call-logs` available.
- [x] Webhook authentication configured.
- [x] Google Sheets logging configured through Workload Identity Federation.
- [x] No Google private key required for production.

## Google Sheets

- [x] Spreadsheet created.
- [x] `Call Logs` tab available.
- [x] Backend can append rows.
- [x] Visible staff review path exists.

## Voice agent

- [x] Retell LLM configured.
- [x] Retell agent configured.
- [x] ElevenLabs custom voice imported into Retell.
- [x] Retell phone number assigned.
- [x] Agent version published for live phone path.
- [ ] Live inbound call validation completed.
- [ ] Google Sheets row verified from live Retell call.

## n8n fallback

- [x] Repository workflow export prepared.
- [x] Live n8n workflow created.
- [ ] Runtime variable configured securely.
- [ ] Live workflow updated or re-imported from repository export.
- [ ] Manual execution returns backend HTTP 201.
- [ ] Google Sheets row verified from n8n validation payload.

## Security

- [x] `.env` is not committed.
- [x] Repository documentation uses placeholders only.
- [x] Backend credentials are not exposed in docs.
- [x] Google private keys are not used for production.
- [ ] Final evidence reviewed for exposed credentials before publication.

## Final evidence

Capture sanitized evidence for:

- production backend readiness,
- Retell phone routing,
- live call behavior,
- Google Sheets row creation,
- business-rule validation,
- optional n8n fallback only after it is fully configured.
