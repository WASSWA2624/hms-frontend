# Phase 5: Reusable Hooks (Cross‑cutting)

## Purpose
Create **cross-cutting hooks** that are reusable across the entire app (and across apps) and keep UI modular. Hooks are the **only UI gateway** to Redux/services, and in this plan they come early so reusable UI patterns can build on them. **Compliance**: `.cursor/rules/index.mdc` is the entry point; do not duplicate rule content here.

## Rule References
Follow the rule references below. This plan file does not redefine rules—only implementation steps and test requirements.

- `.cursor/rules/hooks-utils.mdc`
- `.cursor/rules/coding-conventions.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`

## Write-up Coverage
- `write-up.md` section `5.2` (UI consumption contract through hooks/use-cases).
- `write-up.md` section `8` (predictable UX states and interaction consistency).
- `write-up.md` sections `14.2` and `14.4` (performance and offline-aware UX behavior).
- `write-up.md` section `15` (test gates for hook orchestration paths).

## Backend Alignment Gate
- Domain hooks must delegate module operations to Phase 10 feature contracts that map to backend modules/endpoints.
- Hooks must expose normalized state/error codes suitable for backend action-endpoint workflows.
- Hooks used by entitlement-sensitive screens must remain compatible with module activation gating from Group 18.

## Prerequisites
- Phase 4 completed
- Store configured (Phase 3)
- Offline/network slice available (Phase 4)

## Atomic and Chronology Contract (Mandatory)
- Execute steps strictly in listed order; do not skip ahead.
- One step equals one primary deliverable; if a step lists multiple items, execute them as sequential atomic sub-units within that step.
- Complete implementation, tests, backend-alignment checks, and rule-compliance checks for the current step before starting the next step.
- Do not pull work from later phases into the current phase unless explicitly declared as a prerequisite gate.

## Steps

### Step 5.1: Create `useTheme` (store-backed theme access)
**Goal**: Provide a stable, reusable hook for reading the current theme object (for UI logic that needs it).

**Actions**:
- Create `src/hooks/useTheme.js` that:
  - reads the theme from Redux selectors (via `useSelector`)
  - returns a stable theme reference (avoid re-computing)
  - does not import UI components

**Tests (mandatory)**: `src/__tests__/hooks/useTheme.test.js`
- **Returns theme**: when selector returns a theme object, hook returns the same object.
- **No crash**: when theme is missing/undefined, hook returns a safe fallback or `null` (decide and enforce).
- **No extra recompute**: (if you add derived values) ensure memoization is correct.

---

### Step 5.2: Create `useNetwork` (online/offline + sync state)
**Goal**: Provide normalized network state for UI and hooks (no UI checks of NetInfo directly).

**Actions**:
- Create `src/hooks/useNetwork.js` that:
  - reads `isOnline`, `isSyncing` (and optionally network type) from selectors
  - exposes derived flags like `isOffline = !isOnline`
  - exposes **errorCode only** if your network slice stores one

**Tests (mandatory)**: `src/__tests__/hooks/useNetwork.test.js`
- **Online/offline**: returns `isOnline` and derived `isOffline` correctly for both states.
- **Sync state**: returns `isSyncing` correctly.
- **Selector isolation**: does not call services or NetInfo; only selectors.

---

### Step 5.3: Create `useI18n` (no hardcoded UI strings)
**Goal**: Centralize string lookup so UI components and patterns avoid hardcoded strings.

**Actions**:
- Create `src/hooks/useI18n.js` that exposes a small API:
  - `t(key, params?)` with deterministic fallback behavior
  - (optional) `locale`, `setLocale()` if your i18n layer supports overrides

**Tests (mandatory)**: `src/__tests__/hooks/useI18n.test.js`
- **Known key**: returns correct string.
- **Missing key**: returns deterministic fallback (e.g., key itself or `en` fallback) and never throws.
- **Interpolation**: if params supported, verifies replacement.
- **No side effects**: no logging in production paths.

---

### Step 5.4: Create `useDebounce(value, delayMs)`
**Goal**: Reusable debouncing for search inputs, filters, and expensive computations.

**Actions**:
- Create `src/hooks/useDebounce.js` that:
  - returns debounced value after `delayMs`
  - clears timers on unmount and on value/delay changes

**Tests (mandatory)**: `src/__tests__/hooks/useDebounce.test.js`
- Use **fake timers**.
- **Delays update**: value updates only after `delayMs`.
- **Cancels previous timer**: rapid changes only emit last value.
- **Unmount safety**: no state update after unmount.
- **Delay change**: changing delay applies correctly.

---

### Step 5.5: Create `usePagination({ initialPage, initialLimit })`
**Goal**: Standardize pagination state management across list screens.

**Actions**:
- Create `src/hooks/usePagination.js` returning:
  - `page`, `limit`, `setPage`, `setLimit`, `reset`, and optionally `nextPage`, `prevPage`
  - keep logic generic; no feature imports

**Tests (mandatory)**: `src/__tests__/hooks/usePagination.test.js`
- **Initial state**: respects initial values.
- **Setters**: updates page/limit.
- **Reset**: resets to initial state.
- **Bounds (if implemented)**: prevents invalid page/limit values deterministically.

---

### Step 5.6: Create `useAsyncState()` (standard async shape)
**Goal**: Avoid inconsistent ad-hoc loading/error/data patterns across UI.

**Actions**:
- Create `src/hooks/useAsyncState.js` that standardizes:
  - `isLoading`, `errorCode`, `data`
  - `start()`, `succeed(data)`, `fail(errorCode)`, `reset()`
- Keep it generic and deterministic.

**Tests (mandatory)**: `src/__tests__/hooks/useAsyncState.test.js`
- **State transitions**:
  - initial → start → succeed
  - initial → start → fail
  - fail → reset
- **Error codes only**: `fail()` stores codes and never stores raw error objects.
- **Idempotency**: calling `start()` twice keeps consistent state.

---

### Step 5.7: Hooks barrel export
**Goal**: Centralize exports for clean imports and enforce stable named exports.

**Actions**:
- Update/create `src/hooks/index.js` exporting only:
  - `useTheme`, `useNetwork`, `useI18n`, `useDebounce`, `usePagination`, `useAsyncState`

**Tests (mandatory)**:
- `src/__tests__/hooks/index.test.js`:
  - importing from `@hooks` returns defined functions (smoke test)

---

### Step 5.8: Coverage gate for hooks
**Goal**: Ensure hooks are truly “done” before moving to UI foundation.

**Actions**:
- Run `npm run test:coverage` and confirm hooks folder meets target thresholds.

---

## Completion Criteria
- [x] All cross-cutting hooks implemented and tested.
- [x] No feature hooks import `src/features/**` internals or raw store internals.
- [x] Hook APIs are generic and reusable (no domain-specific module knowledge hardcoded).
- [x] Hook outputs support backend-aligned error/action handling patterns.

**Next Phase**: `P006_platform-ui-foundation.md`



