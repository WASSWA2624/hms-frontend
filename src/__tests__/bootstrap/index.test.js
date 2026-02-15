/**
 * Bootstrap Tests
 * File: index.test.js
 */
import { __unsafeResetForTests, bootstrapApp } from '@bootstrap';
import { initSecurity } from '@bootstrap/init.security';
import { initStore } from '@bootstrap/init.store';
import { initTheme } from '@bootstrap/init.theme';
import { initOffline } from '@bootstrap/init.offline';
import { logger } from '@logging';

jest.mock('@bootstrap/init.security');
jest.mock('@bootstrap/init.store');
jest.mock('@bootstrap/init.theme');
jest.mock('@bootstrap/init.offline');
jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __unsafeResetForTests();
    initSecurity.mockResolvedValue(undefined);
    initStore.mockResolvedValue(undefined);
    initTheme.mockResolvedValue(undefined);
    initOffline.mockResolvedValue(undefined);
  });

  describe('bootstrapApp', () => {
    it('calls init modules in mandatory order: security -> store -> theme -> offline', async () => {
      await bootstrapApp();

      expect(initSecurity).toHaveBeenCalledTimes(1);
      expect(initStore).toHaveBeenCalledTimes(1);
      expect(initTheme).toHaveBeenCalledTimes(1);
      expect(initOffline).toHaveBeenCalledTimes(1);

      const securityCallOrder = initSecurity.mock.invocationCallOrder[0];
      const storeCallOrder = initStore.mock.invocationCallOrder[0];
      const themeCallOrder = initTheme.mock.invocationCallOrder[0];
      const offlineCallOrder = initOffline.mock.invocationCallOrder[0];

      expect(securityCallOrder).toBeLessThan(storeCallOrder);
      expect(storeCallOrder).toBeLessThan(themeCallOrder);
      expect(themeCallOrder).toBeLessThan(offlineCallOrder);
    });

    it('is idempotent when called multiple times after success', async () => {
      await bootstrapApp();
      await bootstrapApp();
      await bootstrapApp();

      expect(initSecurity).toHaveBeenCalledTimes(1);
      expect(initStore).toHaveBeenCalledTimes(1);
      expect(initTheme).toHaveBeenCalledTimes(1);
      expect(initOffline).toHaveBeenCalledTimes(1);
    });

    it('returns the same in-flight promise across concurrent calls', async () => {
      let resolveSecurity;
      const securityPromise = new Promise((resolve) => {
        resolveSecurity = resolve;
      });
      initSecurity.mockReturnValue(securityPromise);

      const first = bootstrapApp();
      const second = bootstrapApp();

      expect(initSecurity).toHaveBeenCalledTimes(1);

      resolveSecurity();
      await expect(Promise.all([first, second])).resolves.toEqual([
        undefined,
        undefined,
      ]);
    });

    it('logs success when all init modules succeed', async () => {
      await bootstrapApp();

      expect(logger.info).toHaveBeenCalledWith('Starting application bootstrap...');
      expect(logger.info).toHaveBeenCalledWith('Application bootstrap completed successfully');
    });

    it('logs and rethrows fatal bootstrap errors', async () => {
      const storeError = new Error('Store initialization failed');
      initStore.mockRejectedValue(storeError);

      await expect(bootstrapApp()).rejects.toThrow('Store initialization failed');

      expect(initSecurity).toHaveBeenCalled();
      expect(initStore).toHaveBeenCalled();
      expect(initTheme).not.toHaveBeenCalled();
      expect(initOffline).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(
        'Application bootstrap failed',
        expect.objectContaining({
          error: 'Store initialization failed',
        })
      );
    });

    it('allows retry after a failed bootstrap attempt', async () => {
      initSecurity
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce(undefined);

      await expect(bootstrapApp()).rejects.toThrow('Temporary failure');
      await expect(bootstrapApp()).resolves.toBeUndefined();

      expect(initSecurity).toHaveBeenCalledTimes(2);
      expect(initStore).toHaveBeenCalledTimes(1);
      expect(initTheme).toHaveBeenCalledTimes(1);
      expect(initOffline).toHaveBeenCalledTimes(1);
    });

    it('awaits all async init modules in sequence', async () => {
      let resolveSecurity;
      let resolveStore;
      let resolveTheme;
      let resolveOffline;

      const securityPromise = new Promise((resolve) => {
        resolveSecurity = resolve;
      });
      const storePromise = new Promise((resolve) => {
        resolveStore = resolve;
      });
      const themePromise = new Promise((resolve) => {
        resolveTheme = resolve;
      });
      const offlinePromise = new Promise((resolve) => {
        resolveOffline = resolve;
      });

      initSecurity.mockReturnValue(securityPromise);
      initStore.mockReturnValue(storePromise);
      initTheme.mockReturnValue(themePromise);
      initOffline.mockReturnValue(offlinePromise);

      const bootstrapPromise = bootstrapApp();

      expect(initSecurity).toHaveBeenCalledTimes(1);

      resolveSecurity();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(initStore).toHaveBeenCalledTimes(1);

      resolveStore();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(initTheme).toHaveBeenCalledTimes(1);

      resolveTheme();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(initOffline).toHaveBeenCalledTimes(1);

      resolveOffline();
      await bootstrapPromise;

      expect(logger.info).toHaveBeenCalledWith('Application bootstrap completed successfully');
    });
  });
});
