/**
 * useVerifyEmailScreen Hook
 * Handles email verification by code or magic link token.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { clearAuthResumeContext, saveAuthResumeContext } from '@navigation/authResumeContext';
import { readRegistrationContext } from '@navigation/registrationContext';
import { VERIFY_CODE_LENGTH } from './types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toSingleValue = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
};

const resolveErrorMessage = (code, message, t) => {
  if (!code) return message || t('errors.fallback.message');
  const key = `errors.codes.${code}`;
  const translated = t(key);
  return translated !== key ? translated : message || t('errors.fallback.message');
};

const useVerifyEmailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { verifyEmail, resendVerification } = useAuth();
  const autoVerifyTriggeredRef = useRef(false);

  const tokenParam = useMemo(() => toSingleValue(params?.token).trim(), [params?.token]);
  const emailParam = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  const [form, setForm] = useState({
    email: '',
    token: '',
  });
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resendMessage, setResendMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      try {
        const registration = await readRegistrationContext();
        if (!active) return;
        setForm((prev) => ({
          ...prev,
          email: emailParam || registration?.email || '',
          token: tokenParam || '',
        }));
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [emailParam, tokenParam]);

  const validateField = useCallback(
    (key, sourceForm) => {
      if (key === 'email') {
        const value = sourceForm.email.trim().toLowerCase();
        if (!value) return t('auth.verifyEmail.validation.emailRequired');
        if (!emailRegex.test(value)) return t('auth.verifyEmail.validation.emailInvalid');
        return '';
      }

      if (key === 'token') {
        const value = sourceForm.token.trim();
        if (!value) return t('auth.verifyEmail.validation.codeRequired');
        if (value.length > VERIFY_CODE_LENGTH) {
          return t('forms.validation.maxLength', { max: VERIFY_CODE_LENGTH });
        }
        return '';
      }

      return '';
    },
    [t]
  );

  const validate = useCallback(
    (sourceForm = form) => {
      const next = {
        email: validateField('email', sourceForm),
        token: validateField('token', sourceForm),
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
            key === 'email'
              ? String(value || '').trim().slice(0, 320)
              : String(value || '').trim().slice(0, VERIFY_CODE_LENGTH),
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

  const markVerified = useCallback(() => {
    setIsVerified(true);
    setSubmitError(null);
  }, []);

  const submitVerification = useCallback(
    async (tokenValue, emailValue) => {
      const action = await verifyEmail({
        token: tokenValue,
        email: emailValue || undefined,
      });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        markVerified();
        return true;
      }

      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    },
    [markVerified, t, verifyEmail]
  );

  useEffect(() => {
    if (!tokenParam || isHydrating || autoVerifyTriggeredRef.current) return;
    autoVerifyTriggeredRef.current = true;
    setIsVerifying(true);
    submitVerification(tokenParam, emailParam)
      .finally(() => setIsVerifying(false));
  }, [emailParam, isHydrating, submitVerification, tokenParam]);

  useEffect(() => {
    if (!isVerified) return;
    const verifiedEmail = form.email.trim().toLowerCase();
    if (verifiedEmail) {
      saveAuthResumeContext({
        identifier: verifiedEmail,
        next_path: '/login',
        params: { email: verifiedEmail },
      });
    }
    const timeoutId = setTimeout(() => {
      router.replace({
        pathname: '/login',
        params: { email: verifiedEmail },
      });
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [form.email, isVerified, router]);

  const handleSubmit = useCallback(async () => {
    if (isVerifying) return false;
    setSubmitError(null);
    setResendMessage('');

    const isValid = validate();
    if (!isValid) return false;

    setIsVerifying(true);
    try {
      return await submitVerification(form.token.trim(), form.email.trim().toLowerCase());
    } finally {
      setIsVerifying(false);
    }
  }, [form.email, form.token, isVerifying, submitVerification, validate]);

  const handleResend = useCallback(async () => {
    if (isResending) return false;
    const emailValue = form.email.trim().toLowerCase();
    const emailError = validateField('email', { ...form, email: emailValue });
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return false;
    }

    setIsResending(true);
    setSubmitError(null);
    try {
      const action = await resendVerification({
        type: 'email',
        email: emailValue,
      });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        await saveAuthResumeContext({
          identifier: emailValue,
          next_path: '/verify-email',
          params: { email: emailValue },
        });
        setResendMessage(t('auth.verifyEmail.feedback.resent'));
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
    const emailValue = form.email.trim().toLowerCase();
    if (emailValue) {
      saveAuthResumeContext({
        identifier: emailValue,
        next_path: '/login',
        params: { email: emailValue },
      });
    } else {
      clearAuthResumeContext();
    }
    router.replace({
      pathname: '/login',
      params: { email: emailValue },
    });
  }, [form.email, router]);

  return {
    form,
    errors,
    isHydrating,
    isVerifying,
    isResending,
    isVerified,
    submitError,
    resendMessage,
    setFieldValue,
    handleSubmit,
    handleResend,
    goToLogin,
  };
};

export default useVerifyEmailScreen;
