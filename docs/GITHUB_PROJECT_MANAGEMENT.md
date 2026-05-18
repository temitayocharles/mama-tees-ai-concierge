# GitHub Project Management

This document defines the labels, milestones, and repository settings expected for this capstone project.

## Current issue backlog

| Issue | Purpose |
|---|---|
| #1 | Overall capstone delivery epic |
| #2 | Backend deployment |
| #3 | Google Sheets logging |
| #4 | Retell AI plus ElevenLabs voice agent |
| #5 | n8n fallback or extension |
| #6 | Composio connector enhancement |
| #7 | QA against capstone acceptance tests |
| #8 | Loom and screenshot submission package |
| #9 | Optional Replit admin or demo interface |

## Labels

Expected labels:

| Label | Meaning |
|---|---|
| blocker | Required before submission readiness. |
| deployment | Backend, hosting, environment variables, runtime setup. |
| voice-agent | Retell, ElevenLabs, prompts, tool/webhook behavior. |
| docs | Documentation, handoff, Loom, submission evidence. |
| optional | Nice-to-have or non-blocking enhancement. |
| automation | n8n or workflow automation. |
| composio | Composio connector work. |
| connector | External connector integration. |
| qa | Validation, test execution, acceptance criteria. |
| submission | Loom, screenshots, and final submission package. |
| replit | Optional Replit interface work. |
| ui | Optional interface or dashboard work. |

## Milestones

Expected milestones:

### Core Demo Ready

Use this milestone for issues that must be completed before a credible live demo:

- #2 Deploy backend API and configure production environment.
- #3 Configure Google Sheets logging and verify write path.
- #4 Configure Retell AI phone agent with ElevenLabs custom voice.
- #7 Run full QA against capstone acceptance test matrix.

### Submission Ready

Use this milestone for final packaging and evidence:

- #1 Complete capstone delivery epic.
- #8 Prepare Loom video and final screenshot submission package.

### Post-Demo Enhancements

Use this milestone for non-blocking improvements:

- #5 Import and validate n8n workflow after backend path is stable.
- #6 Evaluate and integrate Composio connector as optional enhancement layer.
- #9 Evaluate optional Replit admin or demo interface.

## Repository visibility

Recommended setting before final submission:

```text
Private repository
```

Reason:

- Prevent premature public exposure of capstone work.
- Reduce risk of exposing accidental screenshots or implementation details.
- Keep project artifacts controlled until submission is complete.

## Manual GitHub settings still required if connector does not expose them

1. Open GitHub repository settings.
2. Change visibility to private if currently public.
3. Create milestones listed above.
4. Assign issues to their milestones.
5. Optionally set label colors and descriptions.

## Security note

Do not store secrets, service account private keys, webhook secrets, or live credentials in issue comments, screenshots, README content, or Loom recordings.
