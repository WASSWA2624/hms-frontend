# HMS Frontend Development Plan

## Purpose
Chronological execution contract for building and hardening the React Native (Expo + App Router) HMS frontend. This plan is atomic, rule-first, and synchronized with `write-up.md`, backend module/endpoint inventory, and `.cursor/rules/`.

## Rule Compliance
- Entry point: `.cursor/rules/index.mdc`.
- Owner precedence: follow owner files referenced by `index.mdc`; do not override owner policy in `dev-plan/`.
- Enforcement: every phase step must include implementation + verification gates that satisfy `testing.mdc`, `security.mdc`, and architecture boundary owners.

## Write-up Coverage Matrix (2026-02-17 Review)
- Sections `0-5` (governance, architecture, tenancy, offline, adaptability): `P000` through `P007`.
- Sections `6-7` (functional groups + workflow contracts): `P010`, `P011`, `P012`.
- Sections `8` and `14.4` (UX/a11y/responsive/offline UX): `P006`, `P009`, `P011`, `P013`.
- Sections `9-11` (modules/commercial/growth): `P010`, `P011`, `P012`, `P013`.
- Sections `12-13` (interop, security, compliance): `P001`, `P002`, `P010`, `P011`, `P012`, `P013`.
- Sections `14-15` (NFRs, quality gates): `P004`, `P008`, `P009`, `P013`, `P014`.
- Sections `16-22` (DoD, readiness, KPI, backlog): `P013` and `P014` release gates.

## Atomic Execution Contract
- Every `Step X.Y` is mandatory and must be executed in sequence.
- One step produces one primary deliverable; split steps when scope exceeds one atomic outcome.
- No step is optional if it is required for write-up, backend parity, or rule compliance.

## Backend Alignment Contract
- Modules source of truth: `hms-backend/src/app/router.js` and `hms-backend/dev-plan/P011_modules.mdc`.
- Endpoints source of truth: `hms-backend/dev-plan/P010_api_endpoints.mdc` (sections `0-28`, including action endpoints).
- Realtime source of truth: `hms-backend/dev-plan/P013_ws_features.mdc`.
- Locale source of truth: `hms-backend/dev-plan/P014_locales.mdc`.
- Performance/release baseline: `hms-backend/dev-plan/P008_perf.mdc`.

## Development Order (Chronological)
1. **P000_setup.md** - Setup, dependencies, structure, tooling.
2. **P001_foundation.md** - Config, utils, logging, errors, i18n bootstrap.
3. **P002_infrastructure.md** - Services + security.
4. **P003_state-theme.md** - Redux + light/dark theme system.
5. **P004_offline.md** - Offline queue/sync + bootstrap integration.
6. **P005_reusable-hooks.md** - Cross-cutting semantic hooks.
7. **P006_platform-ui-foundation.md** - Reusable platform UI primitives/patterns.
8. **P007_app-shell.md** - Router groups, guards, shell wiring.
9. **P008_debug-resources.md** - Debug scripts and dev logging resources.
10. **P009_app-layouts.md** - App-level layouts and shell UX.
11. **P010_core-features.md** - 160 backend module feature contracts.
12. **P011_screens-routes.md** - Route + screen wiring for module workflows.
13. **P012_advanced-features.md** - Advanced/realtime/commercial/growth/adaptability slices.
14. **P013_finalization.md** - Hardening, release gates, parity sign-off.
15. **P014_locales.md** - Locale expansion and parity lock (last phase).

## Current Implementation Snapshot (2026-02-17)
- Backend modules in `hms-backend/src/modules`: **160**.
- Frontend feature modules in `hms-frontend/src/features`: **160**.
- Feature-module parity: **matched** (no missing frontend module).
- Frontend routes under `src/app`: **734** files.
- Placeholder catch-all routes (`[...missing].jsx`): **22** (must be retired in `P013` hardening).
- Planned Phase 11 route steps with on-disk route entry files: **207/207**.

## Flow
```text
P000 -> P001 -> P002 -> P003 -> P004 -> P005 -> P006 -> P007 -> P008 -> P009 -> P010 -> P011 -> P012 -> P013 -> P014
```

## Reproducibility
- Running phases `P000` through `P009` reproduces shared architecture and shell foundations.
- Phases `P010` and `P011` map module and route coverage directly to backend inventory.
- Phases `P012` through `P014` close advanced scope, release gates, and locale completeness.

## How to Use
1. Execute files in order; do not skip phases.
2. Execute steps in-order inside each phase.
3. Run tests after each atomic step per `.cursor/rules/testing.mdc`.
4. Validate rule-owner compliance through `.cursor/rules/index.mdc`.
5. Validate backend parity gates before closing each phase.

## Rule References
All rules under `.cursor/rules/` apply. Start at `.cursor/rules/index.mdc`, then follow owner files by area (architecture, routing, UI, state, services, hooks, offline, security, i18n, accessibility, performance, errors, debug, bootstrap, testing).

**Start with**: `P000_setup.md`
