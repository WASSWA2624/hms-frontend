/**
 * Checklist Route
 * Step 11.1.7: facility-specific first-run checklist (local non-authoritative progression).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  mergeOnboardingContext,
  readOnboardingEntry,
  readOnboardingProgress,
  readRegistrationContext,
  saveOnboardingStep,
} from '@navigation';

const CHECKLIST_BY_FACILITY = {
  CLINIC: ['register_patient', 'book_appointment', 'create_invoice', 'record_consultation'],
  HOSPITAL: ['add_branch', 'invite_staff', 'admit_patient', 'generate_bill'],
  LAB: ['add_test', 'receive_sample', 'enter_result', 'generate_report'],
  PHARMACY: ['add_drug', 'sell_item', 'view_stock_report'],
  OTHER: ['add_ambulance', 'receive_request', 'dispatch_unit'],
};

export default function OnboardingChecklistRoute() {
  const { t } = useI18n();
  const router = useRouter();

  const [isHydrating, setIsHydrating] = useState(true);
  const [facilityType, setFacilityType] = useState('CLINIC');
  const [completedIds, setCompletedIds] = useState([]);
  const [error, setError] = useState(null);

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
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
      const normalizedType = CHECKLIST_BY_FACILITY[resolvedType] ? resolvedType : 'CLINIC';

      const completed = Array.isArray(progress?.context?.completed_checklist_ids)
        ? progress.context.completed_checklist_ids.filter(Boolean)
        : [];

      setFacilityType(normalizedType);
      setCompletedIds(completed);
      await saveOnboardingStep('checklist', {
        facility_type: normalizedType,
        completed_checklist_ids: completed,
      });
    } catch {
      setError({
        code: 'ONBOARDING_CONTEXT_MISSING',
        message: t('onboarding.checklist.errors.loadFailed'),
      });
    } finally {
      setIsHydrating(false);
    }
  }, [t]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const checklistItems = useMemo(() => CHECKLIST_BY_FACILITY[facilityType] || CHECKLIST_BY_FACILITY.CLINIC, [facilityType]);

  const toggleItem = useCallback(async (itemId) => {
    setCompletedIds((prev) => {
      const hasItem = prev.includes(itemId);
      const next = hasItem ? prev.filter((entry) => entry !== itemId) : [...prev, itemId];
      mergeOnboardingContext({
        completed_checklist_ids: next,
        facility_type: facilityType,
      });
      return next;
    });
  }, [facilityType]);

  const handleContinue = useCallback(async () => {
    await saveOnboardingStep('modules', {
      facility_type: facilityType,
      completed_checklist_ids: completedIds,
    });
    router.push('/modules');
  }, [completedIds, facilityType, router]);

  const handleBack = useCallback(() => {
    router.replace('/welcome');
  }, [router]);

  const handleRetry = useCallback(() => {
    hydrate();
  }, [hydrate]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-checklist-loading" />;
  }

  if (error) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.checklist.errors.title')}
        description={error.message}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={handleRetry}
            accessibilityLabel={t('common.retry')}
            testID="onboarding-checklist-retry"
          >
            {t('common.retry')}
          </Button>
        )}
        testID="onboarding-checklist-error"
      />
    );
  }

  const completedCount = completedIds.length;
  const totalCount = checklistItems.length;

  return (
    <Container size="medium" testID="onboarding-checklist-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          <Text variant="caption">
            {t('onboarding.checklist.progress', { completed: completedCount, total: totalCount })}
          </Text>
          <Text variant="caption">{t('onboarding.checklist.readOnlyNote')}</Text>
        </Stack>

        <Stack spacing="sm">
          {checklistItems.map((itemId) => {
            const completed = completedIds.includes(itemId);
            return (
              <Card key={itemId}>
                <Stack spacing="xs">
                  <Text variant="label">{t(`onboarding.checklist.items.${itemId}.title`)}</Text>
                  <Text variant="caption">{t(`onboarding.checklist.items.${itemId}.description`)}</Text>
                  <Button
                    size="small"
                    variant={completed ? 'surface' : 'text'}
                    onPress={() => toggleItem(itemId)}
                    accessibilityLabel={t('onboarding.checklist.actions.toggleHint')}
                    testID={`onboarding-checklist-toggle-${itemId}`}
                  >
                    {completed
                      ? t('onboarding.checklist.actions.markIncomplete')
                      : t('onboarding.checklist.actions.markDone')}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </Stack>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            accessibilityLabel={t('onboarding.checklist.actions.continueHint')}
            testID="onboarding-checklist-continue"
          >
            {t('onboarding.checklist.actions.continue')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.checklist.actions.backHint')}
            testID="onboarding-checklist-back"
          >
            {t('onboarding.checklist.actions.back')}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
