/**
 * useLoginScreen Hook
 * Manages login form state, validation, and navigation.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { readRegistrationContext } from '@navigation/registrationContext';
import { LOGIN_FORM_FIELDS } from './types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IDENTIFIER_LENGTH = 320;
const MAX_PASSWORD_LENGTH = 128;

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

const useLoginScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { login } = useAuth();

  const [form, setForm] = useState({
    identifier: '',
    password: '',
    rememberSession: false,
  });
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const prefilledEmail = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      try {
        const registration = await readRegistrationContext();
        if (!active) return;
        const identifier = prefilledEmail || registration?.email || '';
        setForm((prev) => ({
          ...prev,
          identifier,
        }));
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [prefilledEmail]);

  const normalizeFieldValue = useCallback((key, value) => {
    if (key === LOGIN_FORM_FIELDS.IDENTIFIER) {
      return String(value || '').trim().slice(0, MAX_IDENTIFIER_LENGTH);
    }
    if (key === LOGIN_FORM_FIELDS.PASSWORD) {
      return String(value || '').slice(0, MAX_PASSWORD_LENGTH);
    }
    return value;
  }, []);

  const validateField = useCallback(
    (key, sourceForm) => {
      if (key === LOGIN_FORM_FIELDS.IDENTIFIER) {
        const value = String(sourceForm.identifier || '').trim();
        if (!value) return t('auth.login.validation.identifierRequired');
        if (value.includes('@')) {
          if (!emailRegex.test(value.toLowerCase())) {
            return t('auth.login.validation.identifierInvalid');
          }
          return '';
        }
        if (!/^[0-9]+$/.test(value) || value.length < 10) {
          return t('auth.login.validation.identifierInvalid');
        }
        return '';
      }

      if (key === LOGIN_FORM_FIELDS.PASSWORD) {
        if (!sourceForm.password) return t('auth.login.validation.passwordRequired');
        if (sourceForm.password.length > MAX_PASSWORD_LENGTH) {
          return t('forms.validation.maxLength', { max: MAX_PASSWORD_LENGTH });
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
        identifier: validateField(LOGIN_FORM_FIELDS.IDENTIFIER, sourceForm),
        password: validateField(LOGIN_FORM_FIELDS.PASSWORD, sourceForm),
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
        const next = { ...prev, [key]: normalizeFieldValue(key, value) };
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
    },
    [normalizeFieldValue, validateField]
  );

  const toggleRememberSession = useCallback(() => {
    setForm((prev) => ({ ...prev, rememberSession: !prev.rememberSession }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false;
    setSubmitError(null);

    const isValid = validate();
    if (!isValid) return false;

    setIsSubmitting(true);
    try {
      const identifier = form.identifier.trim();
      const isEmail = identifier.includes('@');
      const payload = {
        password: form.password,
        remember_me: form.rememberSession,
      };
      if (isEmail) {
        payload.email = identifier.toLowerCase();
      } else {
        payload.phone = identifier.replace(/[^\d]/g, '');
      }

      const action = await login(payload);
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        if (action?.payload?.requiresFacilitySelection) {
          setSubmitError({
            code: 'MULTIPLE_TENANTS',
            message: t('errors.codes.MULTIPLE_TENANTS'),
          });
          return false;
        }
        router.replace('/dashboard');
        return true;
      }

      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [form.identifier, form.password, form.rememberSession, isSubmitting, login, router, t, validate]);

  const goToRegister = useCallback(() => {
    router.push('/landing');
  }, [router]);

  const goToVerifyEmail = useCallback(() => {
    router.push({
      pathname: '/verify-email',
      params: {
        email: form.identifier.includes('@') ? form.identifier.trim().toLowerCase() : '',
      },
    });
  }, [form.identifier, router]);

  return {
    form,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    toggleRememberSession,
    handleSubmit,
    goToRegister,
    goToVerifyEmail,
  };
};

export default useLoginScreen;

