# Phase 12: Finalization (Onboarding/Help + Testing/Polish)

## Purpose
Close the loop after biomed features are complete:
- onboarding/help (final content depends on final feature set)
- create all additional locale files (21 languages) based on the complete English locale
- comprehensive testing + audits (a11y, security, performance, offline)
- documentation + final readiness checklist

## Rule References
- `.cursor/rules/features-domain.mdc` (Feature Template Structure - **MANDATORY**)
- `.cursor/rules/component-structure.mdc` (Screen Structure - **MANDATORY**)
- `.cursor/rules/platform-ui.mdc` (Screen Requirements - **MANDATORY**)
- `.cursor/rules/testing.mdc` (Testing Requirements - **MANDATORY**)
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 11 completed
- App Router and screens are in place

## Steps

### Step 12.1: Onboarding feature + screens
**Goal**: Progressive onboarding that is modular and role-aware.

**Rule References**:
- Feature structure: `.cursor/rules/features-domain.mdc` (Feature Template Structure - **MANDATORY**)
- Screen structure: `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`
- Testing: `.cursor/rules/testing.mdc`

**Actions**:
- Feature: `onboarding` - **must follow feature template structure** per `.cursor/rules/features-domain.mdc`:
  - `src/features/onboarding/onboarding.rules.js` - Business rules & validation (pure functions)
  - `src/features/onboarding/onboarding.model.js` - Domain models
  - `src/features/onboarding/onboarding.api.js` - Feature-level API orchestration
  - `src/features/onboarding/onboarding.usecase.js` - Application use cases
  - `src/store/slices/onboarding.slice.js` - Redux slice (if global state needed)
  - `src/hooks/useOnboarding.js` - UI gateway hook (exposes feature API)
  - `src/features/onboarding/index.js` - Barrel exports (public API only)
- Screens/components **must follow** `.cursor/rules/component-structure.mdc`:
  - Platform separation: `.android.jsx`, `.ios.jsx`, `.web.jsx`
  - Platform-specific styles: `.android.styles.jsx`, `.ios.styles.jsx`, `.web.styles.jsx`
  - Shared logic hook: `useOnboardingScreen.js`
  - Reuse Phase 6 platform UI patterns:
    - Role selection
    - Feature tour (tooltips)
    - Progress indicator
    - Skip/resume support

**Tests (mandatory - per `.cursor/rules/testing.mdc`)**:
- Feature tests:
  - `src/__tests__/features/onboarding/onboarding.rules.test.js` (100% coverage - all branches)
  - `src/__tests__/features/onboarding/onboarding.model.test.js` (100% coverage - all branches)
  - `src/__tests__/features/onboarding/onboarding.api.test.js` (high coverage, mock apiClient)
  - `src/__tests__/features/onboarding/onboarding.usecase.test.js` (high coverage, error paths)
  - `src/__tests__/store/slices/onboarding.slice.test.js` (if slice exists - state transitions)
  - `src/__tests__/hooks/useOnboarding.test.js` (if hook exists - selector/dispatch interactions)
- Screen tests (per `.cursor/rules/testing.mdc`):
  - `src/__tests__/platform/screens/OnboardingScreen.test.js` (render, progress, skip/resume, loading/error/empty states)
  - Accessibility tests: labels, focus order (web), touch targets (per `.cursor/rules/accessibility.mdc`)

---

### Step 12.2: Help system (knowledge base + contextual help)
**Goal**: Contextual help surfaces and searchable knowledge base.

**Rule References**:
- Feature structure: `.cursor/rules/features-domain.mdc` (Feature Template Structure - **MANDATORY**)
- Component structure: `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`
- Testing: `.cursor/rules/testing.mdc`
- i18n: `.cursor/rules/i18n.mdc` (no hardcoded UI strings)
- Accessibility: `.cursor/rules/accessibility.mdc`

**Actions**:
- Feature: `help` - **must follow feature template structure** per `.cursor/rules/features-domain.mdc`:
  - `src/features/help/help.rules.js` - Business rules & validation (pure functions)
  - `src/features/help/help.model.js` - Domain models
  - `src/features/help/help.api.js` - Feature-level API orchestration
  - `src/features/help/help.usecase.js` - Application use cases
  - `src/store/slices/help.slice.js` - Redux slice (if global state needed)
  - `src/hooks/useHelp.js` - UI gateway hook (exposes feature API)
  - `src/features/help/index.js` - Barrel exports (public API only)
- UI components **must follow** `.cursor/rules/component-structure.mdc`:
  - Help button component (platform separation)
  - Help modal component (platform separation)
  - Article list/detail screens (platform separation)
  - Search component (reuse Phase 6 patterns)
  - All strings must come from `@i18n` (per `.cursor/rules/i18n.mdc`)

**Tests (mandatory - per `.cursor/rules/testing.mdc`)**:
- Feature tests:
  - `src/__tests__/features/help/help.rules.test.js` (100% coverage - all branches)
  - `src/__tests__/features/help/help.model.test.js` (100% coverage - all branches)
  - `src/__tests__/features/help/help.api.test.js` (high coverage, mock apiClient)
  - `src/__tests__/features/help/help.usecase.test.js` (high coverage, error paths)
  - `src/__tests__/store/slices/help.slice.test.js` (if slice exists - state transitions)
  - `src/__tests__/hooks/useHelp.test.js` (if hook exists - selector/dispatch interactions)
- UI tests:
  - Component tests: render, interactions, loading/error/empty states
  - **i18n verification**: Ensure no hardcoded UI strings (all strings from `@i18n` per `.cursor/rules/i18n.mdc`)
  - **A11y tests** (per `.cursor/rules/accessibility.mdc`): labels, focus order (web), touch targets, keyboard navigation

---

### Step 12.3: Coverage enforcement (unit tests)
**Goal**: Meet the required coverage standard and prevent regression.

**Rule References**:
- `.cursor/rules/testing.mdc` (Coverage Requirements - **MANDATORY**)

**Actions**:
- Run `npm run test:coverage`
- Verify coverage thresholds per `.cursor/rules/testing.mdc`:
  - **100% coverage** mandatory overall (statements, branches, functions, lines)
  - Branch coverage is mandatory (if/else/switch/ternary) - all code paths must be tested
- Add missing tests to meet thresholds:
  - **Utils** (`src/utils/**`): All branches covered, edge cases, inputs/outputs
  - **Hooks** (`src/hooks/**`): Error paths, state transitions, side effects
  - **Slices** (`src/store/slices/**`): Error paths, state transitions, all reducer branches
  - **Features** (`src/features/**`):
    - Rules: **100% coverage** (all branches) - mandatory
    - Models: **100% coverage** (all branches) - mandatory
    - API/usecase/slice/hook: **high coverage**, include error paths
  - **Services** (`src/services/**`): Behavior via mocks, error handling
  - **Platform UI** (`src/platform/**`): Key variants/states, interactions, a11y props

**Verification**:
- Coverage report shows 100% coverage overall (statements, branches, functions, lines) per `testing.mdc`
- All branches covered (if/else/switch/ternary)
- No untested error paths in hooks/slices/features

---

### Step 12.4: Integration tests (core flows)
**Goal**: Validate major user flows without relying on real network/storage.

**Rule References**:
- `.cursor/rules/testing.mdc` (Integration Testing - **MANDATORY**)

**Requirements** (per `.cursor/rules/testing.mdc`):
- Never call real external systems (network, storage, SDKs) in tests
- Mock boundaries (services, storage, time, navigation) as needed
- Prefer behavior-driven tests (testing-library style) over implementation details

**Flows (minimum)**:
- **Buyer flow**: login → browse products → add to cart → checkout → order created
- **Vendor flow**: create shop → add product → manage inventory
- **Offline flow**: queue mutation → reconnect → sync completes

**Test Structure**:
- Create `src/__tests__/integration/` directory
- Each flow should be a separate test file
- Mock all external dependencies (API, storage, navigation)
- Verify state transitions and side effects
- Test error scenarios and edge cases

---

### Step 12.5: Accessibility, security, performance, offline audits
**Goal**: Verify non-functional requirements.

**Rule References**:
- `.cursor/rules/accessibility.mdc` (A11y Requirements - **MANDATORY**)
- `.cursor/rules/security.mdc` (Security Requirements - **MANDATORY**)
- `.cursor/rules/performance.mdc` (Performance Requirements - **MANDATORY**)
- `.cursor/rules/offline-sync.mdc` (Offline Requirements - **MANDATORY**)
- `.cursor/rules/errors-logging.mdc` (Error Handling Requirements)

**Actions**:
- **A11y audit** (per `.cursor/rules/accessibility.mdc`):
  - Screen reader compatibility (all interactive elements labeled)
  - Keyboard navigation (web - full keyboard access)
  - Contrast verification (WCAG AA/AAA compliance)
  - Dynamic type support (font scaling)
  - Touch targets (minimum 44x44px)
  - Focus states visible (web)
- **Security audit** (per `.cursor/rules/security.mdc`):
  - Secure storage verification (tokens in SecureStore only)
  - No sensitive data in logs (per `.cursor/rules/errors-logging.mdc`)
  - Error sanitization (no raw errors exposed to UI)
  - Token security (never in plain text, proper refresh flow)
  - Feature gating (guards properly implemented)
- **Performance audit** (per `.cursor/rules/performance.mdc`):
  - List virtualization (`FlatList`/`SectionList` for large collections)
  - Memoization (expensive computations memoized in hooks)
  - Redux state (normalized data, no large in-memory objects)
  - Pagination (incremental loading, not "fetch all")
  - Image optimization (optimized formats and sizes)
  - Reduced motion support
- **Offline audit** (per `.cursor/rules/offline-sync.mdc`):
  - Queue correctness (persistence, order preservation)
  - Deterministic retries (idempotent sync logic)
  - Network state handling (UI reacts via selectors, not direct checks)
  - Sync triggers (event-driven, not UI-driven)
  - Hydration (deterministic, fail-safe)

---

### Step 12.6: Create all additional locale files
**Goal**: Create all remaining locale files (21 additional languages) based on the complete English locale.

**Rule References**:
- i18n: `.cursor/rules/i18n.mdc` (22 languages with location-based defaults - **MANDATORY**)
- Testing: `.cursor/rules/testing.mdc` (Testing Requirements)

**Prerequisites**:
- `en.json` locale file is complete with all translation keys from all phases (1-11)
- All features have been implemented and their translations added to `en.json`

**Actions**:
1. Verify `en.json` is complete:
   - All translation keys from all features are present
   - All screens have their translations
   - All error messages are translated
   - All UI components have their translations
   - No missing keys or placeholders

2. Update `src/i18n/index.js` to import all 22 locale files:
   ```javascript
   import en from './locales/en.json';
   import zh from './locales/zh.json';
   import hi from './locales/hi.json';
   import es from './locales/es.json';
   import fr from './locales/fr.json';
   import ar from './locales/ar.json';
   import bn from './locales/bn.json';
   import pt from './locales/pt.json';
   import ru from './locales/ru.json';
   import ur from './locales/ur.json';
   import id from './locales/id.json';
   import de from './locales/de.json';
   import ja from './locales/ja.json';
   import pcm from './locales/pcm.json';
   import mr from './locales/mr.json';
   import te from './locales/te.json';
   import tr from './locales/tr.json';
   import ta from './locales/ta.json';
   import yue from './locales/yue.json';
   import vi from './locales/vi.json';
   import sw from './locales/sw.json';
   import lg from './locales/lg.json';
   
   const translations = { en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, pcm, mr, te, tr, ta, yue, vi, sw, lg };
   ```

3. Create all 21 additional locale files in `src/i18n/locales/`:
   - `zh.json` (Mandarin Chinese)
   - `hi.json` (Hindi)
   - `es.json` (Spanish)
   - `fr.json` (French)
   - `ar.json` (Standard Arabic)
   - `bn.json` (Bengali)
   - `pt.json` (Portuguese)
   - `ru.json` (Russian)
   - `ur.json` (Urdu)
   - `id.json` (Indonesian)
   - `de.json` (German)
   - `ja.json` (Japanese)
   - `pcm.json` (Nigerian Pidgin)
   - `mr.json` (Marathi)
   - `te.json` (Telugu)
   - `tr.json` (Turkish)
   - `ta.json` (Tamil)
   - `yue.json` (Cantonese)
   - `vi.json` (Vietnamese)
   - `sw.json` (Swahili)
   - `lg.json` (Luganda)

4. For each locale file:
   - Copy the complete structure from `en.json`
   - Translate all values to the target language
   - Ensure all keys match exactly (same structure, same keys)
   - Use professional translation services or native speakers
   - Verify cultural appropriateness and context

5. Verify locale file completeness:
   - All 22 locale files have the same keys
   - All 22 locale files have translated values (no English placeholders)
   - All locale files have the same JSON structure
   - No missing keys in any locale file

**Expected Outcome**:
- All 22 locale files exist and are complete
- All locale files have identical key structures
- All translations are complete (no placeholders or missing translations)
- i18n system supports all 22 languages
- Users can switch between all supported languages

**Tests (mandatory - per `testing.mdc`)**:
- Create `src/__tests__/i18n/locale-completeness.test.js`
- Test all 22 locale files exist
- Test all locale files have identical key structures (compare keys with `en.json`)
- Test no locale file has missing keys
- Test no locale file has empty or placeholder values
- Test i18n system can load all 22 locales
- Test locale switching works for all 22 languages
- **Coverage**: 100% verification of locale completeness required
- **Verification**: All locale files complete and verified before proceeding to Step 12.7

---

### Step 12.7: Documentation + final checklist
**Goal**: Ensure reproducibility and maintainability.

**Rule References**:
- `.cursor/rules/coding-conventions.mdc` (Enforcement - **MANDATORY**)
- `.cursor/rules/core-principles.mdc` (JavaScript Only - **MANDATORY**)

**Actions**:
- Document components, hooks, and feature public APIs:
  - Component APIs (props, variants, usage examples)
  - Hook APIs (returned values, parameters, side effects)
  - Feature public APIs (exported from `index.js` barrel files)
  - Screen requirements (loading/error/empty/offline states)
- Final checklist (per `.cursor/rules/coding-conventions.mdc`):
  - ✅ All tests passing (unit + integration)
  - ✅ Coverage thresholds met (100% overall per `testing.mdc`)
  - ✅ No lint errors (ESLint passes)
  - ✅ No TypeScript files (per `.cursor/rules/core-principles.mdc`)
  - ✅ A11y verified (per `.cursor/rules/accessibility.mdc`)
  - ✅ Security verified (per `.cursor/rules/security.mdc`)
  - ✅ Performance verified (per `.cursor/rules/performance.mdc`)
  - ✅ Offline verified (per `.cursor/rules/offline-sync.mdc`)
  - ✅ All rule violations addressed
  - ✅ Documentation updated

---

## Completion Criteria
**Rule References**: All completion criteria must comply with referenced rules above (`features-domain.mdc`, `component-structure.mdc`, `platform-ui.mdc`, `testing.mdc`, `accessibility.mdc`, `security.mdc`, `performance.mdc`, `offline-sync.mdc`, `errors-logging.mdc`, `i18n.mdc`, `coding-conventions.mdc`, `core-principles.mdc`).

- ✅ Onboarding feature completed following feature template structure (per `.cursor/rules/features-domain.mdc`)
- ✅ Help feature completed following feature template structure (per `.cursor/rules/features-domain.mdc`)
- ✅ Onboarding and help screens completed following component structure (per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`)
- ✅ All features have 100% test coverage for rules/models (per `.cursor/rules/testing.mdc`)
- ✅ All features have high test coverage for api/usecase/slice/hook (per `.cursor/rules/testing.mdc`)
- ✅ Coverage thresholds met (100% overall per `.cursor/rules/testing.mdc`)
- ✅ Integration tests added for core flows (per `.cursor/rules/testing.mdc`)
- ✅ Audits completed (a11y/security/perf/offline per respective rule files)
- ✅ No hardcoded UI strings (all strings from `@i18n` per `.cursor/rules/i18n.mdc`)
- ✅ All 22 locale files created and complete (per `.cursor/rules/i18n.mdc`)
- ✅ All locale files have identical key structures (all keys from `en.json` present in all locales)
- ✅ No TypeScript files (per `.cursor/rules/core-principles.mdc`)
- ✅ Docs updated and final readiness checklist passes

