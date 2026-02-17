# Phase 14: Locales (Last Phase)

## Purpose
Implement all supported locale files, enforce translation-key parity, validate RTL behavior, and lock backend/frontend locale compatibility. This is the final phase in the frontend roadmap.

## Rule References
- `.cursor/rules/index.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/coding-conventions.mdc`
- `hms-backend/dev-plan/P014_locales.mdc`

## Prerequisites
- Phase 13 completed (finalization gates closed).
- All features and screens implemented and using i18n keys.
- Default locale (`en`) populated and validated.

## Write-up Coverage
- `write-up.md` section `8.5` (i18n/localization requirements).
- `write-up.md` sections `14.5` and `15.3` (observability + quality gate checks for locale behavior).
- `write-up.md` sections `18.2` and `19.3` (release readiness and client implementation readiness).
- `write-up.md` section `10` (regional payment/commercial terminology readiness).

## Backend Alignment Gate
- Supported locale codes must stay aligned with backend locale rollout in `hms-backend/dev-plan/P014_locales.mdc`.
- Shared RTL locales must align on direction metadata and rendering behavior.
- Any locale drift (frontend-only or backend-only) requires explicit justification, owner, and target resolution phase.

## Supported Locale Target Set
Target locale codes for parity with backend expansion:
`en, es, fr, de, it, pt, ru, nl, pl, sv, el, ro, cs, hu, uk, da, no, fi, tr, zh, ja, ko, hi, bn, ur, pa, te, mr, ta, vi, th, ms, id, tl, gu, jv, yue, fa, km, my, ne, si, ar, he, sw, am, ha, yo, zu, af, lg, ht, qu, mi`

RTL subset requiring direction validation:
`ar, he, fa, ur`

## Steps (Atomic, Chronological)

### Step 14.1: Finalize locale inventory and files
**Goal**: Lock the supported locale list and create one file per locale in `src/i18n/locales/`.

**Actions**:
1. Declare/verify supported locales in frontend config and document them in this file.
2. Ensure each locale has `src/i18n/locales/<locale>.json`.
3. Keep `en` as fallback/default locale.

**Verification**:
- File exists for every supported locale code.
- Locale inventory matches documented list.

### Step 14.2: Enforce translation-key parity and schema checks
**Goal**: Ensure every key used in app code exists in every locale file.

**Actions**:
1. Extract keys used by UI (`t()` and related helpers).
2. Validate cross-file key parity against `en.json`.
3. Validate placeholder/template consistency (same interpolation tokens across locales).

**Verification**:
- No missing keys in any supported locale file.
- No malformed JSON or interpolation-token drift.

### Step 14.3: Validate runtime locale switching and RTL behavior
**Goal**: Confirm locale switching works safely and completely across web/iOS/Android.

**Actions**:
1. Test switching into each locale and verify translated UI across core workflows.
2. Validate no hardcoded user-facing strings remain.
3. Validate RTL direction/layout for `ar`, `he`, `fa`, `ur`.
4. Validate date/number/currency formatting through `Intl` pathways.

**Verification**:
- Locale switching updates UI without crashes.
- RTL locales render with correct direction and usable layout.
- Formatting output matches locale expectations.

### Step 14.4: Verify backend/frontend locale parity and metadata behavior
**Goal**: Ensure frontend locale support matches backend locale expansion and direction metadata behavior.

**Actions**:
1. Compare locale code sets and RTL expectations with `hms-backend/dev-plan/P014_locales.mdc`.
2. Validate shared locale behavior on fallback and invalid-locale paths.
3. Document any accepted temporary drift with owner/date.

**Verification**:
- No undocumented locale drift.
- Shared locales behave consistently across frontend/backend contracts.

### Step 14.5: Locale release lock and final sign-off
**Goal**: Close localization as a release-blocking quality gate.

**Actions**:
1. Run locale-focused regression tests and key-parity CI checks.
2. Capture localization sign-off evidence in release artifacts.
3. Freeze locale catalogs for release branch cut.

**Verification**:
- Localization gate marked green in release checklist.
- Locale catalogs frozen and traceable.

## Completion Criteria
- All supported locale files exist in `src/i18n/locales/`.
- Every translation key used in the app exists in every locale file with valid placeholders.
- Locale switching works across all platforms with no hardcoded UI strings.
- RTL locales (`ar`, `he`, `fa`, `ur`) are validated and usable.
- Backend/frontend locale parity is verified and documented.
- Localization release gate is signed off.

**This is the last phase.** No subsequent development phase follows.
