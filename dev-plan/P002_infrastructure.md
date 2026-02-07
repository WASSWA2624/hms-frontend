# Phase 2: Infrastructure Layer

## Purpose
Build the infrastructure layer: services (API, storage, analytics) and security. Follows rules in `.cursor/rules/`. **Compliance**: `.cursor/rules/index.mdc` is the entry point; do not duplicate rule content here.

## Prerequisites
- Phase 1 completed
- Config layer available
- Logging and error handling available

## Steps

### Step 2.1: Create Storage Services
**Goal**: AsyncStorage and SecureStore wrappers

**Actions**:
1. Create `src/services/storage/async.js`:
   ```javascript
   /**
    * AsyncStorage Service
    * Non-sensitive data storage
    */
   import AsyncStorage from '@react-native-async-storage/async-storage';
   import { logger } from '@logging';
   
   const getItem = async (key) => {
     try {
       const value = await AsyncStorage.getItem(key);
       return value ? JSON.parse(value) : null;
     } catch (error) {
       logger.error('AsyncStorage getItem failed', { key, error: error.message });
       return null;
     }
   };
   
   const setItem = async (key, value) => {
     try {
       await AsyncStorage.setItem(key, JSON.stringify(value));
       return true;
     } catch (error) {
       logger.error('AsyncStorage setItem failed', { key, error: error.message });
       return false;
     }
   };
   
   const removeItem = async (key) => {
     try {
       await AsyncStorage.removeItem(key);
       return true;
     } catch (error) {
       logger.error('AsyncStorage removeItem failed', { key, error: error.message });
       return false;
     }
   };
   
   export { getItem, setItem, removeItem };
   ```

2. Create `src/services/storage/secure.js`:
   ```javascript
   /**
    * SecureStore Service
    * Sensitive data storage (tokens, credentials)
    */
   import * as SecureStore from 'expo-secure-store';
   import { logger } from '@logging';
   
   const getItem = async (key) => {
     try {
       return await SecureStore.getItemAsync(key);
     } catch (error) {
       logger.error('SecureStore getItem failed', { key, error: error.message });
       return null;
     }
   };
   
   const setItem = async (key, value) => {
     try {
       await SecureStore.setItemAsync(key, value);
       return true;
     } catch (error) {
       logger.error('SecureStore setItem failed', { key, error: error.message });
       return false;
     }
   };
   
   const removeItem = async (key) => {
     try {
       await SecureStore.deleteItemAsync(key);
       return true;
     } catch (error) {
       logger.error('SecureStore removeItem failed', { key, error: error.message });
       return false;
     }
   };
   
   export { getItem, setItem, removeItem };
   ```

3. Create `src/services/storage/index.js` (barrel):
   ```javascript
   export * as async from './async';
   export * as secure from './secure';
   ```

**Tests**: Create `src/__tests__/services/storage.test.js`
- Mock AsyncStorage/SecureStore
- Test all methods
- Test error handling

**Rule Reference**: `.cursor/rules/services-integration.mdc`, `.cursor/rules/security.mdc`

---

### Step 2.2: Create Security Layer
**Goal**: Token management and encryption

**Actions**:
1. Create `src/security/token.manager.js`:
   ```javascript
   /**
    * Token Manager
    * Handles JWT token lifecycle
    */
   import { secure } from '@services/storage';
   import { logger } from '@logging';
   
   const TOKEN_KEYS = {
     ACCESS_TOKEN: 'access_token',
     REFRESH_TOKEN: 'refresh_token',
   };
   
   const getAccessToken = async () => {
     return await secure.getItem(TOKEN_KEYS.ACCESS_TOKEN);
   };
   
   const getRefreshToken = async () => {
     return await secure.getItem(TOKEN_KEYS.REFRESH_TOKEN);
   };
   
   const setTokens = async (accessToken, refreshToken) => {
     const results = await Promise.all([
       secure.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
       secure.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
     ]);
     return results.every(Boolean);
   };
   
   const clearTokens = async () => {
     await Promise.all([
       secure.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
       secure.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
     ]);
   };
   
   const isTokenExpired = (token) => {
     if (!token) return true;
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       const exp = payload.exp * 1000;
       return Date.now() >= exp;
     } catch {
       return true;
     }
   };
   
   export { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired };
   ```

2. Create `src/security/encryption.js`:
   ```javascript
   /**
    * Encryption Helpers
    * For sensitive offline data
    */
   // Placeholder - implement with expo-crypto or similar
   // For now, return identity functions
   
   const encrypt = async (data) => {
     // TODO: Implement encryption
     return data;
   };
   
   const decrypt = async (encryptedData) => {
     // TODO: Implement decryption
     return encryptedData;
   };
   
   export { encrypt, decrypt };
   ```

3. Create `src/security/index.js` (barrel):
   ```javascript
   export * as tokenManager from './token.manager';
   export * as encryption from './encryption';
   ```

**Tests**: Create `src/__tests__/security/token.manager.test.js`
- Test token storage/retrieval
- Test token expiration
- Test token clearing

**Rule Reference**: `.cursor/rules/security.mdc`

---

### Step 2.3: Create API Services
**Goal**: Centralized API client

**Actions**:
1. Create `src/services/api/endpoints.js`:
   ```javascript
   /**
    * API Endpoints
    * Central registry of API routes
    */
   export * from '@config/endpoints';
   ```

2. Create `src/services/api/interceptors.js`:
   ```javascript
   /**
    * API Interceptors
    * Handles auth headers and token refresh
    */
   import { tokenManager } from '@security';
   import { handleError } from '@errors';
   
   const attachAuthHeader = async (config) => {
     const token = await tokenManager.getAccessToken();
     if (token) {
       config.headers = config.headers || {};
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   };
   
   const handleAuthError = async (error) => {
     if (error?.status === 401) {
       // Token refresh logic here
       await tokenManager.clearTokens();
       throw handleError(error);
     }
     throw handleError(error);
   };
   
   export { attachAuthHeader, handleAuthError };
   ```

3. Create `src/services/api/client.js`:
   ```javascript
   /**
    * API Client
    * Centralized fetch wrapper
    */
   import { TIMEOUTS } from '@config/constants';
   import { attachAuthHeader, handleAuthError } from './interceptors';
   import { logger } from '@logging';
   
   const apiClient = async (config) => {
     const {
       url,
       method = 'GET',
       body,
       headers = {},
       timeout = TIMEOUTS.API_REQUEST,
     } = config;
   
     // Attach auth header
     const authConfig = await attachAuthHeader({ url, method, body, headers });
   
     // Create abort controller for timeout
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), timeout);
   
     try {
       const response = await fetch(authConfig.url, {
         method: authConfig.method,
         headers: {
           'Content-Type': 'application/json',
           ...authConfig.headers,
         },
         body: authConfig.body ? JSON.stringify(authConfig.body) : undefined,
         signal: controller.signal,
       });
   
       clearTimeout(timeoutId);
   
       if (!response.ok) {
         const error = {
           status: response.status,
           statusText: response.statusText,
           message: `API request failed: ${response.statusText}`,
         };
         return await handleAuthError(error);
       }
   
       const data = await response.json();
       return { data, status: response.status };
     } catch (error) {
       clearTimeout(timeoutId);
       if (error.name === 'AbortError') {
         throw handleError(new Error('Request timeout'), { url });
       }
       throw handleAuthError(error);
     }
   };
   
   export { apiClient };
   ```

4. Create `src/services/api/index.js` (barrel):
   ```javascript
   export { apiClient } from './client';
   export * from './endpoints';
   ```

**Tests**: Create `src/__tests__/services/api.test.js`
- Mock fetch, `@security`, `@errors`
- Test auth header attachment
- Test error handling and timeout

**Rule Reference**: `.cursor/rules/services-integration.mdc`

---

### Step 2.4: Create Analytics Service
**Goal**: Analytics tracking (optional, can be no-op)

**Actions**:
1. Create `src/services/analytics/tracker.js`:
   ```javascript
   /**
    * Analytics Tracker
    * Fire-and-forget analytics
    */
   import { featureFlags } from '@config';
   import { logger } from '@logging';
   
   const trackEvent = (eventName, properties = {}) => {
     if (!featureFlags.ANALYTICS_ENABLED) return;
   
     // Fire-and-forget
     Promise.resolve().then(() => {
       // TODO: Send to analytics service
       logger.debug('Analytics event', { eventName, properties });
     }).catch(() => {
       // Silently fail
     });
   };
   
   const trackScreen = (screenName, properties = {}) => {
     trackEvent('screen_view', { screen_name: screenName, ...properties });
   };
   
   export { trackEvent, trackScreen };
   ```

2. Create `src/services/analytics/index.js` (barrel):
   ```javascript
   export * from './tracker';
   ```

**Tests**: Create `src/__tests__/services/analytics.test.js`
- Test event tracking
- Test feature flag gating

**Rule Reference**: `.cursor/rules/services-integration.mdc`

---

### Step 2.5: Create Services Barrel
**Goal**: Centralized services export

**Actions**:
1. Create `src/services/index.js`:
   ```javascript
   /**
    * Services Barrel Export
    */
   export * as api from './api';
   export * as storage from './storage';
   export * as analytics from './analytics';
   ```

---

## Completion Criteria
- ✅ Storage services (async, secure) complete
- ✅ Security layer (token manager, encryption) complete
- ✅ API client with interceptors complete
- ✅ Analytics service complete
- ✅ All tests written and passing
- ✅ No dependencies on UI or Redux
- ✅ Services are stateless and testable

**Next Phase**: `P003_state-theme.md`
