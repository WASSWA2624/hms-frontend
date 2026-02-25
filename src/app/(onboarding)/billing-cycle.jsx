/**
 * Billing Cycle Route
 * Step 11.1.12: billing cycle selection aligned with subscription plan enums.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { Button, Card, Container, ErrorState, ErrorStateSizes, LoadingSpinner, Stack, Text } from '@platform/components';
import { listSubscriptionPlans } from '@features/subscription-plan';
import { updateSubscription } from '@features/subscription';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage } from '@navigation/onboardingHelpers';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

const CYCLES = ['MONTHLY', 'QUARTERLY', 'YEARLY'];

function OnboardingBillingCycleRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState('MONTHLY');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    try {
      const progress = await readOnboardingProgress();
      const storedCycle = String(progress?.context?.billing_cycle || '').trim().toUpperCase();
      const storedPlanId = String(progress?.context?.subscription_plan_id || '').trim();
      const storedSubscriptionId = String(progress?.context?.subscription_id || '').trim();

      setSelectedCycle(CYCLES.includes(storedCycle) ? storedCycle : 'MONTHLY');
      setSelectedPlanId(storedPlanId);
      setSubscriptionId(storedSubscriptionId);

      await saveOnboardingStep('billing_cycle', {
        billing_cycle: CYCLES.includes(storedCycle) ? storedCycle : 'MONTHLY',
        subscription_plan_id: storedPlanId,
        subscription_id: storedSubscriptionId,
      });

      if (!isAuthenticated) return;

      const planList = await listSubscriptionPlans({ page: 1, limit: 100, order: 'asc', sort_by: 'name' });
      const normalizedPlans = Array.isArray(planList) ? planList : [];
      setPlans(normalizedPlans);

      if (!storedCycle && storedPlanId) {
        const selectedPlan = normalizedPlans.find((plan) => plan.id === storedPlanId);
        if (selectedPlan?.billing_cycle && CYCLES.includes(String(selectedPlan.billing_cycle).toUpperCase())) {
          setSelectedCycle(String(selectedPlan.billing_cycle).toUpperCase());
        }
      }
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsHydrating(false);
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const selectCycle = useCallback((cycle) => {
    if (!CYCLES.includes(cycle)) return;
    setSelectedCycle(cycle);
    setError(null);
  }, []);

  const ensureLoginResume = useCallback(async () => {
    let identifier = String(user?.email || '').trim().toLowerCase();
    if (!identifier) {
      const [progress, registration] = await Promise.all([
        readOnboardingProgress(),
        readRegistrationContext(),
      ]);
      identifier = String(progress?.context?.email || registration?.email || '').trim().toLowerCase();
    }
    if (!identifier) return;
    await saveAuthResumeContext({
      identifier,
      next_path: '/billing-cycle',
      params: {},
    });
  }, [user?.email]);

  const handleContinue = useCallback(async () => {
    if (isSaving) return;
    setError(null);

    if (!isAuthenticated) {
      const message = t('onboarding.billingCycle.errors.authRequired');
      setError({ code: 'UNAUTHORIZED', message });
      await ensureLoginResume();
      return;
    }

    if (!selectedCycle || !CYCLES.includes(selectedCycle)) {
      setError({
        code: 'ONBOARDING_BILLING_CYCLE_REQUIRED',
        message: t('onboarding.billingCycle.errors.cycleRequired'),
      });
      return;
    }

    if (!selectedPlanId) {
      setError({
        code: 'ONBOARDING_PLAN_REQUIRED',
        message: t('onboarding.plan.errors.planRequired'),
      });
      return;
    }

    if (!subscriptionId) {
      setError({
        code: 'ONBOARDING_SUBSCRIPTION_REQUIRED',
        message: t('onboarding.payment.errors.subscriptionRequired'),
      });
      return;
    }

    setIsSaving(true);
    try {
      let resolvedPlanId = selectedPlanId;

      if (plans.length > 0 && selectedPlanId) {
        const currentPlan = plans.find((plan) => plan.id === selectedPlanId);
        if (currentPlan && String(currentPlan.billing_cycle || '').toUpperCase() !== selectedCycle) {
          const sameNameCyclePlan =
            plans.find(
              (plan) =>
                String(plan.billing_cycle || '').toUpperCase() === selectedCycle &&
                String(plan.name || '').trim().toLowerCase() === String(currentPlan.name || '').trim().toLowerCase()
            ) ||
            plans.find((plan) => String(plan.billing_cycle || '').toUpperCase() === selectedCycle);

          if (sameNameCyclePlan?.id) {
            resolvedPlanId = sameNameCyclePlan.id;
          }
        }
      }

      if (subscriptionId && resolvedPlanId && resolvedPlanId !== selectedPlanId) {
        await updateSubscription(subscriptionId, { plan_id: resolvedPlanId });
      }

      await mergeOnboardingContext({
        billing_cycle: selectedCycle,
        subscription_plan_id: resolvedPlanId,
        subscription_id: subscriptionId,
      });
      await saveOnboardingStep('payment', {
        billing_cycle: selectedCycle,
        subscription_plan_id: resolvedPlanId,
        subscription_id: subscriptionId,
      });

      router.push('/payment');
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsSaving(false);
    }
  }, [
    ensureLoginResume,
    isAuthenticated,
    isSaving,
    plans,
    router,
    selectedCycle,
    selectedPlanId,
    subscriptionId,
    t,
  ]);

  const handleBack = useCallback(() => {
    router.replace('/plan');
  }, [router]);

  const handleLogin = useCallback(async () => {
    await ensureLoginResume();
    router.push('/login');
  }, [ensureLoginResume, router]);

  const cycleCards = CYCLES.map((cycle) => {
    const selected = selectedCycle === cycle;
    return (
      <Card key={cycle}>
        <Stack spacing="xs">
          <Text variant="label">{t(`onboarding.billingCycle.options.${cycle.toLowerCase()}`)}</Text>
          <Text variant="caption">{t(`onboarding.billingCycle.meta.${cycle.toLowerCase()}`)}</Text>
          <Button
            size="small"
            variant={selected ? 'surface' : 'text'}
            onPress={() => selectCycle(cycle)}
            accessibilityLabel={t('onboarding.billingCycle.actions.selectHint')}
            testID={`onboarding-billing-cycle-select-${cycle.toLowerCase()}`}
          >
            {selected ? t('onboarding.billingCycle.actions.selected') : t('onboarding.billingCycle.actions.select')}
          </Button>
        </Stack>
      </Card>
    );
  });

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-billing-cycle-loading" />;
  }

  return (
    <Container size="medium" testID="onboarding-billing-cycle-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Text variant="caption">{t('onboarding.billingCycle.readOnly')}</Text>
          ) : null}
        </Stack>

        <Stack spacing="sm">{cycleCards}</Stack>

        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Button
              size="small"
              variant="surface"
              onPress={handleLogin}
              accessibilityLabel={t('onboarding.billingCycle.actions.loginHint')}
              testID="onboarding-billing-cycle-login"
            >
              {t('onboarding.billingCycle.actions.login')}
            </Button>
          ) : null}
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            loading={isSaving}
            disabled={isSaving}
            accessibilityLabel={t('onboarding.billingCycle.actions.continueHint')}
            testID="onboarding-billing-cycle-continue"
          >
            {t('onboarding.billingCycle.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.billingCycle.actions.backHint')}
            testID="onboarding-billing-cycle-back"
          >
            {t('onboarding.billingCycle.actions.back')}
          </Button>
        </Stack>

        {error ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('onboarding.billingCycle.errors.title')}
            description={error.message}
            testID="onboarding-billing-cycle-error"
          />
        ) : null}
      </Stack>
    </Container>
  );
}

export default withRouteTermsAcceptance(OnboardingBillingCycleRoute, { screenKey: 'onboarding-billing-cycle' });
