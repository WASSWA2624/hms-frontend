/**
 * Store Initialization
 * File: init.store.js
 */
import store from '@store';
import { logger } from '@logging';

export async function initStore() {
  try {
    // Store is created synchronously in store/index.js
    // Persistence is handled by redux-persist
    // Hydration happens automatically via PersistGate
    
    // Verify store is accessible
    const state = store.getState();
    if (!state) {
      throw new Error('Store state is undefined');
    }
    
    logger.info('Store initialized successfully');
  } catch (error) {
    logger.error('Store initialization failed', { error: error.message });
    throw error; // Store failure is fatal
  }
}

