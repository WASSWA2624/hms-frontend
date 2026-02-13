/**
 * Auth Guard Hook
 * 
 * Checks authentication state and redirects unauthenticated users.
 * 
 * @param {Object} options - Configuration options
 * @param {string} [options.redirectPath='/login'] - Path to redirect to if unauthenticated
 * @param {boolean} [options.skipRedirect=false] - If true, skip automatic redirect (useful for auth layouts that need to redirect authenticated users)
 * @returns {Object} Auth state object with { authenticated, user }
 * 
 * @example
 * const { authenticated, user } = useAuthGuard();
 * const { authenticated, user } = useAuthGuard({ redirectPath: '/custom-login' });
 * const { authenticated, user } = useAuthGuard({ skipRedirect: true }); // For auth layouts
 */

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectIsAuthenticated, selectUser } from '@store/selectors';

export function useAuthGuard(options = {}) {
  const { redirectPath = '/login', skipRedirect = false } = options;
  
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isRehydrated = useSelector((state) => Boolean(state?._persist?.rehydrated));
  
  // Use ref to track if redirect has been performed to prevent multiple redirects
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (skipRedirect || !isRehydrated) {
      return;
    }
    if (isAuthenticated) {
      hasRedirected.current = false;
      return;
    }
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        router.replace(redirectPath);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isAuthenticated, isRehydrated, redirectPath, router, skipRedirect]);
  
  return {
    authenticated: isAuthenticated,
    user: user || null,
  };
}

