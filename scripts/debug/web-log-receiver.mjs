/**
 * Dev-only HTTP server: receives browser console logs and writes to debug/web-debug.log.
 * Overwrites the log file when the server starts. Run: npm run debug:web
 */
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.DEBUG_LOG_PORT) || 9966;
const projectRoot = path.resolve(__dirname, '..', '..');
const logDir = path.join(projectRoot, 'debug');
const logPath = path.join(logDir, 'web-debug.log');
const REDACTED = '[REDACTED]';
const SENSITIVE_KEY_PATTERN =
  /pass(word|code)?|token|secret|api[-_]?key|authori[sz]ation|cookie|session|otp|pin|ssn|nin/i;
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const timestamp = () => new Date().toISOString();

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

function normalizeMessage(message) {
  const sanitized = sanitizeValue(message);
  if (typeof sanitized === 'string') return sanitized;
  if (sanitized instanceof Error) return `${sanitized.message}\n${sanitized.stack || ''}`;

  if (typeof sanitized === 'object' && sanitized !== null) {
    try {
      return JSON.stringify(sanitized);
    } catch {
      return '[Unserializable Object]';
    }
  }

  return String(sanitized);
}

const server = http.createServer((req, res) => {
  const requestPath = (req.url || '').split('?')[0];

  if (req.method === 'OPTIONS' && requestPath === '/log') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method === 'POST' && requestPath === '/log') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const level = sanitizeString(String(payload.level || 'log')).toLowerCase();
        const message = normalizeMessage(payload.message);
        const context =
          typeof payload.context === 'undefined'
            ? null
            : normalizeMessage(payload.context);
        const contextSuffix = context ? ` context=${context}` : '';

        logStream.write(
          `[${timestamp()}] [${String(level).toUpperCase()}] ${message}${contextSuffix}\n`
        );
        res.writeHead(204, CORS_HEADERS);
        res.end();
      } catch {
        res.writeHead(400, {
          ...CORS_HEADERS,
          'Content-Type': 'text/plain',
        });
        res.end('Bad request');
      }
    });
    return;
  }

  res.writeHead(404, CORS_HEADERS);
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Web log receiver: http://127.0.0.1:${PORT}/log -> ${logPath}`);
});

let isShuttingDown = false;
function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logStream.write(`--- web log receiver stopping ${timestamp()} signal=${signal} ---\n`);
  server.close(() => {
    logStream.end(() => process.exit(0));
  });

  setTimeout(() => {
    logStream.end(() => process.exit(0));
  }, 1000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
