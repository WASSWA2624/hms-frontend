# Phase 8: Debug Resources

## Purpose
Implement the debug system per `.cursor/rules/debug.mdc`: log capture to disk, debug scripts (ESM), and in-app web console logger. Dev-only; no production impact. Do not redefine rules; follow `debug.mdc`. **Compliance**: `.cursor/rules/index.mdc` is the entry point; do not duplicate rule content here.

## Prerequisites
- Phase 7 completed (app shell; `_layout.jsx` exists)
- P000 Step 0.16 completed (debug folder structure, npm scripts, `@debug` alias)

## Rule References
- `.cursor/rules/debug.mdc`
- `.cursor/rules/coding-conventions.mdc`
- `.cursor/rules/project-structure.mdc`

## Steps (Atomic, Chronological)

### Step 8.1: Implement Debug Scripts (scripts/debug/)
**Goal**: ESM scripts that capture logs to `debug/` at project root.

**Actions**:
1. Create `scripts/debug/expo-with-logging.mjs`: start Expo, tee stdout/stderr to terminal and `debug/expo-debug.log` (overwrite per run).
2. Create `scripts/debug/android-debug-logcat.mjs`: use `adb` logcat, write to `debug/android-debug.log`.
3. Create `scripts/debug/ios-debug-logcat.mjs`: use `xcrun simctl spawn booted log stream` (macOS), write to `debug/ios-debug.log`.
4. Create `scripts/debug/web-log-receiver.mjs`: HTTP server on `127.0.0.1:9966` (or `DEBUG_LOG_PORT`), POST `/log` body `{ level, message }` → write to `debug/web-debug.log` (overwrite on start).
5. Create `scripts/debug/debug-all.mjs`: run expo + android + (on macOS) ios loggers in parallel; Ctrl+C stops all.
6. Each script uses overwrite mode (`'w'`), not append. All scripts Node ESM (`.mjs`, `import`/`export`). Verify `package.json` has `debug:expo`, `debug:android`, `debug:ios`, `debug:web`, `debug:all` per `debug.mdc`.

**Verification**: `npm run debug:expo` runs; `debug/expo-debug.log` created/updated. Other scripts run per platform.

**Rule Reference**: `.cursor/rules/debug.mdc`

---

### Step 8.2: Implement Web Console Logger (src/debug/)
**Goal**: In-app logger that sends web console output to the debug receiver (dev + web only).

**Actions**:
1. Create `src/debug/web-console-logger.js`: run only when `__DEV__ === true` and `typeof document !== 'undefined'`; patch `console.log`, `console.warn`, `console.error`; send to `http://127.0.0.1:9966/log` (or `EXPO_PUBLIC_DEBUG_LOG_URL`); listen for `window.error` and `unhandledrejection`; no side effects when not in dev or not on web.
2. In `src/app/_layout.jsx`, add one import: `import '@debug/web-console-logger'` (top-level, once).
3. Ensure `@debug` resolves to `./src/debug` (Babel alias from P000).

**Verification**: With web receiver running and app in __DEV__ on web, console output appears in `debug/web-debug.log`. No errors on native or in production build.

**Rule Reference**: `.cursor/rules/debug.mdc`, `.cursor/rules/bootstrap-config.mdc`

---

### Step 8.3: Debug README and .gitkeep
**Goal**: Document debug commands; keep `debug/` in repo without committing logs.

**Actions**:
1. Add `debug/README.md`: list log files and npm commands per `debug.mdc`.
2. Ensure `debug/.gitkeep` exists and `.gitignore` includes `debug/*.log`.

**Verification**: `debug/` committed; `debug/*.log` ignored; README clear.

**Rule Reference**: `.cursor/rules/debug.mdc`

---

## Completion Criteria
- All debug scripts in `scripts/debug/` implemented and wired via npm scripts.
- `src/debug/web-console-logger.js` implemented and imported once in `_layout.jsx`.
- `debug/` has README and .gitkeep; log files gitignored.
- No debug code in production critical path.

**Next Phase**: `P009_app-layouts.md`
