/**
 * Upgrade Route
 * Step 11.1.10: upgrade value messaging and paywall context.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useI18n } from '@hooks';
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
import { readOnboardingProgress, saveOnboardingStep } from '@navigation';

const DEFAULT_VALUE_POINTS = ['automation', 'fasterBilling', 'expandedCare', 'retentionInsights'];

export default function OnboardingUpgradeRoute() {
  const { t } = useI18n();
  const router = useRouter();

  const [isHydrating, setIsHydrating] = useState(true);
  const [trialStatus, setTrialStatus] = useState('TRIAL');
  const [daysLeft, setDaysLeft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      setIsHydrating(true);
      setError(null);
      try {
        const progress = await readOnboardingProgress();
        if (!active) return;
        const status = String(progress?.context?.trial_status || 'TRIAL').trim().toUpperCase();
        const resolvedStatus = status || 'TRIAL';
        const endDate = String(progress?.context?.trial_end_date || '').trim();
        const days = endDate ? Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : null;

        setTrialStatus(resolvedStatus);
        setDaysLeft(Number.isFinite(days) ? days : null);
        await saveOnboardingStep('upgrade', {
          trial_status: resolvedStatus,
          trial_end_date: endDate,
        });
      } catch {
        if (!active) return;
        setError({
          code: 'ONBOARDING_CONTEXT_MISSING',
          message: t('onboarding.upgrade.errors.loadFailed'),
        });
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [t]);

  const handleContinue = useCallback(async () => {
    await saveOnboardingStep('plan', { trial_status: trialStatus });
    router.push('/plan');
  }, [router, trialStatus]);

  const handleBack = useCallback(() => {
    router.replace('/trial');
  }, [router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-upgrade-loading" />;
  }

  if (error) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.upgrade.errors.title')}
        description={error.message}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={() => router.replace('/trial')}
            accessibilityLabel={t('onboarding.upgrade.actions.backHint')}
            testID="onboarding-upgrade-recover"
          >
            {t('onboarding.upgrade.actions.back')}
          </Button>
        )}
        testID="onboarding-upgrade-error"
      />
    );
  }

  return (
    <Container size="medium" testID="onboarding-upgrade-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          <Text variant="h3">{t('onboarding.upgrade.title')}</Text>
          <Text variant="body">{t('onboarding.upgrade.description')}</Text>
          <Text variant="caption">
            {t(`onboarding.upgrade.status.${String(trialStatus || 'TRIAL').toLowerCase()}`)}
          </Text>
          {daysLeft !== null ? (
            <Text variant="caption">{t('onboarding.upgrade.daysLeft', { count: daysLeft })}</Text>
          ) : null}
        </Stack>

        <Stack spacing="sm">
          {DEFAULT_VALUE_POINTS.map((point) => (
            <Card key={point}>
              <Stack spacing="xs">
                <Text variant="label">{t(`onboarding.upgrade.value.${point}.title`)}</Text>
                <Text variant="caption">{t(`onboarding.upgrade.value.${point}.description`)}</Text>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Text variant="caption">{t('onboarding.upgrade.paywallNotice')}</Text>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            accessibilityLabel={t('onboarding.upgrade.actions.continueHint')}
            testID="onboarding-upgrade-continue"
          >
            {t('onboarding.upgrade.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.upgrade.actions.backHint')}
            testID="onboarding-upgrade-back"
          >
            {t('onboarding.upgrade.actions.back')}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

