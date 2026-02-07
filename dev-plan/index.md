# HMS Frontend Development Plan

## Purpose
Chronological guide for building the React Native (Expo + App Router) HMS application. Each step is atomic, follows `.cursor/rules/` strictly, and aligns with `hms-backend/write-up.md` and `hms-backend/dev-plan/`. Rules are not redefined here; only implementation order and verification are specified.

## Rule compliance
- **Entry point**: `.cursor/rules/index.mdc` is the single entry point and **takes precedence**; all linked rule documents are authoritative.
- **No duplication**: Do not duplicate rule content in the dev-plan; reference rules only.
- **100% compliance**: Every phase and step must comply with the referenced `.cursor/rules/`; verify after each step.

## Principles
- **Atomic**: One step, one deliverable; complete before the next.
- **Chronological**: Execute phases and steps in strict order; do not skip steps or phases.
- **Rule compliance**: Every step references `.cursor/rules/`; do not duplicate rule content.
- **Clear**: Each step has goal, actions, verification, and rule references.

## Development Order (Chronological)

Phases 0–7 are generic building blocks (no app-specific content). Phase 8 is debug resources. From Phase 9 onward, work is app-specific (layouts, features, screens, locales). Phase 14 (Locales) is the last phase.

1. **P000_setup.md** — Project setup, dependencies, folder structure, Babel/Metro/ESLint/Jest, debug folder and npm scripts.
2. **P001_foundation.md** — Config, utils, logging, errors, i18n bootstrap.
3. **P002_infrastructure.md** — Services, security.
4. **P003_state-theme.md** — State (Redux), theme (light/dark only).
5. **P004_offline.md** — Offline-first and bootstrap layer.
6. **P005_reusable-hooks.md** — Reusable hooks (no feature hooks).
7. **P006_platform-ui-foundation.md** — Platform UI primitives and patterns; Microsoft Fluent look and feel for all components (see `theme-design.mdc`).
8. **P007_app-shell.md** — App Router, guards, navigation skeleton.
9. **P008_debug-resources.md** — Debug scripts, `src/debug`, web console logger, npm scripts.
10. **P009_app-layouts.md** — App layouts: all platforms, all screen sizes, Microsoft Fluent look and feel.
11. **P010_core-features.md** — Core HMS features (auth, tenancy, modules).
12. **P011_screens-routes.md** — Screens and routes for core modules. Optional guide: **P011_settings-full-crud-guide.md**.
13. **P012_advanced-features.md** — Advanced/optional modules.
14. **P013_finalization.md** — Finalization (onboarding, help, testing, polish).
15. **P014_locales.md** — All supported locale files and translation completeness (last phase).

## Flow

```
P000 Setup
  → P001 Foundation
  → P002 Infrastructure
  → P003 State & Theme (light/dark only)
  → P004 Offline + Bootstrap
  → P005 Reusable Hooks
  → P006 Platform UI Foundation (Microsoft Fluent)
  → P007 App Shell
  → P008 Debug Resources
  → P009 App Layouts (all platforms, all sizes, Microsoft Fluent)
  → P010 Core Features
  → P011 Screens & Routes
  → P012 Advanced Features
  → P013 Finalization
  → P014 Locales (last phase)
```

## Reproducibility
Following **P000_setup.md** through **P009_app-layouts.md** in **strict chronological order** reproduces the current implementation up to and including app layouts. Complete **every step** in each phase before starting the next phase. No steps or phases may be skipped. Prerequisites and rule references are mandatory. Result: project setup, foundation, infrastructure, state/theme, offline/bootstrap, hooks, platform UI foundation, app shell, debug resources, and app layouts (all platforms, all sizes, Microsoft Fluent). Anyone following this plan in order can reproduce the same codebase.

## How to Use
1. Follow phases and steps in order; complete all steps in a phase before the next.
2. After each implementation step, run tests per `.cursor/rules/testing.mdc`.
3. Verify rule compliance via `.cursor/rules/`; do not redefine rules in the dev-plan.
4. Use `.js` / `.jsx` per `.cursor/rules/coding-conventions.mdc`.
5. All UI text must use i18n per `.cursor/rules/i18n.mdc`; all locale files are completed in P014.
6. Route groups and component grouping: see `.cursor/rules/app-router.mdc` and `.cursor/rules/component-structure.mdc`.

## Rule References
All steps follow `.cursor/rules/`. **Start with** `.cursor/rules/index.mdc` (takes precedence); then use the linked rule documents (e.g. `core-principles.mdc`, `project-structure.mdc`, `tech-stack.mdc`, `theme-design.mdc`, `bootstrap-config.mdc`, `debug.mdc`, `component-structure.mdc`, `app-router.mdc`). Rules are authoritative; do not contradict them in the dev-plan.

**Start with**: `P000_setup.md`
