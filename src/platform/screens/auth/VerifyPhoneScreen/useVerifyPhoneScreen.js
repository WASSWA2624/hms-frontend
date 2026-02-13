/**
 * useVerifyPhoneScreen Hook
 * Handles phone verification and resend flow.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { readAuthResumeContext } from '@navigation/authResumeContext';
import { readRegistrationContext } from '@navigation/registrationContext';
import { VERIFY_PHONE_MAX_LENGTH, VERIFY_PHONE_TOKEN_LENGTH } from './types';

const phoneRegex = /^[0-9]{10,15}$/;

const toSingleValue = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
};

const normalizePhone = (value) => String(value || '').replace(/[^\d]/g, '');

const resolveErrorMessage = (code, message, t) => {
  if (!code) return message || t('errors.fallback.message');
  const key = `errors.codes.${code}`;
  const translated = t(key);
  return translated !== key ? translated : message || t('errors.fallback.message');
};

const useVerifyPhoneScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { verifyPhone, resendVerification } = useAuth();
  const autoVerifyTriggeredRef = useRef(false);

  const tokenParam = useMemo(() => toSingleValue(params?.token).trim(), [params?.token]);
  const phoneParam = useMemo(() => normalizePhone(toSingleValue(params?.phone)), [params?.phone]);

  const [form, setForm] = useState({
    token: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      try {
        const [registration, resume] = await Promise.all([
          readRegistrationContext(),
          readAuthResumeContext(),
        ]);
        if (!active) return;
        const resumeIdentifier = String(resume?.identifier || '');
        const resumePhone = resumeIdentifier && !resumeIdentifier.includes('@') ? normalizePhone(resumeIdentifier) : '';
        setForm((prev) => ({
          ...prev,
          token: tokenParam || '',
          phone: phoneParam || normalizePhone(registration?.phone || '') || resumePhone,
        }));
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [phoneParam, tokenParam]);

  const validateField = useCallback(
    (key, sourceForm) => {
      if (key === 'token') {
        const value = String(sourceForm.token || '').trim();
        if (!value) return t('auth.verifyPhone.validation.tokenRequired');
        if (value.length > VERIFY_PHONE_TOKEN_LENGTH) {
          return t('forms.validation.maxLength', { max: VERIFY_PHONE_TOKEN_LENGTH });
        }
        return '';
      }

      if (key === 'phone') {
        const value = normalizePhone(sourceForm.phone);
        if (!value) return t('auth.verifyPhone.validation.phoneRequired');
        if (!phoneRegex.test(value)) return t('auth.verifyPhone.validation.phoneInvalid');
        return '';
      }

      return '';
    },
    [t]
  );

  const validate = useCallback(
    (sourceForm = form) => {
      const next = {
        token: validateField('token', sourceForm),
        phone: validateField('phone', sourceForm),
      };
      const compact = Object.fromEntries(Object.entries(next).filter(([, value]) => Boolean(value)));
      setErrors(compact);
      return Object.keys(compact).length === 0;
    },
    [form, validateField]
  );

  const setFieldValue = useCallback(
    (key, value) => {
      setForm((prev) => {
        const next = {
          ...prev,
          [key]:
            key === 'phone'
              ? normalizePhone(String(value || '')).slice(0, VERIFY_PHONE_MAX_LENGTH)
              : String(value || '').trim().slice(0, VERIFY_PHONE_TOKEN_LENGTH),
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
      setResendMessage('');
    },
    [validateField]
  );

  const submitVerification = useCallback(
    async (tokenValue, phoneValue) => {
      const action = await verifyPhone({ token: tokenValue, phone: phoneValue });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        setIsVerified(true);
        setSubmitError(null);
        return true;
      }

      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    },
    [t, verifyPhone]
  );

  useEffect(() => {
    if (!tokenParam || isHydrating || autoVerifyTriggeredRef.current) return;
    autoVerifyTriggeredRef.current = true;
    const phoneValue = normalizePhone(form.phone || phoneParam);
    if (!phoneValue) return;
    setIsVerifying(true);
    submitVerification(tokenParam, phoneValue).finally(() => setIsVerifying(false));
  }, [form.phone, isHydrating, phoneParam, submitVerification, tokenParam]);

  useEffect(() => {
    if (!isVerified) return undefined;
    const timeoutId = setTimeout(() => {
      router.replace({
        pathname: '/login',
        params: {
          identifier: normalizePhone(form.phone),
        },
      });
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [form.phone, isVerified, router]);

  const handleSubmit = useCallback(async () => {
    if (isVerifying) return false;
    const sourceForm = {
      token: form.token.trim(),
      phone: normalizePhone(form.phone),
    };
    const isValid = validate(sourceForm);
    if (!isValid) return false;

    setIsVerifying(true);
    setSubmitError(null);
    setResendMessage('');
    try {
      return await submitVerification(sourceForm.token, sourceForm.phone);
    } finally {
      setIsVerifying(false);
    }
  }, [form.phone, form.token, isVerifying, submitVerification, validate]);

  const handleResend = useCallback(async () => {
    if (isResending) return false;
    const phoneValue = normalizePhone(form.phone);
    const phoneError = validateField('phone', { ...form, phone: phoneValue });
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return false;
    }

    setIsResending(true);
    setSubmitError(null);
    setResendMessage('');
    try {
      const action = await resendVerification({
        type: 'phone',
        phone: phoneValue,
      });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        setResendMessage(t('auth.verifyPhone.feedback.resent'));
        return true;
      }
      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    } finally {
      setIsResending(false);
    }
  }, [form, isResending, resendVerification, t, validateField]);

  const goToLogin = useCallback(() => {
    router.replace({
      pathname: '/login',
      params: {
        identifier: normalizePhone(form.phone),
      },
    });
  }, [form.phone, router]);

  const submitBlockedReason = useMemo(() => {
    if (isVerifying) return t('auth.accessibility.actions.submitting');
    if (!form.phone.trim()) return t('auth.verifyPhone.validation.phoneRequired');
    if (!form.token.trim()) return t('auth.verifyPhone.validation.tokenRequired');
    return '';
  }, [form.phone, form.token, isVerifying, t]);

  return {
    form,
    errors,
    isHydrating,
    isVerifying,
    isResending,
    isVerified,
    submitError,
    resendMessage,
    submitBlockedReason,
    isSubmitDisabled: Boolean(submitBlockedReason || isResending || isVerified),
    setFieldValue,
    handleSubmit,
    handleResend,
    goToLogin,
  };
};

export default useVerifyPhoneScreen;

