import '@testing-library/jest-native/extend-expect';

describe('web-console-logger', () => {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    jest.resetModules();

    if (typeof window !== 'undefined') {
      delete window.__HMS_WEB_DEBUG_LOGGER_PATCHED__;
    }

    Object.defineProperty(globalThis, '__DEV__', {
      configurable: true,
      writable: true,
      value: true,
    });

    globalThis.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    delete globalThis.fetch;
  });

  test('does nothing when not in development mode', () => {
    globalThis.__DEV__ = false;
    const before = console.log;

    jest.isolateModules(() => {
      require('@debug/web-console-logger');
    });

    expect(console.log).toBe(before);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test('patches console methods and forwards logs in dev web', () => {
    jest.isolateModules(() => {
      require('@debug/web-console-logger');
    });

    console.log('hello', { code: 42 });
    console.warn('warn-message');
    console.error(new Error('boom'));

    expect(globalThis.fetch).toHaveBeenCalledTimes(3);

    const logPayload = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    const warnPayload = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const errorPayload = JSON.parse(globalThis.fetch.mock.calls[2][1].body);

    expect(logPayload).toMatchObject({ level: 'log' });
    expect(logPayload.message).toContain('hello');
    expect(logPayload.message).toContain('"code":42');

    expect(warnPayload).toMatchObject({ level: 'warn', message: 'warn-message' });
    expect(errorPayload).toMatchObject({ level: 'error' });
    expect(errorPayload.message).toContain('boom');
  });

  test('forwards uncaught errors and unhandled rejections', () => {
    jest.isolateModules(() => {
      require('@debug/web-console-logger');
    });

    const errorEvent = new Event('error');
    Object.defineProperty(errorEvent, 'message', { value: 'uncaught-failure' });
    Object.defineProperty(errorEvent, 'filename', { value: 'screen.js' });
    Object.defineProperty(errorEvent, 'lineno', { value: 22 });
    Object.defineProperty(errorEvent, 'error', { value: new Error('uncaught-failure') });
    window.dispatchEvent(errorEvent);

    const rejectionEvent = new Event('unhandledrejection');
    Object.defineProperty(rejectionEvent, 'reason', { value: new Error('promise-failure') });
    window.dispatchEvent(rejectionEvent);

    const payloads = globalThis.fetch.mock.calls.map((call) => JSON.parse(call[1].body));
    const errorMessages = payloads
      .filter((payload) => payload.level === 'error')
      .map((payload) => payload.message);

    expect(errorMessages.some((message) => message.includes('uncaught-failure'))).toBe(true);
    expect(errorMessages.some((message) => message.includes('promise-failure'))).toBe(true);
  });

  test('does not patch multiple times when module is reloaded', () => {
    jest.isolateModules(() => {
      require('@debug/web-console-logger');
    });
    const firstPatchedLog = console.log;

    jest.resetModules();
    jest.isolateModules(() => {
      require('@debug/web-console-logger');
    });

    expect(console.log).toBe(firstPatchedLog);
  });
});
