/**
 * useLoginScreen Hook
 * Manages login form state, validation, and navigation.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { clearAuthResumeContext, saveAuthResumeContext } from '@navigation/authResumeContext';
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
  const { identify, login } = useAuth();

  const stepParam = useMemo(() => toSingleValue(params?.step).trim().toLowerCase(), [params?.step]);

  const [form, setForm] = useState({
    identifier: '',
    password: '',
    tenant_id: '',
    rememberSession: false,
  });
  const [step, setStep] = useState('identifier');
  const [tenantOptions, setTenantOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const prefilledEmail = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  useEffect(() => {
    if (!stepParam) return;
    if (stepParam === 'password') {
      setStep('password');
      return;
    }
    setStep('identifier');
  }, [stepParam]);

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
    if (key === LOGIN_FORM_FIELDS.TENANT_ID) {
      return String(value || '').trim();
    }
    return value;
  }, []);

  const validateField = useCallback(
    (key, sourceForm, currentStep = step) => {
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
        if (currentStep !== 'password') return '';
        if (!sourceForm.password) return t('auth.login.validation.passwordRequired');
        if (sourceForm.password.length > MAX_PASSWORD_LENGTH) {
          return t('forms.validation.maxLength', { max: MAX_PASSWORD_LENGTH });
        }
        return '';
      }

      if (key === LOGIN_FORM_FIELDS.TENANT_ID) {
        if (currentStep !== 'password') return '';
        if (tenantOptions.length > 1 && !sourceForm.tenant_id) {
          return t('auth.login.validation.tenantRequired');
        }
        return '';
      }

      return '';
    },
    [step, t, tenantOptions.length]
  );

  const validate = useCallback(
    (sourceForm = form, currentStep = step) => {
      const next = { identifier: validateField(LOGIN_FORM_FIELDS.IDENTIFIER, sourceForm, currentStep) };
      if (currentStep === 'password') {
        next.password = validateField(LOGIN_FORM_FIELDS.PASSWORD, sourceForm, currentStep);
        next.tenant_id = validateField(LOGIN_FORM_FIELDS.TENANT_ID, sourceForm, currentStep);
      }
      const compact = Object.fromEntries(Object.entries(next).filter(([, value]) => Boolean(value)));
      setErrors(compact);
      return Object.keys(compact).length === 0;
    },
    [form, step, validateField]
  );

  const setFieldValue = useCallback(
    (key, value) => {
      setForm((prev) => {
        const next = { ...prev, [key]: normalizeFieldValue(key, value) };
        const message = validateField(key, next, step);
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          if (message) nextErrors[key] = message;
          else delete nextErrors[key];
          return nextErrors;
        });
        if (key === LOGIN_FORM_FIELDS.IDENTIFIER && step === 'password') {
          next.password = '';
          next.tenant_id = '';
          setStep('identifier');
          setTenantOptions([]);
          setErrors({});
        }
        return next;
      });
      setSubmitError(null);
    },
    [normalizeFieldValue, step, validateField]
  );

  const toggleRememberSession = useCallback(() => {
    setForm((prev) => ({ ...prev, rememberSession: !prev.rememberSession }));
  }, []);

  const goBackToIdentifier = useCallback(() => {
    setStep('identifier');
    setTenantOptions([]);
    setErrors({});
    setSubmitError(null);
    setForm((prev) => ({
      ...prev,
      password: '',
      tenant_id: '',
    }));
  }, []);

  const handleIdentifySubmit = useCallback(async () => {
    const isValid = validate(form, 'identifier');
    if (!isValid) return false;

    const identifier = form.identifier.trim();
    const action = await identify({ identifier });
    const status = action?.meta?.requestStatus;

    if (status !== 'fulfilled') {
      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    }

    const users = Array.isArray(action?.payload?.users) ? action.payload.users : [];
    const summary = action?.payload?.summary || {};
    const hasActive = Boolean(summary?.has_active);
    const hasPending = Boolean(summary?.has_pending);

    if (users.length === 0) {
      await saveAuthResumeContext({
        identifier,
        next_path: '/landing',
      });
      router.push('/landing');
      return true;
    }

    if (!hasActive && hasPending) {
      await saveAuthResumeContext({
        identifier,
        next_path: '/verify-email',
        params: {
          email: identifier.includes('@') ? identifier.toLowerCase() : '',
          reason: 'pending_verification',
        },
      });
      router.push({
        pathname: '/verify-email',
        params: {
          email: identifier.includes('@') ? identifier.toLowerCase() : '',
          reason: 'pending_verification',
        },
      });
      return true;
    }

    if (!hasActive && !hasPending) {
      setSubmitError({
        code: 'ACCOUNT_INACTIVE',
        message: resolveErrorMessage('ACCOUNT_INACTIVE', null, t),
      });
      return false;
    }

    const options = users
      .filter((item) => item?.tenant_id)
      .filter((item) => item?.status === 'ACTIVE')
      .map((item) => ({
        label: item.tenant_name || item.tenant_slug || item.tenant_id,
        value: item.tenant_id,
      }));

    if (options.length === 0) {
      setSubmitError({
        code: 'ACCOUNT_INACTIVE',
        message: resolveErrorMessage('ACCOUNT_INACTIVE', null, t),
      });
      return false;
    }

    await saveAuthResumeContext({
      identifier,
      next_path: '/login',
      params: {
        step: 'password',
        email: identifier.includes('@') ? identifier.toLowerCase() : '',
      },
    });

    setTenantOptions(options);
    setStep('password');
    setErrors({});
    setSubmitError(null);
    setForm((prev) => ({
      ...prev,
      password: '',
      tenant_id: options.length === 1 ? String(options[0].value) : '',
    }));
    return true;
  }, [form, identify, router, t, validate]);

  const handlePasswordSubmit = useCallback(async () => {
    const isValid = validate(form, 'password');
    if (!isValid) return false;

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
    if (form.tenant_id) {
      payload.tenant_id = form.tenant_id;
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
      await clearAuthResumeContext();
      router.replace('/dashboard');
      return true;
    }

    const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
    const message = resolveErrorMessage(code, action?.payload?.message, t);

    if (code === 'ACCOUNT_PENDING') {
      await saveAuthResumeContext({
        identifier,
        next_path: '/verify-email',
        params: {
          email: isEmail ? identifier.toLowerCase() : '',
          reason: 'pending_verification',
        },
      });
      router.push({
        pathname: '/verify-email',
        params: {
          email: isEmail ? identifier.toLowerCase() : '',
          reason: 'pending_verification',
        },
      });
    }

    setSubmitError({ code, message });
    return false;
  }, [form, login, router, t, validate]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false;
    setSubmitError(null);

    setIsSubmitting(true);
    try {
      if (step === 'identifier') {
        return handleIdentifySubmit();
      }
      return handlePasswordSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }, [handleIdentifySubmit, handlePasswordSubmit, isSubmitting, step]);

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
    step,
    isPasswordStep: step === 'password',
    tenantOptions,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    toggleRememberSession,
    goBackToIdentifier,
    handleSubmit,
    goToRegister,
    goToVerifyEmail,
  };
};

export default useLoginScreen;
