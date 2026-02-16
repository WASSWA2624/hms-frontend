/**
 * Provisioning Route
 * Step 11.1.5: onboarding provisioning status (informational; registration flow provisions server-side).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import {
  Button,
  Container,
  ErrorState,
  ErrorStateSizes,
  ProgressBar,
  Stack,
  Text,
} from '@platform/components';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveOnboardingStep,
} from '@navigation';
import { toSingleValue } from '@navigation/onboardingHelpers';

const PROVISION_STEPS = [20, 45, 70, 100];

export default function OnboardingProvisioningRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [isHydrating, setIsHydrating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [context, setContext] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  const queryEmail = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    setCompleted(false);
    setProgress(0);
    try {
      const [registration, progressRecord] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
      ]);

      const resolved = {
        email: queryEmail || registration?.email || progressRecord?.context?.email || '',
        admin_name: registration?.admin_name || progressRecord?.context?.admin_name || '',
        facility_name: registration?.facility_name || progressRecord?.context?.facility_name || '',
        facility_type: registration?.facility_type || progressRecord?.context?.facility_type || '',
        tenant_id: registration?.tenant_id || progressRecord?.context?.tenant_id || '',
        facility_id: registration?.facility_id || progressRecord?.context?.facility_id || '',
      };

      if (!resolved.email || !resolved.facility_name) {
        setError({
          code: 'ONBOARDING_CONTEXT_MISSING',
          message: t('onboarding.provisioning.errors.missingContext'),
        });
        return;
      }

      setContext(resolved);
      await saveOnboardingStep('provisioning', resolved);
      await mergeOnboardingContext(resolved);
    } catch {
      setError({
        code: 'ONBOARDING_CONTEXT_MISSING',
        message: t('onboarding.provisioning.errors.loadFailed'),
      });
    } finally {
      setIsHydrating(false);
    }
  }, [queryEmail, t]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrating || error || !context || completed) return undefined;

    let index = 0;
    const timer = setInterval(() => {
      const next = PROVISION_STEPS[index];
      setProgress(next);
      index += 1;

      if (index >= PROVISION_STEPS.length) {
        clearInterval(timer);
        setCompleted(true);
        saveOnboardingStep('welcome', context);
      }
    }, 450);

    return () => clearInterval(timer);
  }, [completed, context, error, isHydrating]);

  const handleContinue = useCallback(() => {
    if (!context) return;
    router.replace({
      pathname: '/welcome',
      params: context.email ? { email: context.email } : {},
    });
  }, [context, router]);

  const handleRestart = useCallback(() => {
    router.replace('/landing');
  }, [router]);

  if (isHydrating) {
    return (
      <Container size="medium" testID="onboarding-provisioning-hydrating">
        <Stack spacing="sm">
          <Text variant="body">{t('common.loading')}</Text>
        </Stack>
      </Container>
    );
  }

  if (error || !context) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.provisioning.errors.title')}
        description={error?.message || t('onboarding.provisioning.errors.missingContext')}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={hydrate}
            accessibilityLabel={t('common.retry')}
            testID="onboarding-provisioning-retry"
          >
            {t('common.retry')}
          </Button>
        )}
        testID="onboarding-provisioning-error"
      />
    );
  }

  return (
    <Container size="medium" testID="onboarding-provisioning-screen">
      <Stack spacing="md">
        <ProgressBar
          value={progress}
          accessibilityLabel={t('onboarding.provisioning.progressLabel')}
          testID="onboarding-provisioning-progress"
        />

        <Text variant="caption">
          {completed
            ? t('onboarding.provisioning.complete')
            : t('onboarding.provisioning.inProgress', { progress })}
        </Text>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            disabled={!completed}
            aria-disabled={!completed ? 'true' : undefined}
            accessibilityHint={!completed ? t('onboarding.provisioning.actions.continueBlocked') : t('onboarding.provisioning.actions.continueHint')}
            accessibilityLabel={t('onboarding.provisioning.actions.continueHint')}
            testID="onboarding-provisioning-continue"
          >
            {t('onboarding.provisioning.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleRestart}
            accessibilityLabel={t('onboarding.provisioning.actions.restartHint')}
            testID="onboarding-provisioning-restart"
          >
            {t('onboarding.provisioning.actions.restart')}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
