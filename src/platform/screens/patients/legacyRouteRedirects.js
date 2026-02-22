import React, { useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n } from '@hooks';
import { normalizeRouteId, sanitizeString } from './patientResourceConfigs';

const getScalarParam = (value) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const resolvePatientContextId = (params, includeRouteId) => {
  const candidates = [
    getScalarParam(params?.patientId),
    getScalarParam(params?.patient_id),
    getScalarParam(params?.patient),
  ];

  if (includeRouteId) {
    candidates.push(getScalarParam(params?.id));
  }

  for (const candidate of candidates) {
    const normalized = normalizeRouteId(candidate);
    if (normalized) return normalized;
  }

  return null;
};

const buildWorkspacePath = ({
  patientId,
  tab,
  panel,
  mode,
  recordId,
  fallback = '/patients/patients',
}) => {
  if (!patientId) return fallback;

  const query = new URLSearchParams();
  if (sanitizeString(tab)) query.set('tab', sanitizeString(tab));
  if (sanitizeString(panel)) query.set('panel', sanitizeString(panel));
  if (sanitizeString(mode)) query.set('mode', sanitizeString(mode));
  if (sanitizeString(recordId)) query.set('recordId', sanitizeString(recordId));

  const queryString = query.toString();
  return queryString
    ? `/patients/patients/${patientId}?${queryString}`
    : `/patients/patients/${patientId}`;
};

const LegacyWorkspaceRedirect = ({
  tab,
  panel,
  mode,
  fallback,
  includeRouteIdAsPatientContext = false,
  includeRouteIdAsRecordId = false,
  testID,
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const patientId = useMemo(
    () => resolvePatientContextId(searchParams, includeRouteIdAsPatientContext),
    [searchParams, includeRouteIdAsPatientContext]
  );

  const targetPath = useMemo(
    () =>
      buildWorkspacePath({
        patientId,
        tab,
        panel,
        mode,
        fallback,
        recordId: includeRouteIdAsRecordId ? getScalarParam(searchParams?.id) : '',
      }),
    [
      patientId,
      tab,
      panel,
      mode,
      fallback,
      includeRouteIdAsRecordId,
      searchParams,
    ]
  );

  useEffect(() => {
    router.replace(targetPath);
  }, [router, targetPath]);

  return <LoadingSpinner accessibilityLabel={t('common.loading')} testID={testID} />;
};

const LegacyLegalHubRedirect = ({ tab = 'consents', testID }) => {
  const { t } = useI18n();
  const router = useRouter();
  const targetPath = `/patients/legal?tab=${sanitizeString(tab) || 'consents'}`;

  useEffect(() => {
    router.replace(targetPath);
  }, [router, targetPath]);

  return <LoadingSpinner accessibilityLabel={t('common.loading')} testID={testID} />;
};

export { LegacyWorkspaceRedirect, LegacyLegalHubRedirect };
