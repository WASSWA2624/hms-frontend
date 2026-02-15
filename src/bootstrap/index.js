/**
 * Bootstrap Entry Point
 * Single entry for app initialization
 * File: index.js
 */
import { initSecurity } from './init.security';
import { initStore } from './init.store';
import { initTheme } from './init.theme';
import { initOffline } from './init.offline';
import { logger } from '@logging';

let bootstrapPromise = null;
let hasBootstrapped = false;

const runBootstrap = async () => {
  try {
    logger.info('Starting application bootstrap...');

    // Mandatory bootstrap order from bootstrap-config.mdc
    await initSecurity();
    await initStore();
    await initTheme();
    await initOffline();

    logger.info('Application bootstrap completed successfully');
  } catch (error) {
    logger.error('Application bootstrap failed', {
      error: error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

/**
 * Bootstrap the application
 * Initializes all global systems in the correct order:
 * 1. Security (protects everything)
 * 2. Store (required by most layers)
 * 3. Theme (required by UI)
 * 4. Offline (depends on store and services)
 */
export async function bootstrapApp() {
  if (hasBootstrapped) return;

  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap()
      .then(() => {
        hasBootstrapped = true;
      })
      .catch((error) => {
        bootstrapPromise = null;
        throw error;
      });
  }

  return bootstrapPromise;
}

/**
 * Testing-only reset helper.
 * @private
 */
export const __unsafeResetForTests = () => {
  hasBootstrapped = false;
  bootstrapPromise = null;
};

