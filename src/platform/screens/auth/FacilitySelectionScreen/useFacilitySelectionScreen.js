/**
 * useFacilitySelectionScreen Hook
 * Handles facility selection for multi-facility login responses.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { clearAuthResumeContext } from '@navigation/authResumeContext';
import {
  clearFacilitySelectionSession,
  readFacilitySelectionSession,
  saveFacilitySelectionSession,
} from '@navigation/facilitySelectionSession';
import { FACILITY_SELECTION_FORM_FIELDS } from './types';

const toSingleValue = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveErrorMessage = (code, message, t) => {
  if (!code) return message || t('errors.fallback.message');
  const key = `errors.codes.${code}`;
  const translated = t(key);
  return translated !== key ? translated : message || t('errors.fallback.message');
};

const normalizeDisplayValue = (value) => String(value || '').trim();

const isTechnicalIdentifier = (value) => {
  const normalized = normalizeDisplayValue(value);
  if (!normalized) return true;
  if (UUID_REGEX.test(normalized)) return true;
  if (normalized.length >= 24 && /^[0-9a-f]+$/i.test(normalized)) return true;
  return false;
};

const normalizeFacilityOption = (facility, index, t) => {
  if (!facility || typeof facility !== 'object') return null;
  const id = normalizeDisplayValue(facility.id || facility.facility_id);
  if (!id) return null;
  const displayName = normalizeDisplayValue(
    facility.name ||
      facility.facility_name ||
      facility.display_name ||
      facility.slug ||
      facility.facility_slug
  );
  const businessCode = normalizeDisplayValue(
    facility.code ||
      facility.facility_code ||
      facility.facility_number ||
      facility.facility_reference ||
      facility.facility_human_id
  );

  const readableName = !isTechnicalIdentifier(displayName) ? displayName : '';
  const readableCode = !isTechnicalIdentifier(businessCode) ? businessCode : '';

  let label = t('auth.facilitySelection.fallback.facility', { index: index + 1 });
  if (readableName && readableCode) {
    label = `${readableName} (${readableCode})`;
  } else if (readableName) {
    label = readableName;
  } else if (readableCode) {
    label = readableCode;
  }

  return {
    value: id,
    label,
    facilityName: readableName,
    facilityCode: readableCode,
  };
};

const useFacilitySelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18n();
  const { login, loadCurrentUser } = useAuth();

  const facilityParam = useMemo(() => toSingleValue(params?.facility_id).trim(), [params?.facility_id]);
  const session = useMemo(() => readFacilitySelectionSession(), []);

  const [form, setForm] = useState({
    facility_id: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const facilityOptions = useMemo(
    () =>
      (Array.isArray(session?.facilities) ? session.facilities : [])
        .map((facility, index) => normalizeFacilityOption(facility, index, t))
        .filter(Boolean),
    [session?.facilities, t]
  );

  const tenantLabel = useMemo(() => {
    const displayName = normalizeDisplayValue(
      session?.tenant_name ||
        session?.tenant_display_name ||
        session?.tenant_slug
    );
    const businessCode = normalizeDisplayValue(
      session?.tenant_code ||
        session?.tenant_number ||
        session?.tenant_reference ||
        session?.tenant_human_id
    );

    const readableName = !isTechnicalIdentifier(displayName) ? displayName : '';
    const readableCode = !isTechnicalIdentifier(businessCode) ? businessCode : '';

    if (readableName && readableCode) return `${readableName} (${readableCode})`;
    if (readableName) return readableName;
    if (readableCode) return readableCode;
    return t('auth.facilitySelection.summary.tenantUnknown');
  }, [
    session?.tenant_code,
    session?.tenant_display_name,
    session?.tenant_human_id,
    session?.tenant_name,
    session?.tenant_number,
    session?.tenant_reference,
    session?.tenant_slug,
    t,
  ]);

  const hasSession = Boolean(session && session.password && session.tenant_id && session.identifier);
  const hasFacilityOptions = facilityOptions.length > 0;
  const hasContext = hasSession && hasFacilityOptions;

  useEffect(() => {
    if (!hasContext) return;
    setForm((prev) => ({
      ...prev,
      facility_id: facilityParam || facilityOptions[0].value || '',
    }));
  }, [facilityOptions, facilityParam, hasContext]);

  const validateField = useCallback(
    (key, sourceForm) => {
      if (key === FACILITY_SELECTION_FORM_FIELDS.FACILITY_ID) {
        const value = String(sourceForm.facility_id || '').trim();
        if (!value) return t('auth.facilitySelection.validation.facilityRequired');
        if (!facilityOptions.some((option) => option.value === value)) {
          return t('auth.facilitySelection.validation.facilityRequired');
        }
        return '';
      }
      return '';
    },
    [facilityOptions, t]
  );

  const setFieldValue = useCallback(
    (key, value) => {
      setForm((prev) => {
        const next = { ...prev, [key]: String(value || '').trim() };
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
    [validateField]
  );

  const handleSubmit = useCallback(async () => {
    if (!hasContext || isSubmitting) return false;

    const sourceForm = {
      facility_id: String(form.facility_id || '').trim(),
    };
    const validationMessage = validateField(FACILITY_SELECTION_FORM_FIELDS.FACILITY_ID, sourceForm);
    if (validationMessage) {
      setErrors({ facility_id: validationMessage });
      return false;
    }

    const payload = {
      password: session.password,
      tenant_id: session.tenant_id,
      facility_id: sourceForm.facility_id,
      remember_me: Boolean(session.remember_me),
    };
    if (session.email) payload.email = session.email;
    else payload.phone = session.phone || session.identifier;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const action = await login(payload);
      const status = action?.meta?.requestStatus;

      if (status === 'fulfilled') {
        if (action?.payload?.requiresFacilitySelection) {
          saveFacilitySelectionSession({
            identifier: session.identifier,
            password: session.password,
            tenant_id: action?.payload?.tenantId || session.tenant_id,
            tenant_name: action?.payload?.tenantName || session.tenant_name || '',
            tenant_code: action?.payload?.tenantCode || session.tenant_code || '',
            remember_me: session.remember_me,
            facilities: action?.payload?.facilities || [],
          });
          setSubmitError({
            code: 'UNAUTHORIZED_FACILITY',
            message: resolveErrorMessage('UNAUTHORIZED_FACILITY', null, t),
          });
          return false;
        }

        clearFacilitySelectionSession();
        await clearAuthResumeContext();
        await loadCurrentUser();
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
  }, [form.facility_id, hasContext, isSubmitting, loadCurrentUser, login, router, session, t, validateField]);

  const goToLogin = useCallback(async () => {
    clearFacilitySelectionSession();
    await clearAuthResumeContext();
    router.replace('/login');
  }, [router]);

  const goToTenantSelection = useCallback(() => {
    const identifier = String(session?.identifier || '').trim();
    clearFacilitySelectionSession();
    router.replace({
      pathname: '/tenant-selection',
      params: {
        identifier,
      },
    });
  }, [router, session?.identifier]);

  const submitBlockedReason = useMemo(() => {
    if (isSubmitting) return t('auth.accessibility.actions.submitting');
    if (!hasContext) return t('auth.facilitySelection.validation.contextRequired');
    if (!form.facility_id.trim()) return t('auth.facilitySelection.validation.facilityRequired');
    return '';
  }, [form.facility_id, hasContext, isSubmitting, t]);

  return {
    form,
    errors,
    hasContext,
    facilityOptions,
    isSubmitting,
    submitError,
    submitBlockedReason,
    isSubmitDisabled: Boolean(submitBlockedReason),
    identifier: session?.identifier || '',
    tenantLabel,
    setFieldValue,
    handleSubmit,
    goToLogin,
    goToTenantSelection,
  };
};

export default useFacilitySelectionScreen;
