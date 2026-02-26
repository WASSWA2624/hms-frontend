import React, { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useTheatreFlow } from '@hooks';
import { THEATRE_WORKBENCH_V1 } from '@config/feature.flags';

const sanitizeString = (value) => String(value || '').trim();

const buildTheatreWorkbenchPath = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, rawValue]) => {
    const value = sanitizeString(rawValue);
    if (!value) return;
    query.set(key, value);
  });
  const encoded = query.toString();
  return encoded ? `/theatre?${encoded}` : '/theatre';
};

const TheatreLegacyRouteRedirect = ({
  mode = 'list',
  resource = '',
  panel = '',
  action = '',
  fallback = null,
}) => {
  if (!THEATRE_WORKBENCH_V1) return fallback;

  const router = useRouter();
  const params = useLocalSearchParams();
  const { resolveLegacyRoute } = useTheatreFlow();
  const legacyId = sanitizeString(params?.id);

  const redirectSeed = useMemo(
    () => ({
      panel,
      action,
      resource,
      legacyId,
    }),
    [action, legacyId, panel, resource]
  );

  useEffect(() => {
    if (!THEATRE_WORKBENCH_V1) return;

    const run = async () => {
      if (mode === 'detail' || mode === 'edit') {
        if (!legacyId) {
          router.replace(buildTheatreWorkbenchPath(redirectSeed));
          return;
        }

        try {
          const resolved = await resolveLegacyRoute(resource, legacyId);
          const mappedAction =
            mode === 'edit'
              ? `edit_${sanitizeString(resolved?.action || action || 'update')}`
              : sanitizeString(resolved?.action || action);

          router.replace(
            buildTheatreWorkbenchPath({
              id: sanitizeString(resolved?.theatre_case_id),
              panel: sanitizeString(resolved?.panel || panel),
              action: mappedAction,
              resource: sanitizeString(resolved?.resource || resource),
              legacyId,
            })
          );
          return;
        } catch (_error) {
          router.replace(buildTheatreWorkbenchPath(redirectSeed));
          return;
        }
      }

      router.replace(buildTheatreWorkbenchPath(redirectSeed));
    };

    run();
  }, [
    action,
    legacyId,
    mode,
    panel,
    redirectSeed,
    resolveLegacyRoute,
    resource,
    router,
  ]);

  return (
    <LoadingSpinner
      accessibilityLabel="Redirecting to Theatre workbench"
      testID="theatre-legacy-route-redirecting"
    />
  );
};

export default TheatreLegacyRouteRedirect;
