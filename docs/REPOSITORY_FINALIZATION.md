# Repository Finalization

## Issue

Tracks GitHub issue #10: Finalize GitHub repository settings, milestones, and deterministic lockfile.

## Current repository state

| Item | Status | Evidence |
|---|---|---|
| Default branch | `main` | GitHub branch settings |
| Repository homepage | `https://mama-tees-ai-concierge.vercel.app` | GitHub repository metadata |
| Repository visibility | Public | Deliberate open-source-ready decision; no secrets are committed |
| Issues enabled | Yes | GitHub repository metadata |
| Projects enabled | Yes | GitHub repository metadata |
| Secret scanning | Enabled | GitHub security settings |
| Secret scanning push protection | Enabled | GitHub security settings |
| `package-lock.json` | Present on `main` | Repository root |
| CI install command | `npm ci` | `.github/workflows/ci.yml` |
| Core demo persistence | Google Sheets only | Issue #3 evidence |

## Visibility decision

The original project-management note recommended a private repository before final submission. The repository is currently public.

This is a deliberate decision for open-source readiness, provided the following controls remain true:

- No `.env` file is committed.
- No Google private key is committed.
- No webhook secret is committed.
- No Retell, ElevenLabs, Vercel, Google, or Composio credential is committed.
- Screenshots and Loom recordings redact secrets and billing/account-security pages.
- Runtime secrets remain only in managed platforms such as Vercel and Retell.

If the course provider explicitly requires private submission, change visibility to private before submitting and return it to public after grading.

## Deterministic install policy

CI must use the lockfile-backed command:

```bash
npm ci
```

Do not use `npm install` in CI after `package-lock.json` exists on `main`.

Local validation commands:

```bash
npm ci
npm run build
npm test
npm audit --omit=dev
```

## Recommended repository settings

| Setting | Recommended value | Rationale |
|---|---|---|
| Allow squash merge | Enabled | Keeps history clean for issue-based workflow |
| Allow merge commits | Disabled | Avoids noisy merge commits |
| Allow rebase merge | Enabled | Allows linear history if needed |
| Automatically delete head branches | Enabled | Reduces stale branches after merge |
| Branch protection for `main` | Enabled if supported | Prevents accidental red-main merges |
| Required status checks | `build-test`, `package-lock` if branch protection supports them | Ensures deterministic build/test gate |

## Current issue and milestone mapping

The canonical issue/milestone mapping remains in:

```text
docs/GITHUB_PROJECT_MANAGEMENT.md
```

Core demo priority remains:

1. #2 Backend deployment.
2. #3 Google Sheets logging.
3. #4 Retell AI and ElevenLabs agent.
4. #7 QA acceptance matrix.

Post-demo enhancements remain optional and must not be presented as required for the core demo.

## Closure criteria for issue #10

Issue #10 can close when:

- `package-lock.json` exists on `main`.
- CI uses `npm ci`.
- Repository metadata is set for the project.
- Milestones exist and issue mapping is documented.
- Repository visibility is private or a deliberate public/open-source-ready decision is documented.
- Main branch remains green after finalization changes.
