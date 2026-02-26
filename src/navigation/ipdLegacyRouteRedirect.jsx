import React, { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useIpdFlow } from '@hooks';
import { IPD_WORKBENCH_V1 } from '@config/feature.flags';

const sanitizeString = (value) => String(value || '').trim();

const buildIpdWorkbenchPath = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, rawValue]) => {
    const value = sanitizeString(rawValue);
    if (!value) return;
    query.set(key, value);
  });
  const encoded = query.toString();
  return encoded ? `/ipd?${encoded}` : '/ipd';
};

const IpdLegacyRouteRedirect = ({
  mode = 'list',
  resource = '',
  panel = '',
  action = '',
  fallback = null,
}) => {
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
    if (!IPD_WORKBENCH_V1) return;

    const run = async () => {
      if (mode === 'detail' || mode === 'edit') {
        if (!legacyId) {
          router.replace(buildIpdWorkbenchPath(redirectSeed));
          return;
        }

        try {
          const resolved = await resolveLegacyRoute(resource, legacyId);
          const mappedAction =
            mode === 'edit'
              ? `edit_${sanitizeString(resolved?.action || action || 'update')}`
              : sanitizeString(resolved?.action || action);

          router.replace(
            buildIpdWorkbenchPath({
              id: sanitizeString(resolved?.admission_id),
              panel: sanitizeString(resolved?.panel || panel),
              action: mappedAction,
              resource: sanitizeString(resolved?.resource || resource),
              legacyId,
            })
          );
          return;
        } catch (_error) {
          router.replace(buildIpdWorkbenchPath(redirectSeed));
          return;
        }
      }

      router.replace(buildIpdWorkbenchPath(redirectSeed));
    };

    run();
  }, [action, legacyId, mode, panel, redirectSeed, resolveLegacyRoute, resource, router]);

  if (!IPD_WORKBENCH_V1) return fallback;

  return <LoadingSpinner accessibilityLabel="Redirecting to IPD workbench" testID="ipd-legacy-route-redirecting" />;
};

export default IpdLegacyRouteRedirect;
