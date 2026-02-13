/**
 * useTenantSelectionScreen Hook
 * Handles tenant selection before password login step.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { readAuthResumeContext } from '@navigation/authResumeContext';
import { readRegistrationContext } from '@navigation/registrationContext';
import { MAX_IDENTIFIER_LENGTH, TENANT_SELECTION_FORM_FIELDS } from './types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;

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

const getIdentifierType = (identifier) => (identifier.includes('@') ? 'email' : 'phone');

const useTenantSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { identify } = useAuth();

  const identifierParam = useMemo(
    () =>
      toSingleValue(params?.identifier).trim() ||
      toSingleValue(params?.email).trim().toLowerCase() ||
      toSingleValue(params?.phone).trim(),
    [params?.email, params?.identifier, params?.phone]
  );

  const [form, setForm] = useState({
    identifier: '',
    tenant_id: '',
  });
  const [tenantOptions, setTenantOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
        const resumeIdentifier = String(resume?.identifier || '').trim();
        setForm((prev) => ({
          ...prev,
          identifier: identifierParam || registration?.email || resumeIdentifier || '',
        }));
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [identifierParam]);

  const normalizeIdentifier = useCallback((value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.includes('@')) return raw.toLowerCase();
    return raw.replace(/[^\d]/g, '');
  }, []);

  const validateField = useCallback(
    (key, sourceForm, requireTenant = false) => {
      if (key === TENANT_SELECTION_FORM_FIELDS.IDENTIFIER) {
        const value = normalizeIdentifier(sourceForm.identifier);
        if (!value) return t('auth.tenantSelection.validation.identifierRequired');
        if (value.includes('@')) {
          if (!emailRegex.test(value)) return t('auth.tenantSelection.validation.identifierInvalid');
          return '';
        }
        if (!phoneRegex.test(value)) return t('auth.tenantSelection.validation.identifierInvalid');
        return '';
      }

      if (key === TENANT_SELECTION_FORM_FIELDS.TENANT_ID) {
        if (!requireTenant) return '';
        const value = String(sourceForm.tenant_id || '').trim();
        if (!value) return t('auth.tenantSelection.validation.tenantRequired');
        return '';
      }

      return '';
    },
    [normalizeIdentifier, t]
  );

  const validate = useCallback(
    (sourceForm = form, requireTenant = false) => {
      const next = {
        identifier: validateField(TENANT_SELECTION_FORM_FIELDS.IDENTIFIER, sourceForm, requireTenant),
      };
      if (requireTenant) {
        next.tenant_id = validateField(TENANT_SELECTION_FORM_FIELDS.TENANT_ID, sourceForm, requireTenant);
      }
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
            key === TENANT_SELECTION_FORM_FIELDS.IDENTIFIER
              ? String(value || '').trim().slice(0, MAX_IDENTIFIER_LENGTH)
              : String(value || '').trim(),
        };
        const requireTenant = tenantOptions.length > 1;
        const message = validateField(key, next, requireTenant);
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          if (message) nextErrors[key] = message;
          else delete nextErrors[key];
          return nextErrors;
        });
        if (key === TENANT_SELECTION_FORM_FIELDS.IDENTIFIER) {
          next.tenant_id = '';
          setTenantOptions([]);
          setErrors({});
        }
        return next;
      });
      setSubmitError(null);
    },
    [tenantOptions.length, validateField]
  );

  const goToLoginStep = useCallback(
    (identifier, tenantId) => {
      const normalizedIdentifier = normalizeIdentifier(identifier);
      const identifierType = getIdentifierType(normalizedIdentifier);
      const params = {
        step: 'password',
        identifier: normalizedIdentifier,
        tenant_id: tenantId,
      };
      if (identifierType === 'email') params.email = normalizedIdentifier;
      router.replace({
        pathname: '/login',
        params,
      });
    },
    [normalizeIdentifier, router]
  );

  const handleLookup = useCallback(async () => {
    const sourceForm = {
      identifier: normalizeIdentifier(form.identifier),
      tenant_id: '',
    };
    const isValid = validate(sourceForm, false);
    if (!isValid || isSubmitting) return false;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const action = await identify({ identifier: sourceForm.identifier });
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
        setSubmitError({
          code: 'USER_NOT_FOUND',
          message: resolveErrorMessage('USER_NOT_FOUND', null, t),
        });
        return false;
      }

      if (!hasActive && hasPending) {
        const isEmailIdentifier = sourceForm.identifier.includes('@');
        router.push({
          pathname: '/verify-email',
          params: {
            email: isEmailIdentifier ? sourceForm.identifier : '',
            reason: 'pending_verification',
          },
        });
        return true;
      }

      const options = users
        .filter((item) => item?.tenant_id && item?.status === 'ACTIVE')
        .map((item) => ({
          label: item.tenant_name || item.tenant_slug || item.tenant_id,
          value: item.tenant_id,
        }))
        .filter((item, index, arr) => arr.findIndex((x) => x.value === item.value) === index);

      if (options.length === 0) {
        setSubmitError({
          code: 'ACCOUNT_INACTIVE',
          message: resolveErrorMessage('ACCOUNT_INACTIVE', null, t),
        });
        return false;
      }

      if (options.length === 1) {
        goToLoginStep(sourceForm.identifier, options[0].value);
        return true;
      }

      setTenantOptions(options);
      setForm((prev) => ({ ...prev, tenant_id: '' }));
      setErrors({});
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [form.identifier, goToLoginStep, identify, isSubmitting, normalizeIdentifier, router, t, validate]);

  const handleContinue = useCallback(async () => {
    const sourceForm = {
      identifier: normalizeIdentifier(form.identifier),
      tenant_id:
        form.tenant_id ||
        (tenantOptions.length === 1 ? String(tenantOptions[0].value) : ''),
    };
    const requiresTenant = tenantOptions.length > 0;
    const isValid = validate(sourceForm, requiresTenant);
    if (!isValid) return false;
    goToLoginStep(sourceForm.identifier, sourceForm.tenant_id);
    return true;
  }, [form.identifier, form.tenant_id, goToLoginStep, normalizeIdentifier, tenantOptions, validate]);

  const handlePrimaryAction = useCallback(async () => {
    if (tenantOptions.length > 0) {
      return handleContinue();
    }
    return handleLookup();
  }, [handleContinue, handleLookup, tenantOptions.length]);

  const goToLogin = useCallback(() => {
    router.replace('/login');
  }, [router]);

  const isTenantStep = tenantOptions.length > 0;

  const submitBlockedReason = useMemo(() => {
    if (isSubmitting) return t('auth.accessibility.actions.submitting');
    if (!form.identifier.trim()) return t('auth.tenantSelection.validation.identifierRequired');
    if (isTenantStep && !form.tenant_id.trim()) return t('auth.tenantSelection.validation.tenantRequired');
    return '';
  }, [form.identifier, form.tenant_id, isSubmitting, isTenantStep, t]);

  return {
    form,
    tenantOptions,
    errors,
    isTenantStep,
    isHydrating,
    isSubmitting,
    submitError,
    submitBlockedReason,
    isSubmitDisabled: Boolean(submitBlockedReason),
    setFieldValue,
    handlePrimaryAction,
    goToLogin,
  };
};

export default useTenantSelectionScreen;

