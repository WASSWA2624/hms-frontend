/**
 * useResetPasswordScreen Hook
 * Handles password reset confirmation flow.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import {
  MAX_PASSWORD_LENGTH,
  MAX_TOKEN_LENGTH,
  RESET_PASSWORD_FORM_FIELDS,
} from './types';

const passwordUppercase = /[A-Z]/;
const passwordLowercase = /[a-z]/;
const passwordNumber = /[0-9]/;
const passwordSpecial = /[^A-Za-z0-9]/;

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

const useResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { resetPassword } = useAuth();

  const tokenParam = useMemo(() => toSingleValue(params?.token).trim(), [params?.token]);
  const emailParam = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  const [form, setForm] = useState({
    token: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      token: tokenParam || prev.token,
    }));
    setIsHydrating(false);
  }, [tokenParam]);

  useEffect(() => {
    if (!isSubmitted) return undefined;
    const timeoutId = setTimeout(() => {
      router.replace({
        pathname: '/login',
        params: {
          email: emailParam,
        },
      });
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [emailParam, isSubmitted, router]);

  const validateField = useCallback(
    (key, sourceForm) => {
      if (key === RESET_PASSWORD_FORM_FIELDS.TOKEN) {
        const value = String(sourceForm.token || '').trim();
        if (!value) return t('auth.resetPassword.validation.tokenRequired');
        return '';
      }

      if (key === RESET_PASSWORD_FORM_FIELDS.NEW_PASSWORD) {
        const value = String(sourceForm.new_password || '');
        if (!value) return t('auth.resetPassword.validation.passwordRequired');
        if (value.length < 8) return t('auth.resetPassword.validation.passwordMinLength');
        if (!passwordUppercase.test(value)) return t('auth.resetPassword.validation.passwordUppercase');
        if (!passwordLowercase.test(value)) return t('auth.resetPassword.validation.passwordLowercase');
        if (!passwordNumber.test(value)) return t('auth.resetPassword.validation.passwordNumber');
        if (!passwordSpecial.test(value)) return t('auth.resetPassword.validation.passwordSpecial');
        return '';
      }

      if (key === RESET_PASSWORD_FORM_FIELDS.CONFIRM_PASSWORD) {
        const value = String(sourceForm.confirm_password || '');
        if (!value) return t('auth.resetPassword.validation.confirmRequired');
        if (value !== String(sourceForm.new_password || '')) {
          return t('auth.resetPassword.fields.confirm.errorMismatch');
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
        token: validateField(RESET_PASSWORD_FORM_FIELDS.TOKEN, sourceForm),
        new_password: validateField(RESET_PASSWORD_FORM_FIELDS.NEW_PASSWORD, sourceForm),
        confirm_password: validateField(RESET_PASSWORD_FORM_FIELDS.CONFIRM_PASSWORD, sourceForm),
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
            key === RESET_PASSWORD_FORM_FIELDS.TOKEN
              ? String(value || '').trim().slice(0, MAX_TOKEN_LENGTH)
              : String(value || '').slice(0, MAX_PASSWORD_LENGTH),
        };
        const message = validateField(key, next);
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          if (message) nextErrors[key] = message;
          else delete nextErrors[key];

          if (key === RESET_PASSWORD_FORM_FIELDS.NEW_PASSWORD || key === RESET_PASSWORD_FORM_FIELDS.CONFIRM_PASSWORD) {
            const confirmMessage = validateField(RESET_PASSWORD_FORM_FIELDS.CONFIRM_PASSWORD, next);
            if (confirmMessage) nextErrors.confirm_password = confirmMessage;
            else delete nextErrors.confirm_password;
          }
          return nextErrors;
        });
        return next;
      });
      setSubmitError(null);
      setIsSubmitted(false);
    },
    [validateField]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false;
    const sourceForm = {
      token: form.token.trim(),
      new_password: form.new_password,
      confirm_password: form.confirm_password,
    };
    const isValid = validate(sourceForm);
    if (!isValid) return false;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const action = await resetPassword(sourceForm);
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        setIsSubmitted(true);
        return true;
      }
      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [form.confirm_password, form.new_password, form.token, isSubmitting, resetPassword, t, validate]);

  const goToLogin = useCallback(() => {
    router.replace({
      pathname: '/login',
      params: {
        email: emailParam,
      },
    });
  }, [emailParam, router]);

  const submitBlockedReason = useMemo(() => {
    if (isSubmitting) return t('auth.accessibility.actions.submitting');
    if (!form.token.trim()) return t('auth.resetPassword.validation.tokenRequired');
    if (!form.new_password) return t('auth.resetPassword.validation.passwordRequired');
    if (!form.confirm_password) return t('auth.resetPassword.validation.confirmRequired');
    return '';
  }, [form.confirm_password, form.new_password, form.token, isSubmitting, t]);

  return {
    form,
    errors,
    isHydrating,
    isSubmitting,
    isSubmitted,
    submitError,
    submitBlockedReason,
    isSubmitDisabled: Boolean(submitBlockedReason),
    setFieldValue,
    handleSubmit,
    goToLogin,
  };
};

export default useResetPasswordScreen;

