/**
 * Root Reducer
 * Combines all reducers
 * File: rootReducer.js
 * 
 * Phase 6: Only includes core slices (ui, network).
 * Feature slices will be added in Phase 9.
 */
import { combineReducers } from '@reduxjs/toolkit';
import { reducer as uiReducer } from './slices/ui.slice';
import { reducer as networkReducer } from './slices/network.slice';

const rootReducer = combineReducers({
  ui: uiReducer,
  network: networkReducer,
});

export default rootReducer;
