/**
 * Modules Route
 * Step 11.1.8: module recommendations and progressive unlocks.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  createModuleSubscription,
  listModuleSubscriptions,
  listModules,
  listSubscriptions,
  updateModuleSubscription,
} from '@features';
import {
  mergeOnboardingContext,
  readOnboardingEntry,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage } from '@navigation/onboardingHelpers';

const FACILITY_RECOMMENDATION_TOKENS = {
  CLINIC: ['opd', 'appointment', 'billing', 'report'],
  HOSPITAL: ['opd', 'ipd', 'billing', 'hr', 'inventory', 'icu', 'theatre'],
  LAB: ['lab', 'lis', 'diagnostic', 'billing', 'inventory'],
  PHARMACY: ['pharmacy', 'inventory', 'billing'],
  OTHER: ['emergency', 'ambulance', 'billing', 'notification'],
};

const normalizeName = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const resolveRecommendedByName = (modules, facilityType) => {
  const tokens = FACILITY_RECOMMENDATION_TOKENS[facilityType] || FACILITY_RECOMMENDATION_TOKENS.CLINIC;
  return modules
    .filter((module) => tokens.some((token) => normalizeName(module?.name).includes(normalizeName(token))))
    .map((module) => module.id)
    .filter(Boolean);
};

export default function OnboardingModulesRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [facilityType, setFacilityType] = useState('CLINIC');
  const [modules, setModules] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [moduleSubscriptions, setModuleSubscriptions] = useState([]);

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    setNotice('');

    try {
      const [registration, progress, onboardingEntry] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
        readOnboardingEntry(),
      ]);

      const resolvedType = String(
        registration?.facility_type ||
          progress?.context?.facility_type ||
          onboardingEntry?.facility_type ||
          'CLINIC'
      )
        .trim()
        .toUpperCase();
      const normalizedType = FACILITY_RECOMMENDATION_TOKENS[resolvedType] ? resolvedType : 'CLINIC';
      const initialSelected = Array.isArray(progress?.context?.selected_module_ids)
        ? progress.context.selected_module_ids.filter(Boolean)
        : [];
      const initialSubscriptionId = String(progress?.context?.subscription_id || '').trim();

      setFacilityType(normalizedType);
      setSelectedIds(initialSelected);
      setSubscriptionId(initialSubscriptionId);
      await saveOnboardingStep('modules', {
        facility_type: normalizedType,
        selected_module_ids: initialSelected,
        subscription_id: initialSubscriptionId,
      });

      if (!isAuthenticated) {
        setRecommendedIds(initialSelected);
        setModules([]);
        return;
      }

      setIsLoadingData(true);
      const modulesResponse = await listModules({ page: 1, limit: 100, sort_by: 'name', order: 'asc' });
      const moduleList = Array.isArray(modulesResponse) ? modulesResponse : [];
      setModules(moduleList);

      let resolvedSubscriptionId = initialSubscriptionId;
      if (!resolvedSubscriptionId) {
        const subscriptionList = await listSubscriptions({
          page: 1,
          limit: 20,
          tenant_id: user?.tenant_id || registration?.tenant_id || undefined,
          order: 'desc',
        });
        if (Array.isArray(subscriptionList) && subscriptionList.length > 0) {
          const prioritized =
            subscriptionList.find((item) => item?.status === 'ACTIVE' || item?.status === 'TRIAL') ||
            subscriptionList[0];
          resolvedSubscriptionId = String(prioritized?.id || '').trim();
          setSubscriptionId(resolvedSubscriptionId);
        }
      }

      let existingModuleSubscriptions = [];
      if (resolvedSubscriptionId) {
        existingModuleSubscriptions = await listModuleSubscriptions({
          page: 1,
          limit: 200,
          subscription_id: resolvedSubscriptionId,
        });
      }
      const normalizedModuleSubscriptions = Array.isArray(existingModuleSubscriptions)
        ? existingModuleSubscriptions
        : [];
      setModuleSubscriptions(normalizedModuleSubscriptions);

      const activeSubscribedModuleIds = normalizedModuleSubscriptions
        .filter((item) => Boolean(item?.is_active))
        .map((item) => item?.module_id)
        .filter(Boolean);

      const recommended = resolveRecommendedByName(moduleList, normalizedType);
      setRecommendedIds(recommended);

      const mergedSelection = Array.from(
        new Set([...(initialSelected || []), ...(activeSubscribedModuleIds || []), ...(recommended || [])])
      );
      setSelectedIds(mergedSelection);

      await mergeOnboardingContext({
        facility_type: normalizedType,
        selected_module_ids: mergedSelection,
        subscription_id: resolvedSubscriptionId,
      });
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsLoadingData(false);
      setIsHydrating(false);
    }
  }, [isAuthenticated, t, user?.tenant_id]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const toggleModuleSelection = useCallback((moduleId) => {
    setSelectedIds((prev) => {
      const hasModule = prev.includes(moduleId);
      const next = hasModule ? prev.filter((entry) => entry !== moduleId) : [...prev, moduleId];
      mergeOnboardingContext({ selected_module_ids: next });
      return next;
    });
  }, []);

  const ensureLoginResumeContext = useCallback(async () => {
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
      next_path: '/modules',
      params: {},
    });
  }, [user?.email]);

  const handlePersistSelections = useCallback(async () => {
    if (isSaving) return false;

    if (!isAuthenticated) {
      setError({
        code: 'UNAUTHORIZED',
        message: t('onboarding.modules.errors.authRequired'),
      });
      await ensureLoginResumeContext();
      return false;
    }

    if (!subscriptionId) {
      setError({
        code: 'ONBOARDING_SUBSCRIPTION_REQUIRED',
        message: t('onboarding.modules.errors.subscriptionRequired'),
      });
      return false;
    }

    setIsSaving(true);
    setError(null);
    setNotice('');

    try {
      const existingByModuleId = new Map(
        moduleSubscriptions
          .filter((item) => item?.module_id)
          .map((item) => [item.module_id, item])
      );

      const selectedSet = new Set(selectedIds);
      const updateJobs = [];

      selectedIds.forEach((moduleId) => {
        const existing = existingByModuleId.get(moduleId);
        if (!existing) {
          updateJobs.push(
            createModuleSubscription({
              module_id: moduleId,
              subscription_id: subscriptionId,
              is_active: true,
            })
          );
        } else if (!existing.is_active) {
          updateJobs.push(
            updateModuleSubscription(existing.id, {
              module_id: moduleId,
              subscription_id: subscriptionId,
              is_active: true,
            })
          );
        }
      });

      moduleSubscriptions
        .filter((item) => Boolean(item?.is_active))
        .forEach((item) => {
          if (!selectedSet.has(item.module_id)) {
            updateJobs.push(
              updateModuleSubscription(item.id, {
                module_id: item.module_id,
                subscription_id: subscriptionId,
                is_active: false,
              })
            );
          }
        });

      await Promise.all(updateJobs);
      setNotice(t('onboarding.modules.feedback.saved'));

      const refreshedModuleSubscriptions = await listModuleSubscriptions({
        page: 1,
        limit: 200,
        subscription_id: subscriptionId,
      });
      setModuleSubscriptions(Array.isArray(refreshedModuleSubscriptions) ? refreshedModuleSubscriptions : []);

      await mergeOnboardingContext({
        selected_module_ids: selectedIds,
        subscription_id: subscriptionId,
      });

      return true;
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    ensureLoginResumeContext,
    isAuthenticated,
    isSaving,
    moduleSubscriptions,
    selectedIds,
    subscriptionId,
    t,
  ]);

  const handleContinue = useCallback(async () => {
    const persisted = await handlePersistSelections();
    if (!persisted && isAuthenticated && subscriptionId) return;

    await saveOnboardingStep('trial', {
      selected_module_ids: selectedIds,
      subscription_id: subscriptionId,
      facility_type: facilityType,
    });
    router.push('/trial');
  }, [facilityType, handlePersistSelections, isAuthenticated, router, selectedIds, subscriptionId]);

  const handleBack = useCallback(() => {
    router.replace('/checklist');
  }, [router]);

  const handleOpenLogin = useCallback(async () => {
    await ensureLoginResumeContext();
    router.push('/login');
  }, [ensureLoginResumeContext, router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-modules-loading" />;
  }

  const authBlocked = !isAuthenticated;
  const saveBlocked = authBlocked || !subscriptionId;
  const saveBlockedReason = authBlocked
    ? t('onboarding.modules.actions.saveBlockedAuth')
    : !subscriptionId
      ? t('onboarding.modules.actions.saveBlockedPlan')
      : '';

  return (
    <Container size="medium" testID="onboarding-modules-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          {authBlocked ? (
            <Text variant="caption">{t('onboarding.modules.readOnly')}</Text>
          ) : null}
          {isLoadingData ? (
            <Text variant="caption">{t('onboarding.modules.loadingData')}</Text>
          ) : null}
        </Stack>

        {!authBlocked ? (
          <Text variant="caption">
            {subscriptionId
              ? t('onboarding.modules.subscriptionLinked')
              : t('onboarding.modules.subscriptionMissing')}
          </Text>
        ) : null}

        <Stack spacing="sm">
          {(modules.length > 0 ? modules : [1, 2, 3]).map((entry, index) => {
            const moduleId = entry?.id || `recommended-${index}`;
            const isRecommended = recommendedIds.includes(moduleId);
            const selected = selectedIds.includes(moduleId);
            const title = entry?.name || t(`onboarding.modules.recommendedFallback.${index}.title`);
            const description =
              entry?.description || t(`onboarding.modules.recommendedFallback.${index}.description`);

            return (
              <Card key={moduleId}>
                <Stack spacing="xs">
                  <Text variant="label">{title}</Text>
                  <Text variant="caption">{description}</Text>
                  {isRecommended ? (
                    <Text variant="caption">{t('onboarding.modules.recommendedBadge')}</Text>
                  ) : null}
                  {entry?.id ? (
                    <Button
                      size="small"
                      variant={selected ? 'surface' : 'text'}
                      onPress={() => toggleModuleSelection(entry.id)}
                      accessibilityLabel={t('onboarding.modules.actions.toggleHint')}
                      testID={`onboarding-modules-toggle-${entry.id}`}
                    >
                      {selected
                        ? t('onboarding.modules.actions.remove')
                        : t('onboarding.modules.actions.add')}
                    </Button>
                  ) : null}
                </Stack>
              </Card>
            );
          })}
        </Stack>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="surface"
            onPress={handlePersistSelections}
            loading={isSaving}
            disabled={saveBlocked || isSaving}
            aria-disabled={saveBlocked || isSaving ? 'true' : undefined}
            accessibilityHint={saveBlockedReason || t('onboarding.modules.actions.saveHint')}
            accessibilityLabel={t('onboarding.modules.actions.saveHint')}
            testID="onboarding-modules-save"
          >
            {t('onboarding.modules.actions.save')}
          </Button>
          {saveBlockedReason ? (
            <Text variant="caption" testID="onboarding-modules-save-reason">
              {saveBlockedReason}
            </Text>
          ) : null}
          {authBlocked ? (
            <Button
              size="small"
              variant="text"
              onPress={handleOpenLogin}
              accessibilityLabel={t('onboarding.modules.actions.loginHint')}
              testID="onboarding-modules-login"
            >
              {t('onboarding.modules.actions.login')}
            </Button>
          ) : null}
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            loading={isSaving}
            disabled={isSaving}
            accessibilityLabel={t('onboarding.modules.actions.continueHint')}
            testID="onboarding-modules-continue"
          >
            {t('onboarding.modules.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.modules.actions.backHint')}
            testID="onboarding-modules-back"
          >
            {t('onboarding.modules.actions.back')}
          </Button>
        </Stack>

        {notice ? (
          <Text variant="caption" testID="onboarding-modules-notice">
            {notice}
          </Text>
        ) : null}

        {error ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('onboarding.modules.errors.title')}
            description={error.message}
            testID="onboarding-modules-error"
          />
        ) : null}
      </Stack>
    </Container>
  );
}
