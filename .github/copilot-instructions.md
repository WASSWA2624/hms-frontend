# Copilot Instructions for HMS Frontend

## Project Overview
**HMS Frontend** is a React Native (Expo + App Router) multi-tenant hospital management system. Features multi-platform support (Web, iOS, Android), offline-first architecture, i18n, and accessibility-first design. Implementation follows 13-phase dev plan (`dev-plan/`) emphasizing generic patterns first (Phases 0-8), then HMS-specific features (Phases 9-13).

## Architecture Essentials

### Layered Architecture (Strict)
Modify only at your assigned layer; cross-layer imports cause architectural violations:
- **Routing** (`src/app/`) → navigation, route groups, guards only
- **Platform UI** (`src/platform/`) → pure presentation (no business logic)
- **Features** (`src/features/`) → domain logic, isolated modules (no UI imports)
- **State** (`src/store/`) → Redux Toolkit (global state only)
- **Infrastructure** (`src/services/`, `src/offline/`, `src/security/`) → integrations (no UI/Redux)
- **Cross-cutting** (`src/bootstrap/`, `src/errors/`, `src/logging/`, `src/theme/`) → wiring & concerns

**Critical**: Features must NOT import UI; UI must not contain domain logic; services must not depend on UI or Redux.

### Key File Structure Patterns
- **Route Groups**: Use parentheses in `src/app/` (e.g., `(auth)/`, `(main)/`) for logical grouping and code splitting
- **Component Groups**: Use regular folders in `src/platform/` (no parentheses) for UI organization
- **Feature Modules**: Each feature in `src/features/` is self-contained with clear boundaries; no cross-feature imports
- **Barrel Exports**: Use `index.js` in each folder for clean imports and tree-shaking (`export { ... } from './file'`)

## Critical Patterns & Conventions

### 1. Internationalization (i18n) - 100% Mandatory
- **ALL user-facing text** must use i18n
- Import from `src/i18n` and use `useI18n()` hook in components
- Reference: `.cursor/rules/i18n.mdc`

### 2. State Management (Redux Toolkit)
- Global state lives in `src/store/`
- Features create Redux slices using `createSlice()`
- Use `useSelector` and `useDispatch` for component-store binding
- Reference: `.cursor/rules/state-management.mdc`

### 3. Offline-First Architecture
- Critical workflows must work offline; queue operations in `src/offline/`
- Use `useOfflineSync()` hook for sync-aware components
- Reference: `.cursor/rules/offline-sync.mdc`

### 4. Component Organization
- **Platform Primitives** → `src/platform/primitives/` (Button, Input, Card, etc.)
- **UI Patterns** → `src/platform/patterns/` (Forms, Tables, Lists)
- **Layouts** → `src/platform/layouts/` (AppLayout, AuthLayout)
- **Screens** → `src/platform/screens/` (feature-specific screens)
- Each component exports `.jsx` with tests as `.test.jsx`

### 5. Services & API Integration
- Define services in `src/services/` with clear interfaces
- Use dependency injection for testability
- All API calls go through `src/services/api.js` (single entry point)
- Reference: `.cursor/rules/services-integration.mdc`

### 6. Error Handling
- Use error boundary (`src/errors/ErrorBoundary.jsx`) at route level
- Centralized error handler in `src/errors/error.handler.js`
- Never catch and ignore errors silently
- Reference: `.cursor/rules/errors-logging.mdc`

### 7. Testing
- Tests live alongside source files (`component.test.jsx`)
- Minimum coverage: 80% statements, 70% branches
- Use Jest + React Native Testing Library
- Run: `npm run test` or `npm run test:watch`
- Reference: `.cursor/rules/testing.mdc`

## Build & Development Commands

```bash
npm install              # Install dependencies
npm run start           # Start Expo dev server (clears cache)
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run on web browser
npm run test          # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Critical Do's and Don'ts

### ✅ DO
- Follow `.cursor/rules/` — they're single sources of truth
- Use barrel exports (`index.js`) for clean imports
- Keep files under 300 lines; split large components
- Write tests immediately after implementation
- Use absolute imports via `@` aliases (config in `.cursor/rules/coding-conventions.mdc`)
- Reference dev-plan phases for implementation sequence
- Use feature slices with clear module boundaries

### ❌ DON'T
- Copy-paste code; extract to hooks or utils instead
- Import between features directly; use event patterns or shared services
- Add dependencies without reading `dependency-policy.mdc`
- Hardcode strings — always use i18n
- Put business logic in components
- Use class components; prefer hooks
- Skip rule references (`dev-plan/` links to `.cursor/rules/`)

## Entry Points for Common Tasks

| Task | Reference |
|------|-----------|
| Add new feature | `dev-plan/P010_core-features.md` |
| Add new screen/route | `dev-plan/P011_screens-routes.md` + `.cursor/rules/app-router.mdc` |
| Add UI component | `.cursor/rules/component-structure.mdc` + `src/platform/` |
| Setup state for feature | `.cursor/rules/state-management.mdc` + `src/store/` |
| Add service integration | `.cursor/rules/services-integration.mdc` + `src/services/` |
| Handle offline sync | `.cursor/rules/offline-sync.mdc` + `src/offline/` |
| i18n text | `.cursor/rules/i18n.mdc` + update `src/i18n/` locale files |

## Bootstrap & Initialization Order
All global systems initialized in `src/bootstrap/index.js`:
1. Security (`init.security.js`)
2. Redux store (`init.store.js`)
3. Theme (`init.theme.js`)
4. Offline/Network (`init.offline.js`)

**Never wire providers outside bootstrap layer.**

## Rule Hierarchy & Conflict Resolution
If rules conflict, follow this priority:
1. `.cursor/rules/` files (authoritative)
2. `dev-plan/` implementation guides
3. This document (overview only)

When in doubt, check the referenced `.mdc` file or ask for rule clarification.

---

**Last Updated**: January 2026  
**Reference**: All rules available in `.cursor/rules/` folder
