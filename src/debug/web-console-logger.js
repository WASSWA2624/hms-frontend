/**
 * Development-only: intercept console.log/warn/error on web and send to debug log receiver.
 * Persists to debug/web-debug.log when scripts/debug/web-log-receiver.mjs is running.
 * No-op on native and in production; safe to import from root layout.
 */
const DEFAULT_RECEIVER_URL = 'http://127.0.0.1:9966/log';
const PATCH_FLAG = '__HMS_WEB_DEBUG_LOGGER_PATCHED__';
const REDACTED = '[REDACTED]';
const SENSITIVE_KEY_PATTERN =
  /pass(word|code)?|token|secret|api[-_]?key|authori[sz]ation|cookie|session|otp|pin|ssn|nin/i;

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

function sanitizeString(value) {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]')
    .replace(
      /("?(?:pass(?:word|code)?|token|secret|api[-_]?key|authori[sz]ation|cookie|session|otp|pin|ssn|nin)"?\s*[:=]\s*)("[^"]*"|'[^']*'|[^,\s]+)/gi,
      `$1"${REDACTED}"`
    );
}

function sanitizeValue(value, seen = new WeakSet(), depth = 0) {
  if (depth > 5) return '[TRUNCATED]';

  if (typeof value === 'string') return sanitizeString(value);
  if (value instanceof Error) {
    return {
      name: value.name,
      message: sanitizeString(value.message || ''),
      stack: sanitizeString(value.stack || ''),
    };
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, seen, depth + 1));
  }
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return '[CIRCULAR]';
    seen.add(value);

    const sanitized = {};
    Object.entries(value).forEach(([key, fieldValue]) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        sanitized[key] = REDACTED;
        return;
      }
      sanitized[key] = sanitizeValue(fieldValue, seen, depth + 1);
    });

    seen.delete(value);
    return sanitized;
  }

  return value;
}

function formatArg(arg) {
  if (typeof arg === 'object' && arg !== null) {
    const sanitized = sanitizeValue(arg);
    try {
      return JSON.stringify(sanitized);
    } catch {
      return '[Unserializable Object]';
    }
  }

  return String(sanitizeValue(arg));
}

function formatArgs(args) {
  return args.map(formatArg).join(' ');
}

function send(level, message) {
  const fetchImpl = globalThis?.fetch;
  if (typeof fetchImpl !== 'function') return;
  const href =
    typeof window !== 'undefined' && window.location
      ? sanitizeString(window.location.href || '')
      : '';
  const route =
    typeof window !== 'undefined' && window.location
      ? sanitizeString(window.location.pathname || '')
      : '';

  try {
    fetchImpl(LOG_RECEIVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message: sanitizeString(message),
        context: { href, route },
      }),
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
