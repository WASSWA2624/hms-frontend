/**
 * Memoized Selectors
 * File: index.js
 * 
 * Phase 0-7: Only UI and Network selectors are included.
 * Feature selectors will be added in Phase 9.
 */
import { createSelector } from '@reduxjs/toolkit';

// UI Selectors
const selectUI = (state) => state.ui;
const selectTheme = createSelector([selectUI], (ui) => ui.theme);
const selectLocale = createSelector([selectUI], (ui) => ui.locale);
const selectIsLoading = createSelector([selectUI], (ui) => ui.isLoading);

// Minimal Auth Selectors (Phase 0-7 - for guards)
// These read from UI slice until full auth feature is implemented in Phase 9
const selectIsAuthenticated = createSelector([selectUI], (ui) => ui.isAuthenticated);
const selectUser = createSelector([selectUI], (ui) => ui.user);

// Network Selectors
const selectNetwork = (state) => state.network;
const selectIsOnline = createSelector([selectNetwork], (network) => network.isOnline);
const selectIsOffline = createSelector([selectIsOnline], (isOnline) => !isOnline);
const selectIsSyncing = createSelector([selectNetwork], (network) => network.isSyncing);

export {
  // UI
  selectTheme,
  selectLocale,
  selectIsLoading,
  // Auth (minimal - Phase 0-7)
  selectIsAuthenticated,
  selectUser,
  // Network
  selectIsOnline,
  selectIsOffline,
  selectIsSyncing,
};

export default {
  // UI
  selectTheme,
  selectLocale,
  selectIsLoading,
  // Auth (minimal - Phase 0-7)
  selectIsAuthenticated,
  selectUser,
  // Network
  selectIsOnline,
  selectIsOffline,
  selectIsSyncing,
};
