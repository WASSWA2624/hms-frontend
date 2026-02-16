# HMS Frontend Development Plan

## Purpose
Chronological guide for building the React Native (Expo + App Router) HMS application. Each step is atomic, follows `.cursor/rules/` strictly, and aligns with `write-up.md` and `hms-backend/dev-plan/`.

## Rule compliance
- **Entry point**: `.cursor/rules/index.mdc` is the single entry point and takes precedence.
- **No duplication**: Do not duplicate rule content in the dev-plan.
- **100% compliance**: Every phase and step must comply with linked rule documents.

## Principles
- **Atomic**: One step, one deliverable.
- **Chronological**: Execute phases and steps in strict order.
- **Rule-first**: Rules are authoritative; the dev-plan defines order and verification only.
- **Clear verification**: Each step must include implementation and verification outcomes.

## Atomic Execution Contract
- Every `Step X.Y` is mandatory and executed in order.
- A step may include ordered actions, but it must produce exactly one primary deliverable.
- If a step would produce multiple independent deliverables, split it into additional numbered steps.
- Do not mark roadmap steps as "optional"; defer non-required scope to a later phase file.

## Backend Alignment Contract
- Frontend Phase 10 module order must remain 1:1 with mounted backend modules in `hms-backend/src/app/router.js` (and `hms-backend/dev-plan/P011_modules.mdc` where synchronized).
- Frontend Phase 10 must include backend Module Group 15A (Biomedical Engineering & Medical Equipment Suite) in chronological order before Group 16.
- Frontend routes/screens in Phase 11 must map to implemented backend modules/endpoints in `hms-backend/dev-plan/P010_api_endpoints.mdc`.
- Advanced realtime-driven UX in Phase 12 must map to backend WS scope in `hms-backend/dev-plan/P013_ws_features.mdc`.
- Locale rollout in Phase 14 must stay compatible with backend locale expansion in `hms-backend/dev-plan/P014_locales.mdc`.
- Final readiness checks in Phase 13 must validate backend readiness assumptions from `hms-backend/dev-plan/P008_perf.mdc`.

## Development Order (Chronological)

Phases 0-7 are generic building blocks. Phase 8 is debug resources. From Phase 9 onward, work is app-specific (layouts, features, screens, locales). Phase 14 (Locales) is the last phase.

1. **P000_setup.md** - Project setup, dependencies, folder structure, Babel/Metro/ESLint/Jest, debug folder and npm scripts.
2. **P001_foundation.md** - Config, utils, logging, errors, i18n bootstrap.
3. **P002_infrastructure.md** - Services and security.
4. **P003_state-theme.md** - State (Redux), theme (light/dark only).
5. **P004_offline.md** - Offline-first and bootstrap layer.
6. **P005_reusable-hooks.md** - Reusable hooks (no feature hooks).
7. **P006_platform-ui-foundation.md** - Platform UI primitives/patterns.
8. **P007_app-shell.md** - App Router, guards, navigation skeleton.
9. **P008_debug-resources.md** - Debug scripts, `src/debug`, web console logger, npm scripts.
10. **P009_app-layouts.md** - App layouts across platforms and screen sizes.
11. **P010_core-features.md** - Core HMS features (auth, tenancy, modules).
12. **P011_screens-routes.md** - Screens/routes for core modules and onboarding.
13. **P012_advanced-features.md** - Advanced/optional modules.
14. **P013_finalization.md** - Finalization (onboarding, help, testing, polish).
15. **P014_locales.md** - Locale files and translation completeness (last phase).

## Current Implementation Snapshot (2026-02-15)

- Foundations, infrastructure, app shell, and layouts (P000-P009) are in place.
- P011 route progress:
  - Completed: `11.1.1`, `11.1.2`, `11.2.1`, `11.2.4`, `11.2.8`, and `11.3.1-11.3.22`.
  - Next onboarding/auth step: `11.1.3` (`(auth)/resume-link-sent`).
- Remaining module screens (tiers 4+) are still pending.

## Flow

```text
P000 Setup
  -> P001 Foundation
  -> P002 Infrastructure
  -> P003 State & Theme
  -> P004 Offline + Bootstrap
  -> P005 Reusable Hooks
  -> P006 Platform UI Foundation
  -> P007 App Shell
  -> P008 Debug Resources
  -> P009 App Layouts
  -> P010 Core Features
  -> P011 Screens & Routes
  -> P012 Advanced Features
  -> P013 Finalization
  -> P014 Locales (last phase)
```

## Reproducibility
Following **P000_setup.md** through **P009_app-layouts.md** in strict chronological order reproduces the current shared foundation. The current repository additionally includes partial implementation of **P010/P011** (auth/onboarding entry and full settings route set).

## How to Use
1. Follow phases and steps in order.
2. After each step, run tests per `.cursor/rules/testing.mdc`.
3. Verify compliance against `.cursor/rules/index.mdc` and linked rules.
4. Use `.js` / `.jsx` per `.cursor/rules/coding-conventions.mdc`.
5. Use i18n keys for all UI text per `.cursor/rules/i18n.mdc`.

## Rule References
All steps follow `.cursor/rules/`. Start with `.cursor/rules/index.mdc`, then apply linked rule files such as `core-principles.mdc`, `project-structure.mdc`, `tech-stack.mdc`, `theme-design.mdc`, `bootstrap-config.mdc`, `debug.mdc`, `component-structure.mdc`, and `app-router.mdc`.

**Start with**: `P000_setup.md`
