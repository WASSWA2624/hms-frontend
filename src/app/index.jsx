/**
 * Root Index Route
 * Redirects to last visited route (fallback: dashboard).
 * Navigation is deferred until after Root Layout has mounted (expo-router requirement).
 */
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { DEFAULT_HOME_ROUTE, getLastRoute } from '@navigation/routePersistence';

export default function IndexRoute() {
  const router = useRouter();
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
      const lastRoute = await getLastRoute();
      const target = lastRoute || DEFAULT_HOME_ROUTE;
      frameId = schedule(() => {
        schedule(() => {
          if (!canceled) router.replace(target);
        });
      });
    };

    resolveRedirect();

    return () => {
      canceled = true;
      if (frameId) cancel(frameId);
    };
  }, [router]);

  return null;
}
