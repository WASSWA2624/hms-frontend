/**
 * Resume Onboarding Route
 * Step 11.1.4: token handler for onboarding resume links.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import {
  Button,
  Container,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Stack,
  Text,
  TextField,
} from '@platform/components';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage, toSingleValue } from '@navigation/onboardingHelpers';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function OnboardingResumeRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  const autoVerifyTriggeredRef = useRef(false);

  const tokenParam = useMemo(() => toSingleValue(params?.token).trim(), [params?.token]);
  const emailParam = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  const [form, setForm] = useState({ email: '', token: '' });
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [notice, setNotice] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      setSubmitError(null);
      try {
        const [registration, progress] = await Promise.all([
          readRegistrationContext(),
          readOnboardingProgress(),
        ]);
        if (!active) return;
        const resolvedEmail =
          emailParam ||
          registration?.email ||
          String(progress?.context?.email || '').trim().toLowerCase();

        setForm({
          email: resolvedEmail || '',
          token: tokenParam || '',
        });

        await saveOnboardingStep('resume', {
          email: resolvedEmail,
          facility_id: registration?.facility_id || progress?.context?.facility_id || '',
          tenant_id: registration?.tenant_id || progress?.context?.tenant_id || '',
        });
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [emailParam, tokenParam]);

  const validateField = useCallback((key, source) => {
    if (key === 'email') {
      const email = String(source.email || '').trim().toLowerCase();
      if (!email) return t('onboarding.resume.validation.emailRequired');
      if (!emailRegex.test(email)) return t('onboarding.resume.validation.emailInvalid');
      return '';
    }
    if (key === 'token') {
      const token = String(source.token || '').trim();
      if (!token) return t('onboarding.resume.validation.tokenRequired');
      return '';
    }
    return '';
  }, [t]);

  const validate = useCallback((source = form) => {
    const next = {
      email: validateField('email', source),
      token: validateField('token', source),
    };
    const compact = Object.fromEntries(Object.entries(next).filter(([, value]) => Boolean(value)));
    setErrors(compact);
    return Object.keys(compact).length === 0;
  }, [form, validateField]);

  const setFieldValue = useCallback((key, value) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [key]: key === 'email' ? String(value || '').trim().toLowerCase() : String(value || '').trim(),
      };
      const message = validateField(key, next);
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        if (message) nextErrors[key] = message;
        else delete nextErrors[key];
        return nextErrors;
      });
      return next;
    });
    setSubmitError(null);
    setNotice('');
  }, [validateField]);

  const completeVerification = useCallback(async (emailValue) => {
    await saveOnboardingStep('provisioning', { email: emailValue });
    await saveAuthResumeContext({
      identifier: emailValue || form.email,
      next_path: '/provisioning',
      params: emailValue ? { email: emailValue } : {},
    });
    setIsVerified(true);
    setNotice(t('onboarding.resume.feedback.verified'));
    setTimeout(() => {
      router.replace({
        pathname: '/provisioning',
        params: emailValue ? { email: emailValue } : {},
      });
    }, 500);
  }, [form.email, router, t]);

  const handleVerify = useCallback(async (payload) => {
    const action = await verifyEmail(payload);
    const status = action?.meta?.requestStatus;
    if (status === 'fulfilled') {
      const normalizedEmail = String(payload.email || form.email || '').trim().toLowerCase();
      await mergeOnboardingContext({ email: normalizedEmail });
      await completeVerification(normalizedEmail);
      return true;
    }

    const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
    const message = resolveErrorMessage(code, action?.payload?.message, t);
    setSubmitError({ code, message });
    return false;
  }, [completeVerification, form.email, mergeOnboardingContext, t, verifyEmail]);

  useEffect(() => {
    if (!tokenParam || isHydrating || autoVerifyTriggeredRef.current) return;
    autoVerifyTriggeredRef.current = true;
    setIsVerifying(true);
    handleVerify({
      token: tokenParam,
      email: emailParam || undefined,
    }).finally(() => setIsVerifying(false));
  }, [emailParam, handleVerify, isHydrating, tokenParam]);

  const handleSubmit = useCallback(async () => {
    if (isVerifying || isVerified) return false;

    setSubmitError(null);
    setNotice('');

    const source = {
      email: String(form.email || '').trim().toLowerCase(),
      token: String(form.token || '').trim(),
    };
    if (!validate(source)) return false;

    setIsVerifying(true);
    try {
      return await handleVerify({
        token: source.token,
        email: source.email,
      });
    } finally {
      setIsVerifying(false);
    }
  }, [form.email, form.token, handleVerify, isVerified, isVerifying, validate]);

  const handleResend = useCallback(async () => {
    if (isResending || isVerified) return false;

    const email = String(form.email || '').trim().toLowerCase();
    const emailError = validateField('email', { ...form, email });
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return false;
    }

    setSubmitError(null);
    setNotice('');
    setIsResending(true);
    try {
      const action = await resendVerification({
        type: 'email',
        email,
      });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        await mergeOnboardingContext({ email });
        setNotice(t('onboarding.resume.feedback.resent'));
        return true;
      }

      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    } finally {
      setIsResending(false);
    }
  }, [form, isResending, isVerified, mergeOnboardingContext, resendVerification, t, validateField]);

  const handleBack = useCallback(() => {
    router.replace({
      pathname: '/resume-link-sent',
      params: form.email ? { email: form.email } : {},
    });
  }, [form.email, router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-resume-loading" />;
  }

  const getValidationState = (field) => (errors[field] ? 'error' : 'default');
  const verifyDisabled = isVerifying || isResending || isVerified;
  const verifyDisabledReason = verifyDisabled
    ? t('onboarding.resume.actions.verifyDisabled')
    : '';

  return (
    <Container size="medium" testID="onboarding-resume-screen">
      <Stack spacing="md">
        <Stack spacing="sm">
          <TextField
            label={t('onboarding.resume.fields.email')}
            placeholder={t('onboarding.resume.placeholders.email')}
            value={form.email}
            onChangeText={(value) => setFieldValue('email', value)}
            errorMessage={errors.email}
            validationState={getValidationState('email')}
            density="compact"
            maxLength={320}
            required
            testID="onboarding-resume-email"
          />
          <TextField
            label={t('onboarding.resume.fields.token')}
            placeholder={t('onboarding.resume.placeholders.token')}
            value={form.token}
            onChangeText={(value) => setFieldValue('token', value)}
            errorMessage={errors.token}
            validationState={getValidationState('token')}
            density="compact"
            maxLength={255}
            required
            testID="onboarding-resume-token"
          />
        </Stack>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleSubmit}
            loading={isVerifying}
            disabled={verifyDisabled}
            aria-disabled={verifyDisabled ? 'true' : undefined}
            accessibilityHint={verifyDisabledReason || t('onboarding.resume.actions.verifyHint')}
            accessibilityLabel={t('onboarding.resume.actions.verifyHint')}
            testID="onboarding-resume-verify"
          >
            {t('onboarding.resume.actions.verify')}
          </Button>
          {verifyDisabledReason ? (
            <Text variant="caption" testID="onboarding-resume-verify-reason">
              {verifyDisabledReason}
            </Text>
          ) : null}
          <Button
            size="small"
            variant="text"
            onPress={handleResend}
            loading={isResending}
            disabled={isResending || isVerified}
            accessibilityLabel={t('onboarding.resume.actions.resendHint')}
            testID="onboarding-resume-resend"
          >
            {t('onboarding.resume.actions.resend')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.resume.actions.backHint')}
            testID="onboarding-resume-back"
          >
            {t('onboarding.resume.actions.back')}
          </Button>
        </Stack>

        {notice ? (
          <Text variant="caption" testID="onboarding-resume-notice">
            {notice}
          </Text>
        ) : null}

        {submitError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('onboarding.resume.errors.title')}
            description={submitError.message}
            testID="onboarding-resume-error"
          />
        ) : null}
      </Stack>
    </Container>
  );
}

export default withRouteTermsAcceptance(OnboardingResumeRoute, { screenKey: 'onboarding-resume' });
