import React, { useEffect, useRef } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuthGuard } from '@navigation/guards';

/**
 * Auth Group Layout
 * 
 * Layout wrapper for authentication routes (login, register, etc.).
 * 
 * Per app-router.mdc:
 * - Layouts use `_layout.jsx`, default exports, `<Slot />` for child routes
 * - Guard placement: guards in layouts, not screens
 * 
 * This layout redirects authenticated users away from auth routes (e.g., login when already logged in).
 * Per Step 7.14: Uses useAuthGuard hook with skipRedirect option to get auth state,
 * then handles redirect of authenticated users to home route.
 */
const AuthLayout = () => {
  const router = useRouter();
  const { authenticated } = useAuthGuard({ skipRedirect: true });
  
  // Use ref to track if redirect has been performed to prevent multiple redirects
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    // Redirect authenticated users to home route
    if (authenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace('/home');
    } else if (!authenticated) {
      // Reset redirect flag when unauthenticated
      hasRedirected.current = false;
    }
  }, [authenticated, router]);
  
  return <Slot />;
};

export default AuthLayout;

