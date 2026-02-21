# Phase 3: State Management & Theme System

## Purpose
Build Redux store and theme system. Follows rules in `.cursor/rules/`. **Compliance**: `.cursor/rules/index.mdc` is the entry point; do not duplicate rule content here.

## Rule References
- `.cursor/rules/index.mdc`
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/theme-design.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/testing.mdc`

## Write-up Coverage
- `write-up.md` section `5.2` (frontend architecture contract and module orchestration support).
- `write-up.md` sections `8.3`, `8.5`, and `8.6` (a11y, i18n readiness, UI consistency).
- `write-up.md` sections `13.1` and `13.2` (access-control-safe state handling and protection of sensitive values).
- `write-up.md` section `14.2` (performance-ready state/theme patterns).

## Backend Alignment Gate
- Persist only non-sensitive metadata required for backend session/tenant continuity.
- Store state shape must support tenant/facility/branch-scoped UX decisions without holding raw tokens.
- Theme and locale settings must stay interoperable with backend-driven user profile/session metadata.

## Prerequisites
- Phase 2 completed
- Phase 1 completed (i18n and `getDeviceLocale` from `@i18n` are used by the UI slice)
- Services available
- Security layer available

## Atomic and Chronology Contract (Mandatory)
- Execute steps strictly in listed order; do not skip ahead.
- One step equals one primary deliverable; if a step lists multiple items, execute them as sequential atomic sub-units within that step.
- Complete implementation, tests, backend-alignment checks, and rule-compliance checks for the current step before starting the next step.
- Do not pull work from later phases into the current phase unless explicitly declared as a prerequisite gate.

## Steps

### Step 3.1: Create Color Tokens
**Goal**: Create color design tokens

**Actions**:
1. Create `src/theme/tokens/colors.js`:
   ```javascript
   /**
    * Color Tokens
    * Semantic color definitions
    */
   
   export default {
     primary: '#007AFF',
     onPrimary: '#FFFFFF',
     secondary: '#5856D6',
     success: '#34C759',
     warning: '#FF9500',
     error: '#FF3B30',
     background: {
       primary: '#FFFFFF',
       secondary: '#F2F2F7',
       tertiary: '#E5E5EA',
     },
     text: {
       primary: '#000000',
       secondary: '#3C3C43',
       tertiary: '#8E8E93',
     },
     // Convenience semantic aliases used throughout UI (avoid hardcoding in components)
     textPrimary: '#000000',
     textSecondary: '#3C3C43',
   };
   ```

**Tests**: Create `src/__tests__/theme/tokens/colors.test.js`
- Test all color tokens are exported
- Test color token structure

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.2: Create Spacing Tokens
**Goal**: Create spacing design tokens

**Actions**:
1. Create `src/theme/tokens/spacing.js`:
   ```javascript
   /**
    * Spacing Tokens
    */
   
   export default {
     xs: 4,
     sm: 8,
     md: 16,
     lg: 24,
     xl: 32,
     xxl: 48,
   };
   ```

**Tests**: Create `src/__tests__/theme/tokens/spacing.test.js`
- Test all spacing tokens are exported
- Test spacing token values

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.3: Create Typography Tokens
**Goal**: Create typography design tokens

**Actions**:
1. Create `src/theme/tokens/typography.js`:
   ```javascript
   /**
    * Typography Tokens
    */
   
   export default {
     fontFamily: {
       regular: 'System',
       bold: 'System',
     },
     fontSize: {
       xs: 12,
       sm: 14,
       md: 16,
       lg: 18,
       xl: 20,
       xxl: 24,
     },
     lineHeight: {
       tight: 1.2,
       normal: 1.5,
       relaxed: 1.8,
     },
   };
   ```

**Tests**: Create `src/__tests__/theme/tokens/typography.test.js`
- Test all typography tokens are exported
- Test typography token structure

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.4: Create Border Radius Tokens
**Goal**: Create border radius design tokens

**Actions**:
1. Create `src/theme/tokens/radius.js`:
   ```javascript
   /**
    * Border Radius Tokens
    */
   
   export default {
     sm: 4,
     md: 8,
     lg: 12,
     xl: 16,
     full: 9999,
   };
   ```

**Tests**: Create `src/__tests__/theme/tokens/radius.test.js`
- Test all radius tokens are exported
- Test radius token values

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.5: Create Shadow Tokens
**Goal**: Create shadow design tokens

**Actions**:
1. Create `src/theme/tokens/shadows.js`:
   ```javascript
   /**
    * Shadow Tokens
    */
   
   export default {
     sm: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 1 },
       shadowOpacity: 0.1,
       shadowRadius: 2,
       elevation: 2,
     },
     md: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.15,
       shadowRadius: 4,
       elevation: 4,
     },
   };
   ```

**Tests**: Create `src/__tests__/theme/tokens/shadows.test.js`
- Test all shadow tokens are exported
- Test shadow token structure

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.6: Create Light Theme
**Goal**: Create light theme definition

**Actions**:
1. Create `src/theme/light.theme.js`:
   ```javascript
   /**
    * Light Theme
    */
   import colors from './tokens/colors';
   import spacing from './tokens/spacing';
   import typography from './tokens/typography';
   import radius from './tokens/radius';
   import shadows from './tokens/shadows';
   
   export default {
     colors,
     spacing,
     typography,
     radius,
     shadows,
     mode: 'light',
   };
   ```

**Tests**: Create `src/__tests__/theme/light.theme.test.js`
- Test light theme structure
- Test all token imports

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.7: Create Dark Theme
**Goal**: Create dark theme definition

**Actions**:
1. Create `src/theme/dark.theme.js`:
   ```javascript
   /**
    * Dark Theme
    */
   import colors from './tokens/colors';
   import spacing from './tokens/spacing';
   import typography from './tokens/typography';
   import radius from './tokens/radius';
   import shadows from './tokens/shadows';
   
   // Override colors for dark mode (include semantic aliases used by FallbackUI and other components)
   const darkColors = {
     ...colors,
     background: {
       primary: '#000000',
       secondary: '#1C1C1E',
       tertiary: '#2C2C2E',
     },
     text: {
       primary: '#FFFFFF',
       secondary: '#EBEBF5',
       tertiary: '#8E8E93',
     },
     textPrimary: '#FFFFFF',
     textSecondary: '#EBEBF5',
   };
   
   export default {
     colors: darkColors,
     spacing,
     typography,
     radius,
     shadows,
     mode: 'dark',
   };
   ```

**Tests**: Create `src/__tests__/theme/dark.theme.test.js`
- Test dark theme structure
- Test color overrides
- Test all token imports

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.8: Create Responsive Breakpoints
**Goal**: Create responsive breakpoint definitions

**Actions**:
1. Create `src/theme/breakpoints.js`:
   ```javascript
   /**
    * Responsive Breakpoints
    * Per write-up: Mobile (320px+), Tablet (768px+), Desktop (1024px+), Large (1440px+)
    */
   
   export default {
     mobile: 320,
     tablet: 768,
     desktop: 1024,
     large: 1440,
   };
   ```

**Tests**: Create `src/__tests__/theme/breakpoints.test.js`
- Test all breakpoints are exported
- Test breakpoint values match requirements (320px, 768px, 1024px, 1440px)

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.9: Create Animation Tokens
**Goal**: Create animation token definitions

**Actions**:
1. Create `src/theme/animations.js`:
   ```javascript
   /**
    * Animation Tokens
    * Per write-up: Smooth, purposeful transitions (max 300ms)
    */
   
   export default {
     duration: {
       fast: 150,
       normal: 200,
       slow: 300,
     },
     easing: {
       easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
       easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
       easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
     },
   };
   ```

**Tests**: Create `src/__tests__/theme/animations.test.js`
- Test all animation tokens are exported
- Test animation duration values (max 300ms)
- Test easing functions

**Rule Reference**: `.cursor/rules/theme-design.mdc`, `.cursor/rules/performance.mdc`

---

### Step 3.10: Create Theme Provider
**Goal**: Create theme provider and resolver. **Only two themes: light and dark** (per `.cursor/rules/theme-design.mdc`).

**Actions**:
1. Create `src/theme/index.js`:
   ```javascript
   /**
    * Theme Provider & Resolver (light and dark only)
    */
   import React from 'react';
   import { ThemeProvider } from 'styled-components/native';
   import lightTheme from './light.theme';
   import darkTheme from './dark.theme';
   
   const getTheme = (mode = 'light') => {
     return mode === 'dark' ? darkTheme : lightTheme;
   };
   
   const ThemeProviderWrapper = ({ children, theme = 'light' }) => {
     return (
       <ThemeProvider theme={getTheme(theme)}>
         {children}
       </ThemeProvider>
     );
   };
   
   export default {
     ThemeProvider: ThemeProviderWrapper,
     lightTheme,
     darkTheme,
     getTheme,
   };
   ```

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

**Tests**: Create `src/__tests__/theme/index.test.js`
- Test theme provider renders
- Test theme resolver (getTheme function)
- Test theme switching

**Rule Reference**: `.cursor/rules/theme-design.mdc`

---

### Step 3.11: Create Redux Store
**Goal**: Redux Toolkit store setup

**Actions**:
1. Create `src/store/slices/ui.slice.js`:
   ```javascript
   /**
    * UI Slice
    * Global UI state (theme, locale, loading, etc.)
    */
   import { createSlice } from '@reduxjs/toolkit';
   import { getDeviceLocale } from '@i18n';
   
   const initialState = {
     theme: 'light', // 'light' or 'dark' only (per theme-design.mdc)
     locale: getDeviceLocale(),
     isLoading: false,
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
     },
   });
   
   export default {
     actions: uiSlice.actions,
     reducer: uiSlice.reducer,
   };
   ```

2. Create `src/store/rootReducer.js`:
   ```javascript
   /**
    * Root Reducer
    * Combines all reducers
    */
   import { combineReducers } from '@reduxjs/toolkit';
   import { reducer as uiReducer } from './slices/ui.slice';
   
   const rootReducer = combineReducers({
     ui: uiReducer,
   });
   
   export default rootReducer;
   ```

3. Create `src/store/middleware.js`:
   ```javascript
   /**
    * Custom Middleware
    */
   import { logger } from '@logging';
   
   const loggingMiddleware = (store) => (next) => (action) => {
     if (process.env.NODE_ENV === 'development') {
       logger.debug('Redux action', { type: action.type, payload: action.payload });
     }
     return next(action);
   };
   
   export default [loggingMiddleware];
   ```

4. Create `src/store/persist.js`:
   ```javascript
   /**
    * Redux Persist Configuration
    */
   import { persistReducer } from 'redux-persist';
   import { async } from '@services/storage';
   
   const persistConfig = {
     key: 'root',
     storage: {
       getItem: async.getItem,
       setItem: async.setItem,
       removeItem: async.removeItem,
     },
     whitelist: ['ui'], // Only persist UI state
   };
   
   const createPersistedReducer = (reducer) => {
     return persistReducer(persistConfig, reducer);
   };
   
   export default { createPersistedReducer };
   ```

5. Create `src/store/index.js`:
   ```javascript
   /**
    * Store Creation
    */
   import { configureStore } from '@reduxjs/toolkit';
   import rootReducer from './rootReducer';
   import middleware from './middleware';
   import { createPersistedReducer } from './persist';
   
   const store = configureStore({
     reducer: createPersistedReducer(rootReducer),
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware({
         serializableCheck: {
           ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
         },
       }).concat(middleware),
     devTools: process.env.NODE_ENV === 'development',
   });
   
   export default store;
   ```

6. Create `src/store/selectors/index.js`:
   ```javascript
   /**
    * Memoized Selectors
    */
   import { createSelector } from '@reduxjs/toolkit';
   
   const selectUI = (state) => state.ui;
   export const selectTheme = createSelector([selectUI], (ui) => ui.theme);
   export const selectLocale = createSelector([selectUI], (ui) => ui.locale);
   export const selectIsLoading = createSelector([selectUI], (ui) => ui.isLoading);
   ```

**Tests**: Create `src/__tests__/store/ui.slice.test.js`
- Test reducers
- Test actions
- Test selectors

**Rule Reference**: `.cursor/rules/state-management.mdc`

---

## Completion Criteria
- [x] Theme tokens complete (colors, spacing, typography, radius, shadows, animations).
- [x] Light and dark themes defined (only two themes).
- [x] Responsive breakpoints defined (`320`, `768`, `1024`, `1440`).
- [x] Theme provider created.
- [x] Redux store configured with deterministic reducers/selectors.
- [x] UI slice created (theme, locale, loading, safe metadata only).
- [x] Persistence configured with security constraints.
- [x] Selectors created.
- [x] All tests written and passing.
- [x] Backend-compatible session/tenant metadata boundaries verified.

**Next Phase**: `P004_offline.md`



