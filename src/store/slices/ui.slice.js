/**
 * UI Slice
 * Global UI state (theme, locale, loading, etc.)
 * File: ui.slice.js
 */
import { createSlice } from '@reduxjs/toolkit';
import { getDeviceLocale } from '@i18n';

const initialState = {
  theme: 'light', // 'light', 'dark', 'high-contrast'
  locale: getDeviceLocale(),
  isLoading: false,
  // Minimal auth state for Phase 0-7 (guards need this)
  // Full auth feature will be implemented in Phase 9
  isAuthenticated: false,
  user: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // Minimal auth reducers for Phase 0-7 (guards need this)
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

const actions = uiSlice.actions;
const reducer = uiSlice.reducer;

export { actions, reducer };
export default { actions, reducer };

