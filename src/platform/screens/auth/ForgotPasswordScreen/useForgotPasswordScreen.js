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
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const toSingleValue = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
};

const normalizeDisplayValue = (value) => String(value || '').trim();

const isTechnicalIdentifier = (value) => {
  const normalized = normalizeDisplayValue(value);
  if (!normalized) return true;
  if (UUID_REGEX.test(normalized)) return true;
  if (normalized.length >= 24 && /^[0-9a-f]+$/i.test(normalized)) return true;
  return false;
};

const resolveTenantOptionMeta = (tenant, index, t) => {
  const displayName = normalizeDisplayValue(
    tenant?.tenant_name ||
      tenant?.tenant_display_name ||
      tenant?.tenant_slug ||
      tenant?.tenant_alias
  );
  const businessCode = normalizeDisplayValue(
    tenant?.tenant_code ||
      tenant?.tenant_number ||
      tenant?.tenant_reference ||
      tenant?.tenant_human_id
  );

  const readableName = !isTechnicalIdentifier(displayName) ? displayName : '';
  const readableCode = !isTechnicalIdentifier(businessCode) ? businessCode : '';

  if (readableName && readableCode) return `${readableName} (${readableCode})`;
  if (readableName) return readableName;
  if (readableCode) return readableCode;

  return t('auth.forgotPassword.fallback.organization', { index: index + 1 });
};

const normalizeTenantOptions = (payload, t) => {
  const users = Array.isArray(payload?.users) ? payload.users : [];
  const seenTenantIds = new Set();
  const options = [];

  users.forEach((item) => {
    const tenantId = String(item?.tenant_id || '').trim();
    if (!tenantId || seenTenantIds.has(tenantId)) return;

    const status = String(item?.status || '').toUpperCase();
    if (status && status !== 'ACTIVE' && status !== 'PENDING') return;

    seenTenantIds.add(tenantId);
    options.push({
      value: tenantId,
      label: resolveTenantOptionMeta(item, options.length, t),
    });
  });

  return options;
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
  const { forgotPassword, identify } = useAuth();

  const emailParam = useMemo(() => toSingleValue(params?.email).trim().toLowerCase(), [params?.email]);
  const tenantParam = useMemo(() => toSingleValue(params?.tenant_id).trim(), [params?.tenant_id]);

  const [form, setForm] = useState({
    email: '',
    tenant_id: '',
  });
  const [tenantOptions, setTenantOptions] = useState([]);
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
        if (tenantOptions.length > 1 && !value) return t('auth.forgotPassword.validation.tenantRequired');
        if (!value) return '';
        if (tenantOptions.length > 0 && !tenantOptions.some((option) => option.value === value)) {
          return t('auth.forgotPassword.validation.tenantRequired');
        }
        return '';
      }

      return '';
    },
    [t, tenantOptions]
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
              ? String(value || '').slice(0, MAX_EMAIL_LENGTH)
              : String(value || '').trim().slice(0, MAX_TENANT_LENGTH),
        };
        if (key === FORGOT_PASSWORD_FORM_FIELDS.EMAIL) {
          next.tenant_id = '';
          setTenantOptions([]);
        }
        const message = validateField(
          key === FORGOT_PASSWORD_FORM_FIELDS.EMAIL
            ? FORGOT_PASSWORD_FORM_FIELDS.EMAIL
            : key,
          next
        );
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          if (message) nextErrors[key] = message;
          else delete nextErrors[key];
          if (key === FORGOT_PASSWORD_FORM_FIELDS.EMAIL) {
            delete nextErrors.tenant_id;
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
      email: form.email.trim().toLowerCase(),
      tenant_id: form.tenant_id.trim(),
    };
    const isValid = validate(sourceForm);
    if (!isValid) return false;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let resolvedTenantId = sourceForm.tenant_id;

      if (!resolvedTenantId) {
        const identifyAction = await identify({ identifier: sourceForm.email });
        const identifyStatus = identifyAction?.meta?.requestStatus;
        if (identifyStatus !== 'fulfilled') {
          const identifyCode =
            identifyAction?.payload?.code ||
            identifyAction?.error?.code ||
            identifyAction?.error?.message ||
            'UNKNOWN_ERROR';
          const identifyMessage = resolveErrorMessage(
            identifyCode,
            identifyAction?.payload?.message,
            t
          );
          setSubmitError({ code: identifyCode, message: identifyMessage });
          return false;
        }

        const nextTenantOptions = normalizeTenantOptions(identifyAction?.payload, t);
        setTenantOptions(nextTenantOptions);

        if (nextTenantOptions.length === 0) {
          // Keep response non-enumerating for unknown accounts.
          setErrors({});
          setIsSubmitted(true);
          return true;
        }

        if (nextTenantOptions.length > 1) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            tenant_id: t('auth.forgotPassword.validation.tenantRequired'),
          }));
          return false;
        }

        resolvedTenantId = nextTenantOptions[0].value;
        setForm((prev) => ({ ...prev, tenant_id: resolvedTenantId }));
      }

      const action = await forgotPassword({
        email: sourceForm.email,
        tenant_id: resolvedTenantId,
      });
      const status = action?.meta?.requestStatus;
      if (status === 'fulfilled') {
        setErrors({});
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
  }, [forgotPassword, form.email, form.tenant_id, identify, isSubmitting, t, validate]);

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
    if (tenantOptions.length > 1 && !form.tenant_id.trim()) {
      return t('auth.forgotPassword.validation.tenantRequired');
    }
    return '';
  }, [form.email, form.tenant_id, isSubmitting, t, tenantOptions.length]);

  return {
    form,
    tenantOptions,
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
