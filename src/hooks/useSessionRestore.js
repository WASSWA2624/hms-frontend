/**
 * useSessionRestore Hook
 * Restores auth session from stored tokens after redux rehydration.
 * File: useSessionRestore.js
 */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tokenManager } from '@security';
import { actions as authActions } from '@store/slices/auth.slice';

const wasThunkFulfilled = (action) =>
  Boolean(action?.type && String(action.type).endsWith('/fulfilled'));

const getStatusCode = (action) => {
  const fromPayload = action?.payload?.status;
  if (typeof fromPayload === 'number') return fromPayload;
  const fromError = action?.error?.status;
  if (typeof fromError === 'number') return fromError;
  return null;
};

const isUnauthorizedAction = (action) => {
  const status = getStatusCode(action);
  return status === 401 || status === 403;
};

const useSessionRestore = (options = {}) => {
  const { enabled = true } = options;
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => Boolean(state?.auth?.isAuthenticated));
  const isRehydrated = useSelector((state) => Boolean(state?._persist?.rehydrated));
  const hasAttemptedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsReady(true);
      return;
    }

    if (!isRehydrated) {
      setIsReady(false);
      return;
    }

    if (isAuthenticated) {
      hasAttemptedRef.current = true;
      setIsReady(true);
      return;
    }

    if (hasAttemptedRef.current) {
      setIsReady(true);
      return;
    }

    let isMounted = true;
    setIsReady(false);

    const restoreSession = async () => {
      try {
        const accessToken = await tokenManager.getAccessToken();
        const refreshToken = await tokenManager.getRefreshToken();

        if (!accessToken && !refreshToken) {
          dispatch(authActions.clearAuth());
          return;
        }

        let restored = false;
        let shouldInvalidate = false;

        if (accessToken && !tokenManager.isTokenExpired(accessToken)) {
          const loadResult = await dispatch(authActions.loadCurrentUser());
          restored = wasThunkFulfilled(loadResult) && Boolean(loadResult?.payload);
          shouldInvalidate = !restored && isUnauthorizedAction(loadResult);
        } else if (refreshToken) {
          const refreshResult = await dispatch(authActions.refreshSession());
          if (wasThunkFulfilled(refreshResult)) {
            const loadResult = await dispatch(authActions.loadCurrentUser());
            restored = wasThunkFulfilled(loadResult) && Boolean(loadResult?.payload);
            shouldInvalidate = !restored && isUnauthorizedAction(loadResult);
          } else {
            shouldInvalidate = isUnauthorizedAction(refreshResult);
          }
        }

        if (!restored && shouldInvalidate) {
          await tokenManager.clearTokens();
          dispatch(authActions.clearAuth());
        }
      } catch {
        await tokenManager.clearTokens();
        dispatch(authActions.clearAuth());
      } finally {
        if (!isMounted) return;
        hasAttemptedRef.current = true;
        setIsReady(true);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, enabled, isAuthenticated, isRehydrated]);

  return { isReady };
};

export default useSessionRestore;

