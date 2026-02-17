const fs = require('fs');
const path = require('path');

describe('Phase 8 debug resources', () => {
  const projectRoot = process.cwd();
  const scriptsDir = path.join(projectRoot, 'scripts', 'debug');
  const debugDir = path.join(projectRoot, 'debug');
  const rootLayoutPath = path.join(projectRoot, 'src', 'app', '_layout.jsx');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const gitignorePath = path.join(projectRoot, '.gitignore');

  const requiredScriptFiles = [
    'expo-with-logging.mjs',
    'android-debug-logcat.mjs',
    'ios-debug-logcat.mjs',
    'web-log-receiver.mjs',
    'debug-all.mjs',
  ];

  test('contains required debug script files', () => {
    requiredScriptFiles.forEach((fileName) => {
      expect(fs.existsSync(path.join(scriptsDir, fileName))).toBe(true);
    });
  });

  test('uses overwrite mode for generated debug logs', () => {
    const scriptsWithLogFiles = [
      'expo-with-logging.mjs',
      'android-debug-logcat.mjs',
      'ios-debug-logcat.mjs',
      'web-log-receiver.mjs',
    ];

    scriptsWithLogFiles.forEach((fileName) => {
      const content = fs.readFileSync(path.join(scriptsDir, fileName), 'utf8');
      expect(content).toMatch(/createWriteStream\(logPath,\s*\{\s*flags:\s*'w'\s*\}\)/);
    });
  });

  test('web log receiver uses localhost default + configurable port + CORS preflight', () => {
    const receiverContent = fs.readFileSync(
      path.join(scriptsDir, 'web-log-receiver.mjs'),
      'utf8'
    );

    expect(receiverContent).toMatch(/DEBUG_LOG_PORT/);
    expect(receiverContent).toMatch(/127\.0\.0\.1/);
    expect(receiverContent).toMatch(/Access-Control-Allow-Origin/);
    expect(receiverContent).toMatch(/OPTIONS/);
    expect(receiverContent).toMatch(/\/log/);
  });

  test('android logger resolves adb from SDK paths or PATH fallback', () => {
    const androidLoggerContent = fs.readFileSync(
      path.join(scriptsDir, 'android-debug-logcat.mjs'),
      'utf8'
    );

    expect(androidLoggerContent).toMatch(/ANDROID_HOME/);
    expect(androidLoggerContent).toMatch(/ANDROID_SDK_ROOT/);
    expect(androidLoggerContent).toMatch(/return isWin \? 'adb\.exe' : 'adb';/);
  });

  test('debug-all wires expo + android and conditional ios process', () => {
    const content = fs.readFileSync(path.join(scriptsDir, 'debug-all.mjs'), 'utf8');

    expect(content).toMatch(/expo-with-logging\.mjs/);
    expect(content).toMatch(/android-debug-logcat\.mjs/);
    expect(content).toMatch(/process\.platform === 'darwin'/);
    expect(content).toMatch(/ios-debug-logcat\.mjs/);
  });

  test('package.json exposes required debug npm scripts', () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};

    expect(scripts['debug:expo']).toBe('node scripts/debug/expo-with-logging.mjs');
    expect(scripts['debug:android']).toBe('node scripts/debug/android-debug-logcat.mjs');
    expect(scripts['debug:ios']).toBe('node scripts/debug/ios-debug-logcat.mjs');
    expect(scripts['debug:web']).toBe('node scripts/debug/web-log-receiver.mjs');
    expect(scripts['debug:all']).toBe('node scripts/debug/debug-all.mjs');
  });

  test('imports web console logger exactly once in root layout', () => {
    const rootLayoutContent = fs.readFileSync(rootLayoutPath, 'utf8');
    const importMatches = rootLayoutContent.match(
      /import\s+['"]@debug\/web-console-logger['"];?/g
    );

    expect(importMatches).toHaveLength(1);
  });

  test('maintains debug docs/artifacts and keeps logs gitignored', () => {
    expect(fs.existsSync(path.join(debugDir, 'README.md'))).toBe(true);
    expect(fs.existsSync(path.join(debugDir, '.gitkeep'))).toBe(true);

    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    expect(gitignoreContent).toMatch(/debug\/\*\.log/);
  });
});
