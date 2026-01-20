# Synckaiden Academy Threat Model (MVP)

## Assets
- Learner profile + progress data stored client-side.
- Pro access metadata (expiration, plan) stored client-side.
- Workflow blueprints and audit logs.

## Threats
- LocalStorage exfiltration via XSS.
- Unauthorized access to Pro-only workflows.
- Automation misuse without approvals.
- Data tampering or loss across imports/exports.

## Mitigations
- Client data encrypted at rest using WebCrypto (AES-GCM) with per-session or env-provided secrets.
- Tier-based gating on workflows; automation actions logged with timestamps and risk notes.
- Onboarding requires risk acknowledgment and selects tier before access.
- Audit trail for workflow runs (mode, tier, risk message) capped to recent history.
- No automatic external calls or payments; buttons open pricing rather than performing sensitive actions.
- Import/export limited to JSON; parsing errors surfaced to the user.

## Residual Risks
- Client-side secrets are discoverable by a compromised browser; deploy with Content Security Policy and input sanitization.
- Pro key validation is local for MVP; move to a server-backed verifier for production.
- Users must still follow professional/legal guidance for filings and financial changes.
