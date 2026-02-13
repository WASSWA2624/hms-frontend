/**
 * useForgotPasswordScreen Hook
 * Handles password reset request flow.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { readRegistrationContext } from '@navigation/registrationContext';
import {
  FORGOT_PASSWORD_FORM_FIELDS,
  MAX_EMAIL_LENGTH,
  MAX_TENANT_LENGTH,
} from './types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

const useForgotPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { forgotPassword } = useAuth();

  const emailParam = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);
  const tenantParam = useMemo(() => toSingleValue(params?.tenant_id).trim(), [params?.tenant_id]);

  const [form, setForm] = useState({
    email: '',
    tenant_id: '',
  });
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
          tenant_id: tenantParam || registration?.tenant_id || '',
        }));
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [emailParam, tenantParam]);

  const validateField = useCallback(
    (key, sourceForm) => {
      if (key === FORGOT_PASSWORD_FORM_FIELDS.EMAIL) {
        const value = String(sourceForm.email || '').trim().toLowerCase();
        if (!value) return t('auth.forgotPassword.validation.emailRequired');
        if (!emailRegex.test(value)) return t('auth.forgotPassword.validation.emailInvalid');
        return '';
      }

      if (key === FORGOT_PASSWORD_FORM_FIELDS.TENANT_ID) {
        const value = String(sourceForm.tenant_id || '').trim();
        if (!value) return t('auth.forgotPassword.validation.tenantRequired');
        if (!uuidRegex.test(value)) return t('forms.validation.invalidUuid');
        return '';
      }

      return '';
    },
    [t]
  );

  const validate = useCallback(
    (sourceForm = form) => {
      const next = {
        email: validateField(FORGOT_PASSWORD_FORM_FIELDS.EMAIL, sourceForm),
        tenant_id: validateField(FORGOT_PASSWORD_FORM_FIELDS.TENANT_ID, sourceForm),
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
            key === FORGOT_PASSWORD_FORM_FIELDS.EMAIL
              ? String(value || '').trim().slice(0, MAX_EMAIL_LENGTH)
              : String(value || '').trim().slice(0, MAX_TENANT_LENGTH),
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
      setIsSubmitted(false);
    },
    [validateField]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false;
    const sourceForm = {
      email: form.email.trim().toLowerCase(),
      tenant_id: form.tenant_id.trim(),
    };
    const isValid = validate(sourceForm);
    if (!isValid) return false;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const action = await forgotPassword(sourceForm);
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
  }, [forgotPassword, form.email, form.tenant_id, isSubmitting, t, validate]);

  const goToLogin = useCallback(() => {
    router.replace({
      pathname: '/login',
      params: {
        email: form.email.trim().toLowerCase(),
      },
    });
  }, [form.email, router]);

  const goToResetPassword = useCallback(() => {
    router.push({
      pathname: '/reset-password',
      params: {
        email: form.email.trim().toLowerCase(),
      },
    });
  }, [form.email, router]);

  const submitBlockedReason = useMemo(() => {
    if (isSubmitting) return t('auth.accessibility.actions.submitting');
    if (!form.email.trim()) return t('auth.forgotPassword.validation.emailRequired');
    if (!form.tenant_id.trim()) return t('auth.forgotPassword.validation.tenantRequired');
    return '';
  }, [form.email, form.tenant_id, isSubmitting, t]);

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
    goToResetPassword,
  };
};

export default useForgotPasswordScreen;

