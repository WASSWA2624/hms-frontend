# Phase 13: Finalization and Release Readiness

## Purpose
Finalize onboarding/help UX, retire route placeholders, execute cross-workflow regression packs, and close release readiness gates before locale expansion.

## Rule References
- `.cursor/rules/index.mdc`
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/app-router.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 12 completed.
- Core route/module parity confirmed.
- Backend readiness baselines available (`hms-backend/dev-plan/P008_perf.mdc`).
- WS event dependency inventory available (`hms-backend/dev-plan/P013_ws_features.mdc`).

## Write-up Coverage
- `write-up.md` sections `14`, `15`, `18`, and `19` (NFR, quality gates, DoD, operations readiness).
- `write-up.md` sections `7` and `17` (end-to-end workflows and placeholder retirement obligations).
- `write-up.md` sections `20` and `21` (KPI instrumentation and priority hardening backlog).
- `write-up.md` sections `9.7` and `12.5` (configuration-first adaptability and governance).

## Backend Alignment Gate
- Validate parity against `hms-backend/src/app/router.js`, `hms-backend/dev-plan/P010_api_endpoints.mdc`, and `hms-backend/dev-plan/P011_modules.mdc`.
- Validate WS-driven screens against event contracts in `hms-backend/dev-plan/P013_ws_features.mdc`.
- Validate performance and readiness assumptions against `hms-backend/dev-plan/P008_perf.mdc`.

## Steps (Atomic, Chronological)

### Step 13.1: Onboarding feature hardening
- Finalize onboarding feature contracts (rules/model/api/usecase/events/index).
- Ensure onboarding resume/state restoration is deterministic.
- Add/refresh onboarding feature and screen tests.

### Step 13.2: Help system completion
- Finalize help feature contracts and contextual search UX.
- Ensure help text is fully i18n-backed.
- Add/refresh help feature and screen tests.

### Step 13.3: Placeholder route retirement
- Retire all `[...missing].jsx` route placeholders under `src/app/**`.
- Replace placeholders with concrete route ownership or explicit not-found handling that does not hide missing implementation.
- Re-run route coverage parity and navigation smoke tests.

### Step 13.4: End-to-end workflow regression packs
- Execute regression packs for write-up journeys `7.1` through `7.10` (onboarding, OPD, IPD, emergency, theatre, diagnostics, pharmacy, billing/claims, roster, biomedical).
- Validate workflow action endpoints (section `25`) from route/UI entry points.
- Record pass/fail evidence and blocker ownership.

### Step 13.5: Localization readiness audit (pre-Phase 14)
- Freeze and validate active translation key inventory.
- Verify default locale (`en`) includes all keys and expected placeholders.
- Verify locale selection and persistence work across all shell areas.

### Step 13.6: Security and compliance audit
- Audit RBAC coverage for route groups and module screens.
- Verify compliance/audit views enforce access restrictions.
- Validate threat/privacy controls for client-visible flows.
- Confirm no sensitive data leakage in UI, logs, or errors.

### Step 13.7: Offline and resilience audit
- Validate offline behavior for critical mutation paths.
- Validate sync recovery and conflict UX paths.
- Confirm loading/empty/error/offline states for high-impact screens.

### Step 13.8: Accessibility completion
- Validate WCAG-focused checks (screen reader, keyboard nav, focus order, `44x44` touch targets).
- Validate dynamic type/font scaling and reduced-motion behavior.
- Validate high-contrast support within light/dark token system only.

### Step 13.9: Performance and observability gates
- Profile critical screens and address regressions.
- Execute data-heavy scenario checks and route-transition checks.
- Validate dashboards/alerts for error rate, latency, queue health, and integration failure/retry metrics.
- Run full regression suite and coverage gates.

### Step 13.10: Operational readiness package
- Finalize deploy/rollback/smoke-check artifacts.
- Finalize support readiness artifacts (incident triage runbook, escalation ownership, known-issue playbooks).
- Finalize implementation readiness artifacts (tenant onboarding checklist, role templates, import templates, training plan).

### Step 13.11: Adaptability operations readiness
- Validate configuration lifecycle playbook (draft, review, approve, publish, rollback).
- Validate tenant configuration regression checklist and dependency matrix.
- Validate governance flow for converting custom requests into reusable configuration options.

### Step 13.12: Backend/Frontend parity and release DoD sign-off
- Confirm frontend route/feature coverage aligns with backend modules/endpoints and approved action endpoints.
- Confirm realtime UX dependencies align with backend WS event coverage.
- Confirm release-level DoD gates from write-up section `18.2` are satisfied.
- Record any approved temporary deltas with owner and target phase.

## Exit Criteria
- All tests pass with required coverage and critical workflow regression packs are green.
- Placeholder routes are retired or formally justified with approved owner/date.
- Security, offline, accessibility, performance, and observability gates are green.
- Backend/frontend parity is signed off with no undocumented deltas.
- Locale phase can start without key drift.

**Next Phase**: `P014_locales.md` (last phase)
