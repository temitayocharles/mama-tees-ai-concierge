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
| #10 | Repository settings, milestones, and deterministic lockfile |

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
| project-management | Repository, milestones, labels, workflow, and issue hygiene. |

## Milestones

Expected milestones:

### Core Demo Ready

Use this milestone for issues that must be complete before a credible live demo:

- #2 Deploy backend API and configure production environment.
- #3 Configure Google Sheets logging and verify write path.
- #4 Configure Retell AI phone agent with ElevenLabs custom voice.
- #7 Run full QA against capstone acceptance test matrix.

### Submission Ready

Use this milestone for final packaging and evidence:

- #1 Complete capstone delivery epic.
- #8 Prepare Loom video and final screenshot submission package.
- #10 Finalize GitHub repository settings, milestones, and deterministic lockfile.

### Post-Demo Enhancements

Use this milestone for non-blocking improvements:

- #5 Import and validate n8n workflow after backend path is stable.
- #6 Evaluate and integrate Composio connector as optional enhancement layer.
- #9 Evaluate optional Replit admin or demo interface.

## Repository visibility

The original recommendation was:

```text
Private repository before final submission
```

Current state:

```text
Public repository
```

Decision:

The public state is acceptable only because the repository is being prepared for open-source availability and does not contain committed secrets. If the course provider requires private visibility during grading, change the repository to private before submission and return it to public afterward.

Controls required for public visibility:

- `.env` remains uncommitted.
- Google service account JSON files are never committed.
- Webhook secrets are never committed.
- Retell, ElevenLabs, Vercel, Google, and Composio credentials are never committed.
- Screenshots and Loom recordings hide secrets, billing pages, and account-security pages.
- GitHub secret scanning and push protection remain enabled.

## Repository settings

Recommended settings:

| Setting | Recommended value |
|---|---|
| Default branch | `main` |
| Homepage | `https://mama-tees-ai-concierge.vercel.app` |
| Issues | Enabled |
| Projects | Enabled |
| Wiki | Optional |
| Squash merge | Enabled |
| Merge commits | Disabled |
| Rebase merge | Enabled |
| Delete branch on merge | Enabled |
| Secret scanning | Enabled |
| Secret scanning push protection | Enabled |
| Branch protection for `main` | Enabled if supported by repository plan |
| Required checks | `build-test`, `package-lock` if branch protection supports them |

## Deterministic dependency policy

`package-lock.json` must remain committed to `main`.

CI must use:

```bash
npm ci
```

Local validation should use:

```bash
npm ci
npm run build
npm test
npm audit --omit=dev
```

## Manual GitHub settings still required if connector does not expose them

1. Open GitHub repository settings.
2. Confirm visibility matches the final submission requirement.
3. Confirm milestones listed above exist.
4. Confirm issues are assigned to milestones.
5. Confirm branch protection exists for `main` if supported.
6. Confirm required checks include `build-test` and `package-lock` if supported.

## Security note

Do not store secrets, service account private keys, webhook secrets, API keys, or live credentials in issue comments, screenshots, README content, repository files, or Loom recordings.
