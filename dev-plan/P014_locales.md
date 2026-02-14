# Phase 14: Locales (Last Phase)

## Purpose
Implement **all supported locale files** and ensure **translation completeness** for the application. This is the **last phase** of development. All user-facing strings must exist in every locale file; no missing keys. Follows `.cursor/rules/i18n.mdc`.

## Prerequisites
- Phase 13 completed (finalization)
- All features and screens implemented and using i18n keys
- Default locale (e.g. `en`) already populated during earlier phases

## Rule References
- `.cursor/rules/i18n.mdc` (authoritative: no hardcoded UI text, keys in all locale files, dot notation, stable keys)
- `.cursor/rules/coding-conventions.mdc` (no restating i18n rules here)
- `hms-backend/dev-plan/P014_locales.mdc` (cross-system locale alignment)

## Steps (Atomic, Chronological)

### Step 14.1: Define Supported Locales
**Goal**: Document and implement the list of supported locales for the project.

**Actions**:
1. Document supported locales in `dev-plan/` (e.g. in this file or `index.md`). Locales are project-specific; the set is defined by the JSON files in `src/i18n/locales/`.
2. Ensure each locale has a corresponding file: `src/i18n/locales/<locale>.json` (e.g. `en.json`, `fr.json`).
3. Per `i18n.mdc`: every translation key must exist in **every** locale file; no key may be missing from any supported language.

**Verification**: List of locales documented; one JSON file per locale.

**Rule Reference**: `.cursor/rules/i18n.mdc`

---

### Step 14.2: Add Missing Keys to All Locale Files
**Goal**: For every key used in the app, add the key and translation to every locale file in `src/i18n/locales/`.

**Actions**:
1. Extract all i18n keys used in the codebase (e.g. from `t()`, `tSync()`, translation key props).
2. For each key, ensure it exists in **every** locale file with an appropriate translation (use professional translation or placeholder; never leave key missing).
3. Use dot notation and logical grouping (e.g. `common.*`, `errors.*`, `navigation.*`) per `i18n.mdc`.
4. Fallback: default locale (e.g. `en`) is used when a key is missing; ensure no runtime crashes; optionally warn in non-production.

**Verification**: No key present in one locale file is missing in another. Automated test or script can validate key parity across locale files.

**Rule Reference**: `.cursor/rules/i18n.mdc`

---

### Step 14.3: Validate and Test Locale Switching
**Goal**: Ensure locale switching works; all UI text updates; no hardcoded strings; RTL supported if applicable.

**Actions**:
1. Test switching to each supported locale; verify all screens and components show translated text.
2. Verify no hardcoded user-facing strings remain (grep or lint per `i18n.mdc`).
3. If RTL locales are supported, verify layout direction and text direction per `i18n.mdc`.
4. Run full test suite with locale coverage; add tests for key presence in all locale files if not already present.

**Verification**: All locales switch correctly; tests pass; key-parity test passes.

**Rule Reference**: `.cursor/rules/i18n.mdc`, `.cursor/rules/testing.mdc`

---

### Step 14.4: Verify Backend-Frontend Locale Parity
**Goal**: Ensure frontend locale coverage stays aligned with backend locale rollout and direction metadata expectations.

**Actions**:
1. Compare frontend locale file set in `src/i18n/locales/` with backend locale coverage documented in `hms-backend/dev-plan/P014_locales.mdc`.
2. Validate RTL behavior consistency for shared RTL locales.
3. Document and justify any frontend-only or backend-only locales.

**Verification**: Locale parity check completed; no undocumented locale drift.

**Rule Reference**: `.cursor/rules/i18n.mdc`

---

## Completion Criteria
- All supported locale files exist in `src/i18n/locales/`.
- Every translation key used in the app exists in every locale file with a valid translation.
- Locale switching works; no hardcoded UI strings; tests pass.
- Supported locales documented in dev-plan.
- Backend/frontend locale parity verified and documented.

**This is the last phase.** No subsequent development phase follows.
