/**
 * Root Index Route
 * Redirects based on first-launch and session state.
 * Navigation is deferred until after Root Layout has mounted (expo-router requirement).
 */
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { DEFAULT_HOME_ROUTE, getLastRoute } from '@navigation/routePersistence';
import { async as asyncStorage } from '@services/storage';
import { tokenManager } from '@security';
import { actions as authActions } from '@store/slices/auth.slice';

const FIRST_LAUNCH_KEY = 'hms.app.first_launch_completed';
const WELCOME_ROUTE = '/welcome';

const wasThunkFulfilled = (action) =>
  Boolean(action?.type && String(action.type).endsWith('/fulfilled'));

export default function IndexRoute() {
  const router = useRouter();
  const dispatch = useDispatch();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    const schedule =
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 0);
    const cancel =
      typeof cancelAnimationFrame === 'function'
        ? cancelAnimationFrame
        : (id) => clearTimeout(id);
    let canceled = false;
    let frameId;

    const resolveRedirect = async () => {
      try {
        // First launch always starts from landing.
        const hasOpenedBefore = await asyncStorage.getItem(FIRST_LAUNCH_KEY);
        if (!hasOpenedBefore) {
          await asyncStorage.setItem(FIRST_LAUNCH_KEY, true);
          const target = WELCOME_ROUTE;
          frameId = schedule(() => {
            schedule(() => {
              if (!canceled) router.replace(target);
            });
          });
          return;
        }

        let target = WELCOME_ROUTE;
        const shouldPersistSession = await tokenManager.shouldPersistTokens();
        if (shouldPersistSession) {
          const accessToken = await tokenManager.getAccessToken();
          const refreshToken = await tokenManager.getRefreshToken();
          const hasPersistedTokens = Boolean(accessToken || refreshToken);

          if (hasPersistedTokens) {
            let sessionRestored = false;

            if (accessToken && !tokenManager.isTokenExpired(accessToken)) {
              const loadResult = await dispatch(authActions.loadCurrentUser());
              sessionRestored = wasThunkFulfilled(loadResult) && Boolean(loadResult.payload);
            } else if (refreshToken) {
              const refreshResult = await dispatch(authActions.refreshSession());
              if (wasThunkFulfilled(refreshResult)) {
                const loadResult = await dispatch(authActions.loadCurrentUser());
                sessionRestored = wasThunkFulfilled(loadResult) && Boolean(loadResult.payload);
              }
            }

            if (sessionRestored) {
              const lastRoute = await getLastRoute();
              target = lastRoute || DEFAULT_HOME_ROUTE;
            } else {
              await tokenManager.clearTokens();
              dispatch(authActions.clearAuth());
            }
          }
        } else {
          dispatch(authActions.clearAuth());
        }

        frameId = schedule(() => {
          schedule(() => {
            if (!canceled) router.replace(target);
          });
        });
      } catch {
        frameId = schedule(() => {
          schedule(() => {
            if (!canceled) router.replace(WELCOME_ROUTE);
          });
        });
      }
    };

    resolveRedirect();

    return () => {
      canceled = true;
      if (frameId) cancel(frameId);
    };
  }, [dispatch, router]);

  return null;
}
