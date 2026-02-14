# Phase 13: Finalization and Release Readiness

## Purpose
Finalize onboarding/help UX, complete readiness audits, and confirm production release quality before locales expansion.

## Rule References
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 12 completed
- Core route/module parity confirmed
- Backend readiness baselines available (`hms-backend/dev-plan/P008_perf.mdc`)

## Steps (Atomic, Chronological)

### Step 13.1: Onboarding feature hardening
- Finalize onboarding feature contracts (rules/model/api/usecase/events/index).
- Ensure onboarding resume/state restoration is deterministic.
- Add/refresh onboarding feature and screen tests.

### Step 13.2: Help system completion
- Finalize help feature contracts and contextual search UX.
- Ensure help text is fully i18n-backed.
- Add/refresh help feature and screen tests.

### Step 13.3: Localization readiness audit (pre-Phase 14)
- Freeze and validate active translation key inventory.
- Verify default locale (`en`) includes all keys and expected placeholders.
- Verify locale selection and persistence work across all shell areas.

### Step 13.4: Security and compliance audit
- Audit RBAC coverage for route groups and module screens.
- Verify compliance/audit views enforce access restrictions.
- Validate threat/privacy controls for client-visible flows.
- Confirm no sensitive data leakage in UI, logs, or errors.

### Step 13.5: Offline and resilience audit
- Validate offline behavior for critical mutation paths.
- Validate sync recovery and conflict UX paths.
- Confirm loading/empty/error/offline states for high-impact screens.

### Step 13.6: Accessibility completion
- Validate WCAG-focused checks (screen reader, keyboard nav, focus order, 44x44 touch targets).
- Validate dynamic type/font scaling and reduced-motion behavior.
- Validate support for system accessibility preferences, including high-contrast environments, without introducing extra theme variants beyond light/dark.

### Step 13.7: Performance and readiness gates
- Profile critical screens and address regressions.
- Execute data-heavy scenario checks and route transition checks.
- Run full regression suite and coverage gates.
- Finalize documentation and release checklist sign-off.

### Step 13.8: Backend/Frontend parity sign-off
- Confirm frontend route coverage remains aligned with backend modules/endpoints.
- Confirm realtime UX dependencies align with backend WS event coverage.
- Record any approved temporary deltas with owner and target phase.

## Exit Criteria
- All tests pass with required coverage.
- Critical security/offline/accessibility/performance checks are green.
- Backend/frontend parity is signed off.
- Locale phase can start without key drift.

**Next Phase**: `P014_locales.md` (last phase)
