# Phase 8: Debug Resources

## Purpose
Implement the debug system defined in `.cursor/rules/debug.mdc`: script-based log capture plus in-app web console forwarding. Dev-only scope.

## Prerequisites
- Phase 7 completed (`src/app/_layout.jsx` exists)
- Phase 0 Step 0.16 completed (`debug/`, `scripts/debug/`, `@debug` alias, debug npm scripts)

## Rule References
- `.cursor/rules/debug.mdc`
- `.cursor/rules/coding-conventions.mdc`
- `.cursor/rules/project-structure.mdc`
- `.cursor/rules/bootstrap-config.mdc`

## Steps (Atomic, Chronological)

### Step 8.1: Create `scripts/debug/expo-with-logging.mjs`
**Goal**: Capture Expo stdout/stderr to terminal and `debug/expo-debug.log` in overwrite mode.

### Step 8.2: Create `scripts/debug/android-debug-logcat.mjs`
**Goal**: Capture Android logcat to `debug/android-debug.log` in overwrite mode.

### Step 8.3: Create `scripts/debug/ios-debug-logcat.mjs`
**Goal**: Capture iOS simulator logs to `debug/ios-debug.log` in overwrite mode.

### Step 8.4: Create `scripts/debug/web-log-receiver.mjs`
**Goal**: Receive web console posts on `127.0.0.1:9966` (or `DEBUG_LOG_PORT`) and write `debug/web-debug.log` in overwrite mode.

### Step 8.5: Create `scripts/debug/debug-all.mjs`
**Goal**: Run expo/android/(macOS ios) debug loggers in parallel with coordinated shutdown.

### Step 8.6: Verify debug npm scripts
**Goal**: Ensure `package.json` has `debug:expo`, `debug:android`, `debug:ios`, `debug:web`, `debug:all`.

### Step 8.7: Create `src/debug/web-console-logger.js`
**Goal**: In dev web only, patch console methods and forward logs/errors/rejections to the web receiver endpoint.

### Step 8.8: Wire web console logger once in root layout
**Goal**: Import `@debug/web-console-logger` exactly once in `src/app/_layout.jsx`.

### Step 8.9: Finalize `debug/README.md` and `.gitkeep`
**Goal**: Keep debug usage documented while ensuring `debug/*.log` stays gitignored.

## Verification
- `npm run debug:expo` writes `debug/expo-debug.log`.
- Platform-specific scripts write their target files without append behavior.
- Web receiver plus web app logging writes `debug/web-debug.log`.
- No debug code executes in production paths.

## Completion Criteria
- All debug scripts exist and run.
- In-app web console forwarding works in dev web.
- Debug folder is documented and safe for git.

**Next Phase**: `P009_app-layouts.md`
