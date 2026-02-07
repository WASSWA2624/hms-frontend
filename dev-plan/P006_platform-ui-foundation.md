# Phase 6: Reusable Platform UI Foundation

## Purpose
Build **reusable, app-agnostic UI building blocks** (primitives, patterns, and layouts) for Android/iOS/Web using **styled-components + theme tokens** and strict platform separation. All components must follow **Microsoft Fluent / Microsoft 365 look and feel** per `.cursor/rules/theme-design.mdc` (Fluent blue primary, neutrals, Segoe UI–style typography, 2–4px radius, light elevation). This phase intentionally avoids app-specific feature logic so it can be reused across many apps.

## Compliance
`.cursor/rules/index.mdc` is the entry point; do not duplicate rule content here.

## Rule References
Follow the rule references below. This plan file does not redefine rules—only implementation steps and test requirements.

- `.cursor/rules/index.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/theme-design.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/coding-conventions.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/hooks-utils.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/dependency-policy.mdc`

## Prerequisites
- Phase 5 completed (cross-cutting hooks available for UI patterns)
- Theme tokens available (Phase 3)
- Store available (for theme state, network state, etc.)

**IMPORTANT - Component Grouping (MANDATORY)**:
- **All related components MUST be grouped** in category folders using **regular folder names** (NO parentheses) per `.cursor/rules/component-structure.mdc`
- Use regular folder names: `forms/`, `navigation/`, `feedback/`, `display/`, `layout/`, `states/`
- **Important**: Parentheses `(category-name)` are **ONLY** allowed in `src/app/` for route groups (see `app-router.mdc`). Platform folders (`src/platform/`) use regular folder names without parentheses.
- Group by functional category (forms, navigation, feedback, etc.) or feature domain
- Each component still has its own folder within the group
- Core components (if very few) can be at root, but **grouping is preferred**
- See `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc` for complete requirements

## Steps

### Step 6.1: UI Primitives — build **one by one** (strict gates)
**Goal**: Establish the **foundation primitives** that any React Native app needs. These primitives are **single-source-of-truth** UI building blocks and must be **reused**, not redefined, by other components and screens.

**Gate rule**: do not start the next component until the current component is complete per `.cursor/rules/testing.mdc` and the relevant UI rules referenced at the top of this file.

**Testing requirements** (per `.cursor/rules/testing.mdc`):
- **100% coverage** mandatory for all components (statements, branches, functions, lines)
- Tests must live in `src/__tests__/platform/components/ComponentName.test.js`
- All tests must cover key variants/states, interactions, and a11y behavior

**i18n requirements** (per `.cursor/rules/i18n.mdc`):
- **ALL user-facing text in components MUST use i18n** - NO hardcoded strings
- Component props that accept text (labels, placeholders, error messages) should accept translation keys or use i18n internally
- All accessibility labels must be internationalized
- See `.cursor/rules/i18n.mdc` for complete requirements

#### Step 6.1.1: `Text` (basic primitive)
**Implement**: follow the platform component structure in `.cursor/rules/component-structure.mdc` and platform wiring rules in `.cursor/rules/platform-ui.mdc`.

**Tests** (per `.cursor/rules/testing.mdc`): cover variants/states and any applicable a11y behavior per `.cursor/rules/accessibility.mdc`.

**Gate**: `Text` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.2: `Button` (core interactive primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, and `.cursor/rules/theme-design.mdc`.

**Tests** (per `.cursor/rules/testing.mdc`): cover variants/sizes/states, interactions, and web keyboard + a11y per `.cursor/rules/accessibility.mdc`.

**Gate**: `Button` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.3: `TextField` (input primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc` (keep UI presentation-only; reference `.cursor/rules/features-domain.mdc` for validation ownership).

**Tests** (per `.cursor/rules/testing.mdc`): cover states (incl. error), events, and a11y labeling/keyboard behavior per `.cursor/rules/accessibility.mdc`.

**Gate**: `TextField` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.4: `Divider` (layout primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` + `.cursor/rules/theme-design.mdc`.

**Tests** (per `.cursor/rules/testing.mdc`): render variants and edge props.

**Gate**: `Divider` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.5: `Card` (surface primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` + `.cursor/rules/theme-design.mdc`.

**Tests** (per `.cursor/rules/testing.mdc`): render variants and composition behavior.

**Gate**: `Card` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.6: `LoadingSpinner` (feedback primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, and `.cursor/rules/accessibility.mdc`.

**Tests** (per `.cursor/rules/testing.mdc`): render size variants and a11y behavior.

**Gate**: `LoadingSpinner` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.7: `Skeleton` (loading placeholder primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, and `.cursor/rules/performance.mdc` (motion considerations).

**Tests** (per `.cursor/rules/testing.mdc`): render variants and edge props.

**Gate**: `Skeleton` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.8: `Modal` (foundational overlay primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/accessibility.mdc`, and `.cursor/rules/platform-ui.mdc` (platform-specific behavior).

**Tests** (per `.cursor/rules/testing.mdc`): open/close, dismiss behaviors, and web keyboard accessibility.

**Gate**: `Modal` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.9: `TextArea` (multiline input primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `TextArea` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.10: `Checkbox` (selection control primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (toggle, disabled, a11y).
**Gate**: `Checkbox` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.11: `Radio` (selection control primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (select, disabled, a11y).
**Gate**: `Radio` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.12: `Switch` (toggle control primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (toggle, disabled, a11y).
**Gate**: `Switch` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.13: `Select` (picker/dropdown primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc` (platform-specific UI).
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc` (keyboard on web).
**Gate**: `Select` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.14: `Icon` (visual primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/theme-design.mdc` (token-driven sizing/color). Any dependency changes must follow `.cursor/rules/dependency-policy.mdc` and require approval.
**Tests**: per `.cursor/rules/testing.mdc` (renders; does not break a11y semantics when decorative).
**Gate**: `Icon` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.15: `Avatar` (image primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (fallback/initials, sizes, a11y label when meaningful).
**Gate**: `Avatar` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.16: `Screen` (safe-area + scroll container primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc` (platform-safe wrappers).
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `Screen` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.17: `Stack` (layout primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/theme-design.mdc` (spacing tokens).
**Tests**: per `.cursor/rules/testing.mdc` (all layout variants; no inline styles).
**Gate**: `Stack` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.18: `Spacer` (spacing primitive)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/theme-design.mdc` (spacing tokens).
**Tests**: per `.cursor/rules/testing.mdc` (all size/axis variants; no inline styles).
**Gate**: `Spacer` tests pass and implementation complies with referenced UI rules.

#### Step 6.1.19: `Image` (media primitive)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, `.cursor/rules/accessibility.mdc`, and `.cursor/rules/performance.mdc` (lazy loading, optimization).
**Tests**: per `.cursor/rules/testing.mdc` (loading states, error handling, fallback behavior, a11y labels).
**Gate**: `Image` tests pass and implementation complies with referenced UI rules.

---

### Step 6.2: Feedback + Status UI (build one by one)
**Gate rule**: same gated approach as Step 6.1.

#### Step 6.2.1: `Badge`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/theme-design.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `Badge` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.2: `Chip`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/theme-design.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc` (interactive states).
**Gate**: `Chip` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.3: `ProgressBar`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/theme-design.mdc`, `.cursor/rules/performance.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `ProgressBar` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.4: `Toast`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (timing/visibility; dismiss; keyboard on web if applicable).
**Gate**: `Toast` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.5: `Snackbar` (alternative to Toast, implement if different UX pattern needed)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (timing/visibility; dismiss; keyboard on web if applicable).
**Gate**: `Snackbar` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.6: `Tooltip`
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/accessibility.mdc` (web focus/hover behavior).
**Tests**: per `.cursor/rules/testing.mdc` (web focus + keyboard coverage as applicable).
**Gate**: `Tooltip` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.7: `EmptyState`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/i18n.mdc`, `.cursor/rules/theme-design.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `EmptyState` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.8: `ErrorState`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/errors-logging.mdc`, `.cursor/rules/i18n.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `ErrorState` tests pass and implementation complies with referenced UI rules.

#### Step 6.2.9: `OfflineState`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/offline-sync.mdc`, `.cursor/rules/i18n.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `OfflineState` tests pass and implementation complies with referenced UI rules.

---

### Step 6.3: Navigation UI building blocks (UI only, build one by one)
**Goal**: Build reusable navigation primitives (not App Router wiring yet).

#### Step 6.3.1: `Header` (generic)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `Header` tests pass and implementation complies with referenced UI rules.

#### Step 6.3.2: `Sidebar` (web)
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (keyboard navigation + focus order).
**Gate**: `Sidebar` tests pass and implementation complies with referenced UI rules.

#### Step 6.3.3: `TabBar` (mobile)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc` (touch targets).
**Gate**: `TabBar` tests pass and implementation complies with referenced UI rules.

#### Step 6.3.4: `Breadcrumbs` (web)
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (focus + keyboard).
**Gate**: `Breadcrumbs` tests pass and implementation complies with referenced UI rules.

---

### Step 6.4: App‑agnostic Layouts (build one by one)
**Goal**: Reusable layouts that screens can wrap without feature knowledge.

#### Step 6.4.1: `MainLayout`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/theme-design.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `MainLayout` tests pass and implementation complies with referenced UI rules.

#### Step 6.4.2: `AuthLayout`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/theme-design.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` and `.cursor/rules/accessibility.mdc`.
**Gate**: `AuthLayout` tests pass and implementation complies with referenced UI rules.

#### Step 6.4.3: `ModalLayout`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (web keyboard + focus behavior).
**Gate**: `ModalLayout` tests pass and implementation complies with referenced UI rules.

---

### Step 6.5: Composition Patterns (build one by one, do once, reuse everywhere)
**Goal**: Reduce duplication by standardizing common UI compositions.

#### Step 6.5.1: `FormField`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/accessibility.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (label + error wiring).
**Gate**: `FormField` tests pass and implementation complies with referenced UI rules.

#### Step 6.5.2: `SearchBar`
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/hooks-utils.mdc` (use `useDebounce` where applicable).
**Tests**: per `.cursor/rules/testing.mdc` (clear/submit interactions; a11y).
**Gate**: `SearchBar` tests pass and implementation complies with referenced UI rules.

#### Step 6.5.3: `FilterBar`
**Implement**: per `.cursor/rules/component-structure.mdc` and `.cursor/rules/platform-ui.mdc`.
**Tests**: per `.cursor/rules/testing.mdc` (toggle/clear interactions; a11y).
**Gate**: `FilterBar` tests pass and implementation complies with referenced UI rules.

#### Step 6.5.4: `ListScaffold`
**Implement**: per `.cursor/rules/component-structure.mdc`, `.cursor/rules/platform-ui.mdc`, `.cursor/rules/performance.mdc` (lists), `.cursor/rules/offline-sync.mdc` (offline states), `.cursor/rules/errors-logging.mdc` (error states).
**Tests**: per `.cursor/rules/testing.mdc` (loading/empty/error/offline states; a11y).
**Gate**: `ListScaffold` tests pass and implementation complies with referenced UI rules.

---

## Completion Criteria
- ✅ All items in this phase implemented and **fully tested** per `.cursor/rules/testing.mdc`
- ✅ **100% test coverage** achieved per `.cursor/rules/testing.mdc`
- ✅ UI implementation complies with the referenced `.mdc` rules (platform UI boundaries, theming, a11y, conventions, and domain ownership)
- ✅ No duplicate "foundation primitives" implemented outside Step 6.1 (reuse only)
- ✅ All components follow platform file structure per `.cursor/rules/component-structure.mdc`
- ✅ All styles use theme tokens exclusively (no hardcoded values per `.cursor/rules/theme-design.mdc`)

**Next Phase**: `P007_app-shell.md`

