/**
 * Root Index Route
 * Redirects to home if authenticated, otherwise to login.
 * Per app-router.mdc: guard logic in layouts; this route only redirects.
 */
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuthGuard } from '@navigation/guards';

export default function IndexRoute() {
  const router = useRouter();
  const { authenticated } = useAuthGuard({ skipRedirect: true });
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    // Redirect once we have a definitive auth state (after PersistGate rehydration)
    if (authenticated === true) {
      hasRedirected.current = true;
      router.replace('/home');
    } else if (authenticated === false) {
      hasRedirected.current = true;
      router.replace('/login');
    }
  }, [authenticated, router]);

  return null;
}
