# GitHub Project Management

## Purpose

This repository uses GitHub issues, branches, pull requests, and milestones to track delivery work for Mama Tee's Kitchen AI Voice Concierge.

The workflow is designed to keep changes reviewable, scoped, and safe for a production-facing client system.

## Issue workflow

Each meaningful change should map to a GitHub issue.

Recommended issue flow:

1. Confirm the issue scope.
2. Create a branch from latest `main`.
3. Make the smallest complete change required.
4. Preserve business rules unless the issue explicitly requires a change.
5. Update documentation when behavior changes.
6. Run validation.
7. Open a pull request into `main`.
8. Merge only after checks are green and the scope is reviewed.

## Branch naming

Use explicit branch names:

```text
issue-4-retell-elevenlabs-agent
issue-5-n8n-fallback-workflow
issue-7-qa-acceptance-matrix
issue-8-delivery-evidence-package
docs-client-delivery-positioning
```

## Pull request expectations

Each PR should include:

- issue reference,
- summary of changes,
- files changed,
- validation commands run,
- results,
- risks,
- follow-up items,
- evidence when relevant.

Use `Resolve #N` or `Closes #N` only when the issue is fully complete.

Use `Progress #N` when the PR moves the issue forward but does not satisfy all closure criteria.

## Validation baseline

Run, or confirm CI runs:

```bash
npm ci
npm run build
npm test
```

Optional audit:

```bash
npm audit --omit=dev
```

## Review checklist

Before merge, verify:

- scope matches the issue,
- no credentials are committed,
- no `.env` files are committed,
- business rules are preserved,
- backend remains the validation authority,
- Google Sheets remains the visible log,
- optional automation paths do not replace the primary Retell path,
- tests and build pass,
- CI is green,
- documentation matches actual behavior.

## Current issue map

```text
#1  Overall delivery coordination
#2  Backend deployment and production environment
#3  Google Sheets logging and write-path verification
#4  Retell AI phone agent with ElevenLabs custom voice
#5  n8n fallback workflow validation
#6  Optional connector enhancement evaluation
#7  QA acceptance matrix and live validation
#8  Delivery evidence package
#9  Optional interface evaluation
#10 Repository finalization and deterministic install path
```

## Closure discipline

Do not close issues based on configuration alone. Close only when the required evidence exists.

Examples:

- Voice-agent work is not complete until live calls are validated and Google Sheets rows are verified.
- n8n fallback work is not complete until the runtime is configured, backend returns HTTP 201, and the Google Sheet row is verified.
- Delivery evidence is not complete until screenshots or recordings are sanitized and reviewed for credential exposure.
