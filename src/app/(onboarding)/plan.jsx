/**
 * Plan Route
 * Step 11.1.11: plan and module selection.
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
import { listModules } from '@features/module';
import { createSubscription, listSubscriptions, updateSubscription } from '@features/subscription';
import { listSubscriptionPlans } from '@features/subscription-plan';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage, toIsoTimestamp } from '@navigation/onboardingHelpers';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

const formatPrice = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  return numeric.toFixed(2);
};

function OnboardingPlanRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [subscriptionContext, setSubscriptionContext] = useState({
    subscription_id: '',
    subscription_status: 'TRIAL',
    tenant_id: '',
  });

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    setNotice('');
    try {
      const [registration, progress] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
      ]);

      const storedPlanId = String(progress?.context?.subscription_plan_id || '').trim();
      const storedSelectedModules = Array.isArray(progress?.context?.selected_module_ids)
        ? progress.context.selected_module_ids.filter(Boolean)
        : [];
      const storedSubscriptionId = String(progress?.context?.subscription_id || '').trim();
      const storedTenantId = String(progress?.context?.tenant_id || registration?.tenant_id || user?.tenant_id || '').trim();

      setSelectedPlanId(storedPlanId);
      setSelectedModuleIds(storedSelectedModules);
      setSubscriptionContext({
        subscription_id: storedSubscriptionId,
        subscription_status: String(progress?.context?.trial_status || 'TRIAL').toUpperCase(),
        tenant_id: storedTenantId,
      });

      await saveOnboardingStep('plan', {
        subscription_plan_id: storedPlanId,
        selected_module_ids: storedSelectedModules,
        subscription_id: storedSubscriptionId,
        tenant_id: storedTenantId,
      });

      if (!isAuthenticated) return;

      const [planList, moduleList, subscriptionList] = await Promise.all([
        listSubscriptionPlans({ page: 1, limit: 100, order: 'asc', sort_by: 'name' }),
        listModules({ page: 1, limit: 100, order: 'asc', sort_by: 'name' }),
        listSubscriptions({
          page: 1,
          limit: 20,
          tenant_id: storedTenantId || user?.tenant_id || undefined,
          order: 'desc',
        }),
      ]);

      const normalizedPlans = Array.isArray(planList) ? planList : [];
      const normalizedModules = Array.isArray(moduleList) ? moduleList : [];
      const normalizedSubscriptions = Array.isArray(subscriptionList) ? subscriptionList : [];

      setPlans(normalizedPlans);
      setModules(normalizedModules);

      const currentSubscription =
        normalizedSubscriptions.find((item) => item?.status === 'TRIAL' || item?.status === 'ACTIVE') ||
        normalizedSubscriptions[0] ||
        null;

      if (currentSubscription) {
        setSubscriptionContext((prev) => ({
          ...prev,
          subscription_id: currentSubscription.id || prev.subscription_id,
          subscription_status: String(currentSubscription.status || prev.subscription_status || 'TRIAL').toUpperCase(),
          tenant_id: String(currentSubscription.tenant_id || prev.tenant_id || '').trim(),
        }));
      }

      if (!storedPlanId && currentSubscription?.plan_id) {
        setSelectedPlanId(String(currentSubscription.plan_id));
      }
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

  const toggleModule = useCallback((moduleId) => {
    setSelectedModuleIds((prev) => {
      const exists = prev.includes(moduleId);
      const next = exists ? prev.filter((entry) => entry !== moduleId) : [...prev, moduleId];
      mergeOnboardingContext({ selected_module_ids: next });
      return next;
    });
  }, []);

  const handleSelectPlan = useCallback((planId) => {
    setSelectedPlanId(planId);
    setError(null);
    setNotice('');
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
      next_path: '/plan',
      params: {},
    });
  }, [user?.email]);

  const handleContinue = useCallback(async () => {
    if (isSaving) return;
    setError(null);
    setNotice('');

    if (!isAuthenticated) {
      const message = t('onboarding.plan.errors.authRequired');
      setError({ code: 'UNAUTHORIZED', message });
      await ensureLoginResume();
      return;
    }

    if (!selectedPlanId) {
      setError({
        code: 'ONBOARDING_PLAN_REQUIRED',
        message: t('onboarding.plan.errors.planRequired'),
      });
      return;
    }

    if (!subscriptionContext.tenant_id) {
      setError({
        code: 'ONBOARDING_TENANT_REQUIRED',
        message: t('onboarding.plan.errors.tenantRequired'),
      });
      return;
    }

    setIsSaving(true);
    try {
      let resolvedSubscriptionId = subscriptionContext.subscription_id;
      let resolvedStatus = subscriptionContext.subscription_status || 'TRIAL';

      if (resolvedSubscriptionId) {
        const updated = await updateSubscription(resolvedSubscriptionId, {
          plan_id: selectedPlanId,
          status: resolvedStatus,
        });
        resolvedSubscriptionId = String(updated?.id || resolvedSubscriptionId);
        resolvedStatus = String(updated?.status || resolvedStatus || 'TRIAL').toUpperCase();
      } else {
        const created = await createSubscription({
          tenant_id: subscriptionContext.tenant_id,
          plan_id: selectedPlanId,
          status: 'TRIAL',
          start_date: toIsoTimestamp(new Date()),
          end_date: null,
        });
        resolvedSubscriptionId = String(created?.id || '');
        resolvedStatus = String(created?.status || 'TRIAL').toUpperCase();
      }

      await mergeOnboardingContext({
        subscription_id: resolvedSubscriptionId,
        subscription_plan_id: selectedPlanId,
        selected_module_ids: selectedModuleIds,
        trial_status: resolvedStatus,
      });

      await saveOnboardingStep('billing_cycle', {
        subscription_id: resolvedSubscriptionId,
        subscription_plan_id: selectedPlanId,
        selected_module_ids: selectedModuleIds,
      });

      setNotice(t('onboarding.plan.feedback.saved'));
      router.push('/billing-cycle');
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
    router,
    selectedModuleIds,
    selectedPlanId,
    subscriptionContext.subscription_id,
    subscriptionContext.subscription_status,
    subscriptionContext.tenant_id,
    t,
  ]);

  const handleBack = useCallback(() => {
    router.replace('/upgrade');
  }, [router]);

  const handleLogin = useCallback(async () => {
    await ensureLoginResume();
    router.push('/login');
  }, [ensureLoginResume, router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-plan-loading" />;
  }

  if (error && plans.length === 0 && !isAuthenticated) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.plan.errors.title')}
        description={error.message}
        testID="onboarding-plan-error-gate"
      />
    );
  }

  return (
    <Container size="medium" testID="onboarding-plan-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Text variant="caption">{t('onboarding.plan.readOnly')}</Text>
          ) : null}
        </Stack>

        {plans.length > 0 ? (
          <Stack spacing="sm">
            {plans.map((plan) => {
              const selected = selectedPlanId === plan.id;
              return (
                <Card key={plan.id}>
                  <Stack spacing="xs">
                    <Text variant="label">{plan.name}</Text>
                    <Text variant="caption">
                      {t('onboarding.plan.planMeta', {
                        cycle: t(`onboarding.billingCycle.options.${String(plan.billing_cycle || 'MONTHLY').toLowerCase()}`),
                        price: formatPrice(plan.price),
                      })}
                    </Text>
                    <Button
                      size="small"
                      variant={selected ? 'surface' : 'text'}
                      onPress={() => handleSelectPlan(plan.id)}
                      accessibilityLabel={t('onboarding.plan.actions.selectHint')}
                      testID={`onboarding-plan-select-${plan.id}`}
                    >
                      {selected ? t('onboarding.plan.actions.selected') : t('onboarding.plan.actions.select')}
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <EmptyState
            size={EmptyStateSizes.SMALL}
            title={t('onboarding.plan.empty.title')}
            description={t('onboarding.plan.empty.description')}
            testID="onboarding-plan-empty"
          />
        )}

        {modules.length > 0 ? (
          <Stack spacing="sm">
            <Text variant="label">{t('onboarding.plan.modulesTitle')}</Text>
            {modules.slice(0, 8).map((module) => {
              const selected = selectedModuleIds.includes(module.id);
              return (
                <Card key={module.id}>
                  <Stack spacing="xs">
                    <Text variant="label">{module.name}</Text>
                    <Text variant="caption">{module.description || t('onboarding.plan.moduleFallbackDescription')}</Text>
                    <Button
                      size="small"
                      variant={selected ? 'surface' : 'text'}
                      onPress={() => toggleModule(module.id)}
                      accessibilityLabel={t('onboarding.plan.actions.toggleModuleHint')}
                      testID={`onboarding-plan-toggle-module-${module.id}`}
                    >
                      {selected
                        ? t('onboarding.plan.actions.moduleSelected')
                        : t('onboarding.plan.actions.moduleSelect')}
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        ) : null}

        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Button
              size="small"
              variant="surface"
              onPress={handleLogin}
              accessibilityLabel={t('onboarding.plan.actions.loginHint')}
              testID="onboarding-plan-login"
            >
              {t('onboarding.plan.actions.login')}
            </Button>
          ) : null}
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            loading={isSaving}
            disabled={isSaving}
            accessibilityLabel={t('onboarding.plan.actions.continueHint')}
            testID="onboarding-plan-continue"
          >
            {t('onboarding.plan.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.plan.actions.backHint')}
            testID="onboarding-plan-back"
          >
            {t('onboarding.plan.actions.back')}
          </Button>
        </Stack>

        {notice ? (
          <Text variant="caption" testID="onboarding-plan-notice">
            {notice}
          </Text>
        ) : null}

        {error ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('onboarding.plan.errors.title')}
            description={error.message}
            testID="onboarding-plan-error"
          />
        ) : null}
      </Stack>
    </Container>
  );
}

export default withRouteTermsAcceptance(OnboardingPlanRoute, { screenKey: 'onboarding-plan' });
