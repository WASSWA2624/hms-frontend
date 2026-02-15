/**
 * Start Expo (Metro) and tee stdout/stderr to debug/expo-debug.log.
 * Overwrites the log file each run. Run: npm run debug:expo
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import net from 'net';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const logDir = path.join(projectRoot, 'debug');
const logPath = path.join(logDir, 'expo-debug.log');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const timestamp = () => new Date().toISOString();

function tee(data, isStderr) {
  const chunk = data.toString();
  const lines = chunk.split(/\r?\n/);

  lines.forEach((line, index) => {
    const isLastLine = index === lines.length - 1;
    const hasTrailingNewline = chunk.endsWith('\n') || chunk.endsWith('\r');
    if (isLastLine && !line && hasTrailingNewline) return;

    const suffix = !isLastLine || hasTrailingNewline ? '\n' : '';
    logStream.write(`[${timestamp()}] ${isStderr ? 'STDERR: ' : ''}${line}${suffix}`);
  });
}

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort, maxAttempts = 20) {
  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = startPort + offset;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortAvailable(port)) return port;
  }
  return startPort;
}

const expoPort = await findAvailablePort(8082);
const child = spawn('npx', ['expo', 'start', '--clear', '--port', String(expoPort)], {
  cwd: projectRoot,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
  env: { ...process.env, FORCE_COLOR: '1' },
});

child.stdout.on('data', (data) => { process.stdout.write(data); tee(data, false); });
child.stderr.on('data', (data) => { process.stderr.write(data); tee(data, true); });

child.on('error', (err) => {
  const msg = `[${timestamp()}] Process error: ${err.message}\n`;
  process.stderr.write(msg);
  logStream.write(msg);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  logStream.write(`[${timestamp()}] Process exited code=${code} signal=${signal}\n`);
  logStream.end();
  process.exit(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
