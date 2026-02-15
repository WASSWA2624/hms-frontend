/**
 * Development-only: intercept console.log/warn/error on web and send to debug log receiver.
 * Persists to debug/web-debug.log when scripts/debug/web-log-receiver.mjs is running.
 * No-op on native and in production; safe to import from root layout.
 */
const DEFAULT_RECEIVER_URL = 'http://127.0.0.1:9966/log';
const PATCH_FLAG = '__HMS_WEB_DEBUG_LOGGER_PATCHED__';

const LOG_RECEIVER_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEBUG_LOG_URL) ||
  DEFAULT_RECEIVER_URL;

function isWebDev() {
  return (
    typeof __DEV__ !== 'undefined' &&
    __DEV__ &&
    typeof document !== 'undefined' &&
    typeof window !== 'undefined'
  );
}

function formatArg(arg) {
  if (arg instanceof Error) {
    return `${arg.message}\n${arg.stack || ''}`;
  }

  if (typeof arg === 'object') {
    try {
      return JSON.stringify(arg);
    } catch {
      return '[Unserializable Object]';
    }
  }

  return String(arg);
}

function formatArgs(args) {
  return args.map(formatArg).join(' ');
}

function send(level, message) {
  const fetchImpl = globalThis?.fetch;
  if (typeof fetchImpl !== 'function') return;

  try {
    fetchImpl(LOG_RECEIVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}

function patchConsole() {
  if (!isWebDev()) return;
  if (window[PATCH_FLAG]) return;

  window[PATCH_FLAG] = true;

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = function patchedLog(...args) {
    originalLog.apply(console, args);
    send('log', formatArgs(args));
  };

  console.warn = function patchedWarn(...args) {
    originalWarn.apply(console, args);
    send('warn', formatArgs(args));
  };

  console.error = function patchedError(...args) {
    originalError.apply(console, args);
    send('error', formatArgs(args));
  };

  window.addEventListener('error', (event) => {
    send(
      'error',
      `Uncaught: ${event.message}\n${event.filename}:${event.lineno}\n${event.error?.stack || ''}`
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    send('error', `Unhandled rejection: ${event.reason?.message ?? String(event.reason)}`);
  });
}

patchConsole();
