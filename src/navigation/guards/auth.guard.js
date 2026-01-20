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
  
  // Use ref to track if redirect has been performed to prevent multiple redirects
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (skipRedirect) {
      // Skip automatic redirect - let the calling component handle redirects
      return;
    }
    
    if (isAuthenticated) {
      // Reset redirect flag when authenticated
      hasRedirected.current = false;
    } else if (!hasRedirected.current) {
      // Only redirect if not authenticated and haven't redirected yet
      hasRedirected.current = true;
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router, skipRedirect]);
  
  return {
    authenticated: isAuthenticated,
    user: user || null,
  };
}

