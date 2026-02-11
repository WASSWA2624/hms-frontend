/**
 * Public Landing Route
 * Step 11.1.1: landing + facility type selection.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { Button, ErrorState, ErrorStateSizes, LoadingSpinner } from '@platform/components';
import { LandingScreen } from '@platform/screens';
import {
  mapFacilityToBackendType,
  readOnboardingEntry,
  resolveFacilitySelection,
  saveOnboardingEntry,
} from '@navigation/onboardingEntry';

const resolveQuerySelection = (params) =>
  resolveFacilitySelection(params?.facility) ||
  resolveFacilitySelection(params?.facilityType) ||
  resolveFacilitySelection(params?.facility_type);

export default function PublicLandingRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();

  const querySelection = useMemo(() => resolveQuerySelection(params), [params]);
  const tenantIdParam = useMemo(() => {
    const value = params?.tenant_id;
    if (Array.isArray(value)) return value[0] || '';
    return typeof value === 'string' ? value : '';
  }, [params]);
  const facilityIdParam = useMemo(() => {
    const value = params?.facility_id;
    if (Array.isArray(value)) return value[0] || '';
    return typeof value === 'string' ? value : '';
  }, [params]);
  const [initialFacilityId, setInitialFacilityId] = useState(querySelection || undefined);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const hydrateSelection = useCallback(async () => {
    setLoadError(false);
    setIsHydrating(true);

    try {
      if (querySelection) {
        setInitialFacilityId(querySelection);
        setIsHydrating(false);
        return;
      }

      const stored = await readOnboardingEntry();
      setInitialFacilityId(stored?.facility_id || undefined);
    } catch {
      setLoadError(true);
    } finally {
      setIsHydrating(false);
    }
  }, [querySelection]);

  useEffect(() => {
    hydrateSelection();
  }, [hydrateSelection]);

  const handleStart = useCallback(
    async (selectedFacilityId) => {
      const selection = resolveFacilitySelection(selectedFacilityId);
      if (!selection) return;

      setSubmitError(false);
      setIsSubmitting(true);
      try {
        const saved = await saveOnboardingEntry(selection);
        if (!saved) {
          throw new Error('save_failed');
        }
        router.push({
          pathname: '/register',
          params: {
            facility: selection,
            facility_type: mapFacilityToBackendType(selection) || '',
            tenant_id: tenantIdParam || '',
            facility_id: facilityIdParam || '',
          },
        });
      } catch {
        setSubmitError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [facilityIdParam, router, tenantIdParam]
  );

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="landing-hydrating" />;
  }

  if (loadError) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('landing.errors.loadTitle')}
        description={t('landing.errors.loadDescription')}
        action={
          <Button variant="surface" size="small" onPress={hydrateSelection} accessibilityLabel={t('common.retry')}>
            {t('common.retry')}
          </Button>
        }
        testID="landing-load-error"
      />
    );
  }

  return (
    <>
      <LandingScreen
        embedded
        isSubmitting={isSubmitting}
        onStart={handleStart}
        initialFacilityId={initialFacilityId}
        testID="landing-route-screen"
      />
      {submitError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('landing.errors.submitTitle')}
          description={t('landing.errors.submitDescription')}
          testID="landing-submit-error"
        />
      ) : null}
    </>
  );
}
