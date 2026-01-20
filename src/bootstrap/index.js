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

// Suppress styled-components false positive warnings in development
// These warnings occur because styled-components v6 with React Native
// incorrectly detects styled components as "dynamically created" when
// they are actually defined at the top level of style files.
// This runs early in the bootstrap process to suppress warnings before components render.
if (typeof __DEV__ !== 'undefined' && __DEV__ && typeof console !== 'undefined') {
  // #region agent log
  fetch('http://127.0.0.1:7249/ingest/0ca3e34c-db2d-4973-878f-b50eb78eba91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C',location:'bootstrap/index.js:17',message:'console.warn override installed',data:{dev:__DEV__,hasConsole:typeof console !== 'undefined'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    // Suppress styled-components dynamic component warnings (false positives)
    if (
      typeof message === 'string' &&
      (message.includes('has been created dynamically') ||
        message.includes('You may see this warning because you\'ve called styled inside another component'))
    ) {
      // #region agent log
      const warnStack = new Error().stack;
      fetch('http://127.0.0.1:7249/ingest/0ca3e34c-db2d-4973-878f-b50eb78eba91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C',location:'bootstrap/index.js:30',message:'styled-components warning intercepted',data:{message,stack:warnStack ? warnStack.split('\n').slice(0,6).join('\n') : null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return; // Suppress this warning
    }
    originalWarn.apply(console, args);
  };
}

/**
 * Bootstrap the application
 * Initializes all global systems in the correct order:
 * 1. Security (protects everything)
 * 2. Store (required by most layers)
 * 3. Theme (required by UI)
 * 4. Offline (depends on store and services)
 */
export async function bootstrapApp() {
  try {
    logger.info('Starting application bootstrap...');
    
    // 1. Security - must initialize first
    await initSecurity();
    
    // 2. Store - required by most layers
    await initStore();
    
    // 3. Theme - required by UI
    await initTheme();
    
    // 4. Offline - depends on store and services
    await initOffline();
    
    logger.info('Application bootstrap completed successfully');
  } catch (error) {
    logger.error('Application bootstrap failed', { error: error.message, stack: error.stack });
    // Fatal errors should be handled by ErrorBoundary
    throw error;
  }
}

