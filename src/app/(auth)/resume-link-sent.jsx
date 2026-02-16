/**
 * Resume Link Sent Route
 * Step 11.1.3: confirmation screen after registration email dispatch.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage, toSingleValue } from '@navigation/onboardingHelpers';

export default function ResumeLinkSentRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resendVerification } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState(null);

  const queryEmail = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);
  const reason = useMemo(() => toSingleValue(params?.reason).trim().toLowerCase(), [params?.reason]);
  const expiresIn = useMemo(() => {
    const value = Number(toSingleValue(params?.expires_in_minutes));
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.round(value);
  }, [params?.expires_in_minutes]);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      setError(null);
      try {
        const [registration, progress] = await Promise.all([
          readRegistrationContext(),
          readOnboardingProgress(),
        ]);
        if (!active) return;

        const resolvedEmail =
          queryEmail ||
          registration?.email ||
          String(progress?.context?.email || '').trim().toLowerCase();

        if (!resolvedEmail) {
          setError({
            code: 'ONBOARDING_CONTEXT_MISSING',
            message: t('onboarding.resumeLinkSent.errors.missingContext'),
          });
          return;
        }

        setEmail(resolvedEmail);
        await saveOnboardingStep('resume_link_sent', { email: resolvedEmail });
        await saveAuthResumeContext({
          identifier: resolvedEmail,
          next_path: '/resume',
          params: { email: resolvedEmail },
        });
      } catch {
        if (!active) return;
        setError({
          code: 'ONBOARDING_CONTEXT_MISSING',
          message: t('onboarding.resumeLinkSent.errors.loadFailed'),
        });
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [queryEmail, t]);

  const handleResend = useCallback(async () => {
    if (isResending || !email) return;

    setNotice('');
    setError(null);
    setIsResending(true);
    try {
      const action = await resendVerification({
        type: 'email',
        email,
      });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        await mergeOnboardingContext({ email });
        setNotice(t('onboarding.resumeLinkSent.feedback.resent'));
        return;
      }

      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setError({ code, message });
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, resendVerification, t]);

  const handleContinue = useCallback(async () => {
    if (!email) return;

    await saveOnboardingStep('resume', { email });
    await saveAuthResumeContext({
      identifier: email,
      next_path: '/resume',
      params: { email },
    });

    router.push({
      pathname: '/resume',
      params: { email },
    });
  }, [email, router]);

  const handleRestart = useCallback(() => {
    router.replace('/landing');
  }, [router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="resume-link-sent-loading" />;
  }

  if (error && !email) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.resumeLinkSent.errors.title')}
        description={error.message}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={handleRestart}
            accessibilityLabel={t('onboarding.resumeLinkSent.actions.restartHint')}
            testID="resume-link-sent-restart"
          >
            {t('onboarding.resumeLinkSent.actions.restart')}
          </Button>
        )}
        testID="resume-link-sent-load-error"
      />
    );
  }

  const continueBlocked = !email || isResending;
  const continueBlockedReason = continueBlocked
    ? t('onboarding.resumeLinkSent.actions.continueBlocked')
    : '';

  return (
    <Container size="medium" testID="resume-link-sent-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          {reason === 'pending_verification' ? (
            <Text variant="caption">{t('onboarding.resumeLinkSent.reason.pendingVerification')}</Text>
          ) : null}
          {expiresIn ? (
            <Text variant="caption">
              {t('onboarding.resumeLinkSent.expiresIn', { minutes: expiresIn })}
            </Text>
          ) : null}
        </Stack>

        <Card>
          <Stack spacing="sm">
            <Text variant="label">{t('onboarding.resumeLinkSent.emailLabel')}</Text>
            <Text variant="body">{email}</Text>
            <Text variant="caption">{t('onboarding.resumeLinkSent.hint')}</Text>
          </Stack>
        </Card>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            disabled={continueBlocked}
            aria-disabled={continueBlocked ? 'true' : undefined}
            accessibilityHint={continueBlocked ? continueBlockedReason : t('onboarding.resumeLinkSent.actions.continueHint')}
            accessibilityLabel={t('onboarding.resumeLinkSent.actions.continueHint')}
            testID="resume-link-sent-continue"
          >
            {t('onboarding.resumeLinkSent.actions.continue')}
          </Button>
          {continueBlockedReason ? (
            <Text variant="caption" testID="resume-link-sent-continue-reason">
              {continueBlockedReason}
            </Text>
          ) : null}
          <Button
            size="small"
            variant="text"
            onPress={handleResend}
            loading={isResending}
            disabled={!email || isResending}
            accessibilityLabel={t('onboarding.resumeLinkSent.actions.resendHint')}
            testID="resume-link-sent-resend"
          >
            {t('onboarding.resumeLinkSent.actions.resend')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleRestart}
            accessibilityLabel={t('onboarding.resumeLinkSent.actions.restartHint')}
            testID="resume-link-sent-restart-secondary"
          >
            {t('onboarding.resumeLinkSent.actions.restart')}
          </Button>
        </Stack>

        {notice ? (
          <Text variant="caption" testID="resume-link-sent-notice">
            {notice}
          </Text>
        ) : null}

        {error ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('onboarding.resumeLinkSent.errors.title')}
            description={error.message}
            testID="resume-link-sent-error"
          />
        ) : null}
      </Stack>
    </Container>
  );
}
