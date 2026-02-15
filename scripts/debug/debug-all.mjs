/**
 * Start Expo, Android logcat, and iOS log stream together (all stream to terminal and overwrite debug/*.log).
 * Run: npm run debug:all
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectRoot = path.resolve(__dirname, '..', '..');
const scriptsDebugDir = __dirname;

const scriptEntries = [
  { name: 'Expo', script: 'expo-with-logging.mjs' },
  { name: 'Android', script: 'android-debug-logcat.mjs' },
];

if (process.platform === 'darwin') {
  scriptEntries.push({ name: 'iOS', script: 'ios-debug-logcat.mjs' });
}

const children = new Map();
let shutdownStarted = false;
let exitCode = 0;

function shutdown(signal = 'SIGINT') {
  if (shutdownStarted) return;
  shutdownStarted = true;

  for (const child of children.values()) {
    if (!child.killed) child.kill(signal);
  }

  if (children.size === 0) {
    process.exit(exitCode);
  }
}

function spawnLogger(name, scriptFile) {
  const child = spawn('node', [path.join(scriptsDebugDir, scriptFile)], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false,
    env: { ...process.env },
  });

  children.set(name, child);

  child.on('error', (error) => {
    console.error(`${name} debug process error: ${error.message}`);
    exitCode = 1;
    shutdown('SIGINT');
  });

  child.on('exit', (code) => {
    children.delete(name);

    if (!shutdownStarted && code && code !== 0) {
      exitCode = code;
      shutdown('SIGINT');
      return;
    }

    if (children.size === 0) {
      process.exit(exitCode);
    }
  });
}

scriptEntries.forEach(({ name, script }) => {
  spawnLogger(name, script);
});

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
