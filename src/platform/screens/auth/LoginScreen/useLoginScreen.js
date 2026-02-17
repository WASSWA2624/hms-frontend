/**
 * useLoginScreen Hook
 * Manages one-step login form state, validation, and navigation.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { clearAuthResumeContext, saveAuthResumeContext } from '@navigation/authResumeContext';
import { saveFacilitySelectionSession } from '@navigation/facilitySelectionSession';
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

const normalizeIdentifySummary = (payload) => {
  const users = Array.isArray(payload?.users) ? payload.users : [];
  const summary = payload?.summary || {};

  const hasActive =
    Boolean(summary?.has_active) ||
    Number(summary?.active_count || 0) > 0 ||
    users.some((user) => String(user?.status || '').toUpperCase() === 'ACTIVE');

  const hasPending =
    Boolean(summary?.has_pending) ||
    Number(summary?.pending_count || 0) > 0 ||
    users.some((user) => String(user?.status || '').toUpperCase() === 'PENDING');

  const hasKnownAccount =
    users.length > 0 ||
    hasActive ||
    hasPending ||
    Number(summary?.suspended_count || 0) > 0 ||
    Number(summary?.inactive_count || 0) > 0;

  return { hasActive, hasPending, hasKnownAccount };
};

const resolveActiveTenantIds = (payload) => {
  const users = Array.isArray(payload?.users) ? payload.users : [];
  const activeTenantIds = users
    .filter((item) => String(item?.status || '').toUpperCase() === 'ACTIVE')
    .map((item) => String(item?.tenant_id || '').trim())
    .filter(Boolean);
  return Array.from(new Set(activeTenantIds));
};

const useLoginScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { identify, login } = useAuth();

  const tenantParam = useMemo(() => toSingleValue(params?.tenant_id).trim(), [params?.tenant_id]);
  const tenantNameParam = useMemo(() => toSingleValue(params?.tenant_name).trim(), [params?.tenant_name]);
  const tenantCodeParam = useMemo(() => toSingleValue(params?.tenant_code).trim(), [params?.tenant_code]);
  const identifierParam = useMemo(() => toSingleValue(params?.identifier).trim(), [params?.identifier]);
  const prefilledEmail = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);

  const [form, setForm] = useState({
    identifier: '',
    password: '',
    tenant_id: '',
    rememberSession: false,
    termsAccepted: false,
  });
  const [tenantOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      try {
        const registration = await readRegistrationContext();
        if (!active) return;
        const identifier = prefilledEmail || identifierParam || registration?.email || '';
        setForm((prev) => ({
          ...prev,
          identifier,
          tenant_id: tenantParam || prev.tenant_id,
        }));
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [identifierParam, prefilledEmail, tenantParam]);

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
    if (key === LOGIN_FORM_FIELDS.TERMS_ACCEPTED) {
      return Boolean(value);
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

      if (key === LOGIN_FORM_FIELDS.TENANT_ID) {
        if (tenantOptions.length > 1 && !sourceForm.tenant_id) {
          return t('auth.login.validation.tenantRequired');
        }
        return '';
      }

      if (key === LOGIN_FORM_FIELDS.TERMS_ACCEPTED) {
        if (!sourceForm.termsAccepted) {
          return t('auth.layout.termsAcceptance.required');
        }
        return '';
      }

      return '';
    },
    [t, tenantOptions.length]
  );

  const validate = useCallback(
    (sourceForm = form) => {
      const next = {
        identifier: validateField(LOGIN_FORM_FIELDS.IDENTIFIER, sourceForm),
        password: validateField(LOGIN_FORM_FIELDS.PASSWORD, sourceForm),
        tenant_id: validateField(LOGIN_FORM_FIELDS.TENANT_ID, sourceForm),
        termsAccepted: validateField(LOGIN_FORM_FIELDS.TERMS_ACCEPTED, sourceForm),
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

  const toggleTermsAcceptance = useCallback(() => {
    setForm((prev) => {
      const next = { ...prev, termsAccepted: !prev.termsAccepted };
      const message = validateField(LOGIN_FORM_FIELDS.TERMS_ACCEPTED, next);
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        if (message) nextErrors[LOGIN_FORM_FIELDS.TERMS_ACCEPTED] = message;
        else delete nextErrors[LOGIN_FORM_FIELDS.TERMS_ACCEPTED];
        return nextErrors;
      });
      return next;
    });
    setSubmitError(null);
  }, [validateField]);

  const handlePasswordSubmit = useCallback(async () => {
    const isValid = validate(form);
    if (!isValid) return false;

    const identifier = form.identifier.trim();
    const isEmail = identifier.includes('@');
    let identifyPayload = null;
    let resolvedTenantId = String(form.tenant_id || '').trim();

    if (!resolvedTenantId) {
      const identifyAction = await identify({ identifier });
      if (identifyAction?.meta?.requestStatus === 'fulfilled') {
        identifyPayload = identifyAction?.payload || null;
        const activeTenantIds = resolveActiveTenantIds(identifyPayload);
        if (activeTenantIds.length === 1) {
          [resolvedTenantId] = activeTenantIds;
        }
      }
    }

    const payload = {
      password: form.password,
      remember_me: form.rememberSession,
    };
    if (isEmail) {
      payload.email = identifier.toLowerCase();
    } else {
      payload.phone = identifier.replace(/[^\d]/g, '');
    }
    if (resolvedTenantId) {
      payload.tenant_id = resolvedTenantId;
    }

    const action = await login(payload);
    const status = action?.meta?.requestStatus;
    if (status === 'fulfilled') {
      if (action?.payload?.requiresFacilitySelection) {
        const saved = saveFacilitySelectionSession({
          identifier,
          password: form.password,
          tenant_id: action?.payload?.tenantId || resolvedTenantId,
          tenant_name: action?.payload?.tenantName || tenantNameParam || '',
          tenant_code: action?.payload?.tenantCode || tenantCodeParam || '',
          remember_me: form.rememberSession,
          facilities: action?.payload?.facilities || [],
        });
        if (!saved) {
          setSubmitError({
            code: 'MULTIPLE_TENANTS',
            message: t('errors.codes.MULTIPLE_TENANTS'),
          });
          return false;
        }

        await saveAuthResumeContext({
          identifier,
          next_path: '/facility-selection',
          params: {
            identifier: isEmail ? identifier.toLowerCase() : identifier,
            tenant_id: action?.payload?.tenantId || resolvedTenantId || '',
            tenant_name: action?.payload?.tenantName || tenantNameParam || '',
            tenant_code: action?.payload?.tenantCode || tenantCodeParam || '',
          },
        });
        router.push('/facility-selection');
        return true;
      }
      await clearAuthResumeContext();
      router.replace('/dashboard');
      return true;
    }

    const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
    let message = resolveErrorMessage(code, action?.payload?.message, t);

    if (code === 'INVALID_CREDENTIALS') {
      if (!identifyPayload) {
        const identifyAction = await identify({ identifier });
        if (identifyAction?.meta?.requestStatus === 'fulfilled') {
          identifyPayload = identifyAction?.payload || null;
        }
      }

      if (identifyPayload) {
        const { hasActive, hasPending, hasKnownAccount } = normalizeIdentifySummary(identifyPayload);
        if (!hasKnownAccount) {
          setSubmitError({
            code: 'IDENTIFIER_NOT_FOUND',
            message: t('auth.login.error.identifierNotFound'),
          });
          return false;
        }

        if (hasPending && !hasActive) {
          setSubmitError({
            code: 'ACCOUNT_PENDING',
            message: t('auth.login.error.pendingVerification'),
          });
          return false;
        }
      }
      message = t('auth.login.error.invalidCredentials');
    }

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
  }, [form, identify, login, router, t, tenantCodeParam, tenantNameParam, validate]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return false;
    setSubmitError(null);

    setIsSubmitting(true);
    try {
      return handlePasswordSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }, [handlePasswordSubmit, isSubmitting]);

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

  const goToForgotPassword = useCallback(() => {
    const trimmedIdentifier = form.identifier.trim();
    router.push({
      pathname: '/forgot-password',
      params: {
        email: trimmedIdentifier.includes('@') ? trimmedIdentifier.toLowerCase() : '',
        identifier: trimmedIdentifier && !trimmedIdentifier.includes('@') ? trimmedIdentifier : '',
        tenant_id: form.tenant_id || '',
      },
    });
  }, [form.identifier, form.tenant_id, router]);

  const goToTerms = useCallback(() => {
    router.push('/terms');
  }, [router]);

  return {
    form,
    tenantOptions,
    errors,
    isHydrating,
    isSubmitting,
    submitError,
    setFieldValue,
    toggleRememberSession,
    toggleTermsAcceptance,
    handleSubmit,
    goToRegister,
    goToVerifyEmail,
    goToForgotPassword,
    goToTerms,
  };
};

export default useLoginScreen;
