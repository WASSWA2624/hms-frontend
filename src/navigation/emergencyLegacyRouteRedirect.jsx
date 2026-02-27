import React, { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useOpdFlow } from '@hooks';
import { EMERGENCY_WORKBENCH_V1 } from '@config/feature.flags';

const sanitizeString = (value) => String(value || '').trim();
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuidLike = (value) => UUID_LIKE_REGEX.test(sanitizeString(value));
const UUID_HIDDEN_QUERY_KEYS = new Set(['id', 'emergencyCaseId', 'ambulanceId', 'legacyId']);

const buildEmergencyWorkbenchPath = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, rawValue]) => {
    const value = sanitizeString(rawValue);
    if (!value) return;
    if (UUID_HIDDEN_QUERY_KEYS.has(key) && isUuidLike(value)) return;
    query.set(key, value);
  });
  const encoded = query.toString();
  return encoded ? `/emergency?${encoded}` : '/emergency';
};

const EmergencyLegacyRouteRedirect = ({
  mode = 'list',
  resource = '',
  panel = '',
  action = '',
  fallback = null,
}) => {
  if (!EMERGENCY_WORKBENCH_V1) return fallback;

  const router = useRouter();
  const params = useLocalSearchParams();
  const { resolveLegacyRoute } = useOpdFlow();
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
    if (!EMERGENCY_WORKBENCH_V1) return;

    const run = async () => {
      if (mode === 'detail' || mode === 'edit') {
        if (!legacyId) {
          router.replace(buildEmergencyWorkbenchPath(redirectSeed));
          return;
        }

        try {
          const resolved = await resolveLegacyRoute(resource, legacyId);
          const mappedAction =
            mode === 'edit'
              ? `edit_${sanitizeString(resolved?.action || action || 'update')}`
              : sanitizeString(resolved?.action || action);

          router.replace(
            buildEmergencyWorkbenchPath({
              id: sanitizeString(resolved?.encounter_id),
              emergencyCaseId: sanitizeString(resolved?.emergency_case_id),
              ambulanceId: sanitizeString(resolved?.ambulance_id),
              panel: sanitizeString(resolved?.panel || panel),
              action: mappedAction,
              resource: sanitizeString(resolved?.resource || resource),
              legacyId,
            })
          );
          return;
        } catch (_error) {
          router.replace(buildEmergencyWorkbenchPath(redirectSeed));
          return;
        }
      }

      router.replace(buildEmergencyWorkbenchPath(redirectSeed));
    };

    run();
  }, [action, legacyId, mode, panel, redirectSeed, resolveLegacyRoute, resource, router]);

  return (
    <LoadingSpinner
      accessibilityLabel="Redirecting to Emergency workbench"
      testID="emergency-legacy-route-redirecting"
    />
  );
};

export default EmergencyLegacyRouteRedirect;
