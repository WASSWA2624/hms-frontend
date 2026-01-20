/**
 * Offline Initialization
 * File: init.offline.js
 */
import { networkListener, syncManager, hydration } from '@offline';
import { logger } from '@logging';
import store from '@store';
import { actions } from '@store/slices/network.slice';

export async function initOffline() {
  try {
    // Register network listeners
    networkListener.startListening();
    
    // Subscribe to network changes and update Redux store
    networkListener.subscribe((isOnline) => {
      store.dispatch(actions.setOnline(isOnline));
    });
    
    // Initialize current network status in store
    const currentStatus = await networkListener.checkConnectivity();
    store.dispatch(actions.setOnline(currentStatus));
    
    // Initialize request queue
    // Queue is initialized lazily when first request is queued
    
    // Trigger state hydration
    await hydration.hydrate();
    
    // Start sync manager (will sync when online)
    syncManager.startSync();
    
    logger.info('Offline system initialized successfully');
  } catch (error) {
    logger.error('Offline initialization failed', { error: error.message });
    // Offline failure is not fatal - app can continue without offline support
  }
}

