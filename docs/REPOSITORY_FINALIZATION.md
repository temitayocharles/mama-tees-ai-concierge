# Repository Finalization

## Purpose

This document records repository settings and finalization checks for the Mama Tee's Kitchen AI Voice Concierge codebase.

## Repository posture

The repository is intended to be public and professionally reviewable. Public documentation should present the project as a client delivery by InfraForge and should avoid internal training, brainstorming, or experimental-tooling language.

## Repository metadata

Recommended repository description:

```text
AI-powered phone concierge for Mama Tee's Kitchen using Retell AI, ElevenLabs, Vercel, and Google Sheets.
```

Recommended topics:

```text
ai-voice-agent
elevenlabs
google-sheets
nodejs
retell-ai
typescript
vercel
workflow-automation
```

## Merge settings

Recommended merge settings:

```text
Squash merge: enabled
Merge commits: disabled
Rebase merge: enabled
Delete branch on merge: enabled
```

## Required files

The repository should include:

```text
package.json
package-lock.json
.github/workflows/ci.yml
.env.example
README.md
PROJECT_HANDOFF.md
docs/CLIENT_REQUIREMENTS.md
docs/ARCHITECTURE.md
docs/DEPLOYMENT.md
docs/GOOGLE_SHEETS_SETUP.md
docs/VOICE_AGENT_PLATFORM_SETUP.md
docs/N8N_WORKFLOW_SETUP.md
docs/QA_ACCEPTANCE_MATRIX.md
docs/TEST_PLAN.md
docs/DELIVERY_CHECKLIST.md
```

## CI baseline

CI should run:

```bash
npm ci
npm run build
npm test
```

## Security checks

Before final handoff:

- confirm no `.env` file is committed,
- confirm no credentials are present in docs,
- confirm no Google private key exists in the repository,
- confirm secret scanning is enabled,
- confirm push protection is enabled where available,
- confirm screenshots and recordings do not expose credentials,
- rotate any exposed credential immediately.

## Documentation standards

Public-facing documentation should:

- describe the client problem and delivered solution,
- document the architecture honestly,
- keep n8n optional unless fully validated,
- keep the backend as the validation authority,
- avoid internal training narratives,
- avoid brainstorming history,
- avoid unnecessary references to tools not used in the delivered path.

## Final review

Before presenting the repository:

1. Confirm open PRs are either merged or intentionally left open.
2. Confirm `main` is green.
3. Confirm backend readiness is healthy.
4. Confirm Google Sheets logging works.
5. Confirm Retell live call validation evidence exists.
6. Confirm optional n8n evidence exists only if n8n is being shown.
7. Confirm all public docs align with the client-delivery narrative.
