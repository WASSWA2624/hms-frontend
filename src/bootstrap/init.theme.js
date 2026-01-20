/**
 * Theme Initialization
 * File: init.theme.js
 */
import store from '@store';
import { actions } from '@store/slices/ui.slice';
import { async } from '@services/storage';
import { logger } from '@logging';

export async function initTheme() {
  try {
    // Try to load persisted theme preference
    let savedTheme = 'light'; // default
    
    try {
      const persistedTheme = await async.getItem('theme_preference');
      if (persistedTheme && ['light', 'dark', 'high-contrast'].includes(persistedTheme)) {
        savedTheme = persistedTheme;
      }
    } catch (error) {
      // If storage read fails, use default
      logger.debug('Could not load persisted theme, using default', { error: error.message });
    }
    
    // Set theme in store
    store.dispatch(actions.setTheme(savedTheme));
    
    logger.info('Theme initialized successfully', { theme: savedTheme });
  } catch (error) {
    logger.error('Theme initialization failed', { error: error.message });
    // Theme failure is not fatal - use default
  }
}

