import React, { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useIpdFlow } from '@hooks';
import { ICU_WORKBENCH_V1 } from '@config/feature.flags';

const sanitizeString = (value) => String(value || '').trim();

const buildIcuWorkbenchPath = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, rawValue]) => {
    const value = sanitizeString(rawValue);
    if (!value) return;
    query.set(key, value);
  });
  const encoded = query.toString();
  return encoded ? `/icu?${encoded}` : '/icu';
};

const IcuLegacyRouteRedirect = ({
  mode = 'list',
  resource = '',
  panel = '',
  action = '',
  fallback = null,
}) => {
  if (!ICU_WORKBENCH_V1) return fallback;

  const router = useRouter();
  const params = useLocalSearchParams();
  const { resolveLegacyRoute } = useIpdFlow();
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
    if (!ICU_WORKBENCH_V1) return;

    const run = async () => {
      if (mode === 'detail' || mode === 'edit') {
        if (!legacyId) {
          router.replace(buildIcuWorkbenchPath(redirectSeed));
          return;
        }

        try {
          const resolved = await resolveLegacyRoute(resource, legacyId);
          const mappedAction =
            mode === 'edit'
              ? `edit_${sanitizeString(resolved?.action || action || 'update')}`
              : sanitizeString(resolved?.action || action);

          router.replace(
            buildIcuWorkbenchPath({
              id: sanitizeString(resolved?.admission_id),
              panel: sanitizeString(resolved?.panel || panel),
              action: mappedAction,
              resource: sanitizeString(resolved?.resource || resource),
              legacyId,
            })
          );
          return;
        } catch (_error) {
          router.replace(buildIcuWorkbenchPath(redirectSeed));
          return;
        }
      }

      router.replace(buildIcuWorkbenchPath(redirectSeed));
    };

    run();
  }, [action, legacyId, mode, panel, redirectSeed, resolveLegacyRoute, resource, router]);

  return (
    <LoadingSpinner
      accessibilityLabel="Redirecting to ICU command center"
      testID="icu-legacy-route-redirecting"
    />
  );
};

export default IcuLegacyRouteRedirect;
