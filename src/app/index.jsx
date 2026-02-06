/**
 * Root Index Route
 * Redirects to home so the app opens on the home page.
 */
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function IndexRoute() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    router.replace('/home');
  }, [router]);

  return null;
}
