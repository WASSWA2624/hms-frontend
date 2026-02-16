/**
 * Trial Route
 * Step 11.1.9: trial status and limits.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import {
  Button,
  Card,
  Container,
  EmptyState,
  EmptyStateSizes,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Stack,
  Text,
} from '@platform/components';
import { listSubscriptions } from '@features';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage } from '@navigation/onboardingHelpers';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const calculateDaysLeft = (endDate) => {
  if (!endDate) return null;
  const parsed = new Date(endDate);
  if (Number.isNaN(parsed.getTime())) return null;
  const diff = parsed.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / DAY_IN_MS));
};

export default function OnboardingTrialRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [error, setError] = useState(null);
  const [trialInfo, setTrialInfo] = useState(null);

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    try {
      const [registration, progress] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
      ]);

      let resolvedTrial = null;

      if (isAuthenticated) {
        const subscriptions = await listSubscriptions({
          page: 1,
          limit: 20,
          tenant_id: user?.tenant_id || registration?.tenant_id || progress?.context?.tenant_id || undefined,
          order: 'desc',
        });
        const subscriptionList = Array.isArray(subscriptions) ? subscriptions : [];

        const activeSubscription =
          subscriptionList.find((item) => item?.status === 'TRIAL') ||
          subscriptionList.find((item) => item?.status === 'ACTIVE') ||
          subscriptionList[0] ||
          null;

        if (activeSubscription) {
          resolvedTrial = {
            subscription_id: activeSubscription.id,
            status: activeSubscription.status || 'TRIAL',
            start_date: activeSubscription.start_date || '',
            end_date: activeSubscription.end_date || '',
            days_left: calculateDaysLeft(activeSubscription.end_date),
          };
        }
      }

      if (!resolvedTrial) {
        resolvedTrial = {
          subscription_id: String(progress?.context?.subscription_id || '').trim(),
          status: String(progress?.context?.trial_status || 'TRIAL').toUpperCase(),
          start_date: String(progress?.context?.trial_start_date || '').trim(),
          end_date: String(progress?.context?.trial_end_date || '').trim(),
          days_left: calculateDaysLeft(progress?.context?.trial_end_date),
        };
      }

      setTrialInfo(resolvedTrial);
      await saveOnboardingStep('trial', {
        subscription_id: resolvedTrial.subscription_id,
        trial_status: resolvedTrial.status,
        trial_start_date: resolvedTrial.start_date,
        trial_end_date: resolvedTrial.end_date,
      });
      await mergeOnboardingContext({
        subscription_id: resolvedTrial.subscription_id,
        trial_status: resolvedTrial.status,
        trial_start_date: resolvedTrial.start_date,
        trial_end_date: resolvedTrial.end_date,
      });
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsHydrating(false);
    }
  }, [isAuthenticated, t, user?.tenant_id]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleContinue = useCallback(async () => {
    await saveOnboardingStep('upgrade', {
      subscription_id: trialInfo?.subscription_id || '',
      trial_status: trialInfo?.status || 'TRIAL',
    });
    router.push('/upgrade');
  }, [router, trialInfo?.status, trialInfo?.subscription_id]);

  const handleBack = useCallback(() => {
    router.replace('/modules');
  }, [router]);

  const handleLogin = useCallback(async () => {
    let identifier = String(user?.email || '').trim().toLowerCase();
    if (!identifier) {
      const [progress, registration] = await Promise.all([
        readOnboardingProgress(),
        readRegistrationContext(),
      ]);
      identifier = String(progress?.context?.email || registration?.email || '').trim().toLowerCase();
    }
    if (identifier) {
      await saveAuthResumeContext({
        identifier,
        next_path: '/trial',
        params: {},
      });
    }
    router.push('/login');
  }, [router, user?.email]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-trial-loading" />;
  }

  if (error) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.trial.errors.title')}
        description={error.message}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={hydrate}
            accessibilityLabel={t('common.retry')}
            testID="onboarding-trial-retry"
          >
            {t('common.retry')}
          </Button>
        )}
        testID="onboarding-trial-error"
      />
    );
  }

  const status = String(trialInfo?.status || '').toUpperCase();
  const trialStatusLabel = !status ? t('onboarding.trial.status.unknown') : t(`onboarding.trial.status.${status.toLowerCase()}`);

  const hasTrialData = Boolean(trialInfo?.subscription_id || trialInfo?.start_date || trialInfo?.end_date);

  return (
    <Container size="medium" testID="onboarding-trial-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Text variant="caption">{t('onboarding.trial.readOnly')}</Text>
          ) : null}
        </Stack>

        {hasTrialData ? (
          <Card>
            <Stack spacing="sm">
              <Stack spacing="xs">
                <Text variant="label">{t('onboarding.trial.fields.status')}</Text>
                <Text variant="body">{trialStatusLabel}</Text>
              </Stack>
              <Stack spacing="xs">
                <Text variant="label">{t('onboarding.trial.fields.startDate')}</Text>
                <Text variant="body">{trialInfo?.start_date || t('onboarding.trial.notAvailable')}</Text>
              </Stack>
              <Stack spacing="xs">
                <Text variant="label">{t('onboarding.trial.fields.endDate')}</Text>
                <Text variant="body">{trialInfo?.end_date || t('onboarding.trial.notAvailable')}</Text>
              </Stack>
              <Stack spacing="xs">
                <Text variant="label">{t('onboarding.trial.fields.daysLeft')}</Text>
                <Text variant="body">
                  {trialInfo?.days_left !== null && trialInfo?.days_left !== undefined
                    ? t('onboarding.trial.daysLeft', { count: trialInfo.days_left })
                    : t('onboarding.trial.notAvailable')}
                </Text>
              </Stack>
            </Stack>
          </Card>
        ) : (
          <EmptyState
            size={EmptyStateSizes.SMALL}
            title={t('onboarding.trial.empty.title')}
            description={t('onboarding.trial.empty.description')}
            testID="onboarding-trial-empty"
          />
        )}

        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Button
              size="small"
              variant="surface"
              onPress={handleLogin}
              accessibilityLabel={t('onboarding.trial.actions.loginHint')}
              testID="onboarding-trial-login"
            >
              {t('onboarding.trial.actions.login')}
            </Button>
          ) : null}
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            accessibilityLabel={t('onboarding.trial.actions.continueHint')}
            testID="onboarding-trial-continue"
          >
            {t('onboarding.trial.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.trial.actions.backHint')}
            testID="onboarding-trial-back"
          >
            {t('onboarding.trial.actions.back')}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
