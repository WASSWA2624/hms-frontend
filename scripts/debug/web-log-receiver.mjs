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

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const timestamp = () => new Date().toISOString();

function normalizeMessage(message) {
  if (typeof message === 'string') return message;
  if (message instanceof Error) return `${message.message}\n${message.stack || ''}`;

  if (typeof message === 'object' && message !== null) {
    try {
      return JSON.stringify(message);
    } catch {
      return '[Unserializable Object]';
    }
  }

  return String(message);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const level = payload.level || 'log';
        const message = normalizeMessage(payload.message);

        logStream.write(`[${timestamp()}] [${String(level).toUpperCase()}] ${message}\n`);
        res.writeHead(204);
        res.end();
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad request');
      }
    });
    return;
  }

  res.writeHead(404);
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
