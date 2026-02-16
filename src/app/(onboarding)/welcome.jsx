/**
 * Welcome Route
 * Step 11.1.6: activation summary and next steps.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import {
  Button,
  Card,
  Container,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Stack,
  Text,
} from '@platform/components';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage } from '@navigation/onboardingHelpers';

const resolveAdminName = (authUser, registrationContext) => {
  const first = String(authUser?.profile?.first_name || '').trim();
  const last = String(authUser?.profile?.last_name || '').trim();
  const fullName = `${first} ${last}`.trim();
  if (fullName) return fullName;
  return registrationContext?.admin_name || '';
};

const resolveFacilityName = (authUser, registrationContext) =>
  authUser?.facility?.name ||
  authUser?.tenant?.name ||
  registrationContext?.facility_display_name ||
  registrationContext?.facility_name ||
  '';

const resolveFacilityType = (authUser, registrationContext) =>
  String(authUser?.facility?.facility_type || registrationContext?.facility_type || '').toUpperCase();

export default function OnboardingWelcomeRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user, loadCurrentUser } = useAuth();
  const canGoBack = typeof router?.canGoBack === 'function' && router.canGoBack();

  const [isHydrating, setIsHydrating] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    try {
      const [registration, progress] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
      ]);

      let effectiveUser = user;
      if (isAuthenticated && !effectiveUser?.id) {
        const action = await loadCurrentUser();
        if (action?.meta?.requestStatus === 'fulfilled') {
          effectiveUser = action.payload || null;
        } else {
          const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
          const message = resolveErrorMessage(code, action?.payload?.message, t);
          setError({ code, message });
        }
      }

      const resolved = {
        email:
          effectiveUser?.email ||
          registration?.email ||
          String(progress?.context?.email || '').trim().toLowerCase(),
        admin_name: resolveAdminName(effectiveUser, registration),
        facility_name: resolveFacilityName(effectiveUser, registration),
        facility_type: resolveFacilityType(effectiveUser, registration),
        tenant_id: effectiveUser?.tenant_id || registration?.tenant_id || progress?.context?.tenant_id || '',
        facility_id: effectiveUser?.facility_id || registration?.facility_id || progress?.context?.facility_id || '',
      };

      if (!resolved.email || !resolved.facility_name) {
        setError({
          code: 'ONBOARDING_CONTEXT_MISSING',
          message: t('onboarding.welcome.errors.missingContext'),
        });
        return;
      }

      setSummary(resolved);
      await saveOnboardingStep('welcome', resolved);
      await mergeOnboardingContext(resolved);
    } catch {
      setError({
        code: 'ONBOARDING_CONTEXT_MISSING',
        message: t('onboarding.welcome.errors.loadFailed'),
      });
    } finally {
      setIsHydrating(false);
    }
  }, [isAuthenticated, loadCurrentUser, t, user]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleContinue = useCallback(async () => {
    if (!summary) return;
    await saveOnboardingStep('checklist', summary);
    router.push('/checklist');
  }, [router, summary]);

  const handleRetry = useCallback(() => {
    hydrate();
  }, [hydrate]);

  const handleRestart = useCallback(() => {
    router.replace('/landing');
  }, [router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-welcome-loading" />;
  }

  if (error || !summary) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.welcome.errors.title')}
        description={error?.message || t('onboarding.welcome.errors.missingContext')}
        action={(
          <Button
            variant="surface"
            size="small"
            onPress={handleRetry}
            accessibilityLabel={t('common.retry')}
            testID="onboarding-welcome-retry"
          >
            {t('common.retry')}
          </Button>
        )}
        testID="onboarding-welcome-error"
      />
    );
  }

  const summaryRows = [
    { key: 'email', label: t('onboarding.welcome.summary.email'), value: summary.email },
    {
      key: 'admin_name',
      label: t('onboarding.welcome.summary.adminName'),
      value: summary.admin_name || t('onboarding.welcome.summary.notProvided'),
    },
    { key: 'facility_name', label: t('onboarding.welcome.summary.facilityName'), value: summary.facility_name },
    {
      key: 'facility_type',
      label: t('onboarding.welcome.summary.facilityType'),
      value: summary.facility_type || t('onboarding.welcome.summary.notProvided'),
    },
  ];

  return (
    <Container size="medium" testID="onboarding-welcome-screen">
      <Stack spacing="md">
        <Card>
          <Stack spacing="sm">
            {summaryRows.map((row) => (
              <Stack spacing="xs" key={row.key}>
                <Text variant="label">{row.label}</Text>
                <Text variant="body">{row.value}</Text>
              </Stack>
            ))}
          </Stack>
        </Card>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            accessibilityLabel={t('onboarding.welcome.actions.continueHint')}
            testID="onboarding-welcome-continue"
          >
            {t('onboarding.welcome.actions.continue')}
          </Button>
          {!canGoBack ? (
            <Button
              size="small"
              variant="text"
              onPress={handleRestart}
              accessibilityLabel={t('onboarding.welcome.actions.restartHint')}
              testID="onboarding-welcome-restart"
            >
              {t('onboarding.welcome.actions.restart')}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Container>
  );
}
