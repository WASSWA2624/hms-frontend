/**
 * useLoginScreen Hook
 * Shared behavior/logic for LoginScreen across all platforms.
 * Uses @services/storage (AsyncStorage on native, localStorage on web).
 * File: useLoginScreen.js
 */
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useAuth, useBiometricAuth, useI18n, useNetwork } from '@hooks';
import { AUTH } from '@config';
import { normalizePhoneNumber } from '@utils';
import { loginUseCase } from '@features/auth';
import { selectIsAuthenticated } from '@store/selectors';
import store from '@store';
import { async as asyncStorage } from '@services/storage';

const REMEMBER_ME_KEY = 'login_rememberMe';
const IDENTIFIER_KEY = 'login_identifier';

const resolveErrorMessage = (t, errorCode) => {
  if (!errorCode) return null;
  const key = `errors.codes.${errorCode}`;
  const resolved = t(key);
  return resolved === key ? t('errors.codes.UNKNOWN_ERROR') : resolved;
};

const normalizeIdentifier = (value) => String(value || '').trim();
const isEmailIdentifier = (value) => normalizeIdentifier(value).includes('@');

const useLoginScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const {
    login,
    clearError,
    isLoading,
    errorCode,
    refreshSession,
    loadCurrentUser,
    roles,
  } = useAuth();
  
  // Get isAuthenticated directly from Redux to avoid stale closure issues
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const {
    isAvailable: isBiometricAvailable,
    isChecking: isBiometricChecking,
    errorMessage: biometricErrorMessage,
    authenticate: authenticateBiometric,
  } = useBiometricAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Track if we just completed a login to trigger redirect
  const loginCompletedRef = useRef(false);

  // Load saved identifier/rememberMe from storage (async, cross-platform)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const savedRememberMe = await asyncStorage.getItem(REMEMBER_ME_KEY);
      const savedIdentifier = await asyncStorage.getItem(IDENTIFIER_KEY);
      if (!cancelled && savedRememberMe === true && typeof savedIdentifier === 'string') {
        setIdentifier(savedIdentifier);
        setRememberMe(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const errorMessage = useMemo(() => {
    const authMessage = resolveErrorMessage(t, errorCode);
    return authMessage || biometricErrorMessage;
  }, [biometricErrorMessage, errorCode, t]);

  const canSubmit = useMemo(
    () => Boolean(identifier && password) && !isLoading && !isOffline,
    [identifier, isLoading, isOffline, password]
  );

  const canAccessRegister = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!AUTH.REGISTER_ROLES?.length) return false;
    return AUTH.REGISTER_ROLES.some((role) => roles.includes(role));
  }, [isAuthenticated, roles]);

  const handleSubmit = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLoginScreen.js:80',message:'login_submit_enter',data:{canSubmit,isOffline,isLoading,hasIdentifier:Boolean(identifier),hasPassword:Boolean(password)},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion agent log
    if (!canSubmit) return false;
    clearError();
    const rawIdentifier = normalizeIdentifier(identifier);
    const payload = isEmailIdentifier(rawIdentifier)
      ? { email: rawIdentifier.toLowerCase() }
      : { phone: normalizePhoneNumber(rawIdentifier) };
    
    try {
      // Call login use case directly to check response
      console.log('[LOGIN] Starting login with payload:', { ...payload, password: '***' });
      const result = await loginUseCase({
        ...payload,
        password,
      });
      
      // Log full server response
      console.log('[LOGIN] Login result from server:', JSON.stringify(result, null, 2));
      console.log('[LOGIN] Login successful:', Boolean(result));
      console.log('[LOGIN] Result type check:', {
        isUser: Boolean(result?.id || result?.email || result?.phone),
        requiresFacilitySelection: Boolean(result?.requiresFacilitySelection),
        hasId: Boolean(result?.id),
        hasEmail: Boolean(result?.email),
        hasPhone: Boolean(result?.phone),
        resultKeys: result ? Object.keys(result) : [],
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLoginScreen.js:96',message:'login_usecase_result',data:{requiresFacilitySelection:Boolean(result?.requiresFacilitySelection),hasFacilities:Boolean(result?.facilities?.length),hasTenantId:Boolean(result?.tenantId),isUser:Boolean(result?.id || result?.email || result?.phone),resultType:typeof result,resultKeys:result ? Object.keys(result) : []},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion agent log
      
      // Check if facility selection is required
      if (result?.requiresFacilitySelection) {
        // #region agent log
        fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLoginScreen.js:102',message:'login_redirect_facility_selection',data:{route:'/facility-selection'},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion agent log
        router.push({
          pathname: '/facility-selection',
          params: {
            facilities: JSON.stringify(result.facilities),
            loginPayload: JSON.stringify({
              ...payload,
              password,
              tenant_id: result.tenantId,
            }),
          },
        });
        return true;
      }
      
      // Normal login - tokens are already stored by loginUseCase
      // Update Redux state by loading current user, then redirect
      const isUserResult = result && (result.id || result.email || result.phone);
      console.log('[LOGIN] Is user result?', isUserResult);
      
      if (isUserResult) {
        console.log('[LOGIN] Loading current user to update Redux state...');
        try {
          // Set flag for backup redirect mechanism
          loginCompletedRef.current = true;
          
          // Dispatch loadCurrentUser and wait for it to complete
          await loadCurrentUser();
          console.log('[LOGIN] loadCurrentUser thunk completed');
          
          // Poll Redux store directly until isAuthenticated is true
          // This ensures we have the latest state, not a stale closure
          let attempts = 0;
          const maxAttempts = 20; // 2 seconds max (20 * 100ms)
          
          while (attempts < maxAttempts) {
            const currentState = store.getState();
            const authState = currentState.auth || {};
            const isAuth = Boolean(authState.isAuthenticated || authState.user);
            
            console.log('[LOGIN] Checking auth state:', { 
              attempt: attempts + 1, 
              isAuthenticated: isAuth,
              hasUser: Boolean(authState.user)
            });
            
            if (isAuth) {
              console.log('[LOGIN] Authentication state confirmed, redirecting to /home...');
              router.replace('/home');
              return true;
            }
            
            // Wait 100ms before next check
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          // Fallback: if polling didn't work, try redirect anyway
          console.warn('[LOGIN] Polling timeout, attempting redirect anyway...');
          router.replace('/home');
          return true;
        } catch (loadError) {
          console.error('[LOGIN] Error loading current user:', loadError);
          return false;
        }
      }
      
      console.warn('[LOGIN] Login result is not a valid user object:', result);
      return false;
    } catch (error) {
      console.error('[LOGIN] Login error:', error);
      console.error('[LOGIN] Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
      // #region agent log
      fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLoginScreen.js:129',message:'login_submit_error',data:{errorCode:error?.code || null,errorMessage:typeof error?.message === 'string' ? error.message.slice(0,120) : null},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion agent log
      // Check if error is multiple tenants
      if (error?.code === 'MULTIPLE_TENANTS' || error?.message?.includes('multiple_tenants')) {
        // Redirect to tenant selection
        // #region agent log
        fetch('http://127.0.0.1:7251/ingest/1d28b85e-4e80-4cd6-84bc-0a14f3ba6cec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useLoginScreen.js:134',message:'login_redirect_tenant_selection',data:{route:'/tenant-selection'},timestamp:Date.now(),sessionId:'debug-session',runId:'login-redirect',hypothesisId:'H5'})}).catch(()=>{});
        // #endregion agent log
        router.push({
          pathname: '/tenant-selection',
          params: {
            identifier: rawIdentifier,
            password,
          },
        });
        return true;
      }
      // Dispatch login to Redux to handle error state
      await login({
        ...payload,
        password,
      });
      return false;
    }
  }, [canSubmit, clearError, identifier, login, loadCurrentUser, password, router]);

  const handleChangeIdentifier = useCallback((value) => {
    setIdentifier(value);
  }, []);

  const handleChangePassword = useCallback((value) => {
    setPassword(value);
  }, []);

  const handleRememberMeChange = useCallback((checked) => {
    setRememberMe(checked);
    if (checked) {
      asyncStorage.setItem(REMEMBER_ME_KEY, true);
      if (identifier) asyncStorage.setItem(IDENTIFIER_KEY, identifier);
    } else {
      asyncStorage.removeItem(REMEMBER_ME_KEY);
      asyncStorage.removeItem(IDENTIFIER_KEY);
    }
  }, [identifier]);

  // Save identifier when it changes and rememberMe is true
  useEffect(() => {
    if (rememberMe && identifier) {
      asyncStorage.setItem(IDENTIFIER_KEY, identifier);
    }
  }, [identifier, rememberMe]);

  // Backup redirect: if manual redirect in handleSubmit fails, this will catch it
  // Only redirect if we're on login page and become authenticated
  useEffect(() => {
    if (isAuthenticated && loginCompletedRef.current) {
      console.log('[LOGIN] Backup: isAuthenticated became true, redirecting to /home...');
      loginCompletedRef.current = false;
      // Small delay to avoid race condition with manual redirect
      const timeoutId = setTimeout(() => {
        router.replace('/home');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, router]);

  const handleGoToRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  const handleGoToForgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, [router]);

  const handleBiometricLogin = useCallback(async () => {
    if (!isBiometricAvailable || isBiometricChecking || isOffline) return false;
    const authenticated = await authenticateBiometric();
    if (!authenticated) return false;
    clearError();
    await refreshSession();
    await loadCurrentUser();
    return true;
  }, [
    authenticateBiometric,
    clearError,
    isBiometricAvailable,
    isBiometricChecking,
    isOffline,
    loadCurrentUser,
    refreshSession,
  ]);

  return {
    identifier,
    password,
    rememberMe,
    errorMessage,
    isLoading,
    isOffline,
    canSubmit,
    canAccessRegister,
    isBiometricAvailable,
    isBiometricChecking,
    handleSubmit,
    handleChangeIdentifier,
    handleChangePassword,
    handleRememberMeChange,
    handleGoToRegister,
    handleGoToForgotPassword,
    handleBiometricLogin,
  };
};

export default useLoginScreen;

