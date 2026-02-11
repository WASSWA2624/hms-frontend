/**
 * useRegisterScreen Hook
 * Form state, validation, API integration, and navigation handlers for register.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import {
  mapFacilityToBackendType,
  readOnboardingEntry,
  resolveFacilitySelection,
  saveOnboardingEntry,
} from '@navigation/onboardingEntry';
import { FACILITY_OPTIONS, REGISTER_DRAFT_KEY } from './types';

const initialForm = {
  facilityName: '',
  adminName: '',
  facilityType: '',
  email: '',
  phone: '',
  password: '',
};

const toSingleValue = (value) => {
  if (Array.isArray(value)) return value[0];
  return typeof value === 'string' ? value : '';
};

const toPhoneDigits = (value) => String(value || '').replace(/[^\d]/g, '');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecial = /[^A-Za-z0-9]/;

const resolveErrorMessage = (code, message, t) => {
  if (!code) return message || t('errors.fallback.message');
  const key = `errors.codes.${code}`;
  const translated = t(key);
  return translated !== key ? translated : message || t('errors.fallback.message');
};

const useRegisterScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { register } = useAuth();
  const submitInFlightRef = useRef(false);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const optionIds = useMemo(() => new Set(FACILITY_OPTIONS.map((item) => item.id)), []);
  const facilityOptions = useMemo(
    () => FACILITY_OPTIONS.map((item) => ({ label: t(item.labelKey), value: item.id })),
    [t]
  );
  const facilityParam = toSingleValue(params?.facility);
  const facilityTypeParam = toSingleValue(params?.facilityType);
  const facilityTypeSnakeParam = toSingleValue(params?.facility_type);
  const facilityFromQuery = useMemo(
    () => resolveFacilitySelection(facilityParam || facilityTypeParam || facilityTypeSnakeParam),
    [facilityParam, facilityTypeParam, facilityTypeSnakeParam]
  );

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    try {
      const [storedOnboarding, draft] = await Promise.all([
        readOnboardingEntry(),
        asyncStorage.getItem(REGISTER_DRAFT_KEY),
      ]);
      const facilityType = facilityFromQuery || storedOnboarding?.facility_id || draft?.facilityType || '';

      setForm({
        facilityName: draft?.facilityName || '',
        adminName: draft?.adminName || '',
        facilityType: optionIds.has(facilityType) ? facilityType : '',
        email: '',
        phone: draft?.phone || '',
        password: draft?.password || '',
      });
    } finally {
      setIsHydrating(false);
    }
  }, [facilityFromQuery, optionIds]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrating) return;
    asyncStorage.setItem(REGISTER_DRAFT_KEY, form);
  }, [form, isHydrating]);

  const setFieldValue = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSubmitError(null);
  }, []);

  const validate = useCallback(() => {
    const next = {};

    if (!form.facilityName.trim()) next.facilityName = t('auth.register.onboarding.validation.facilityNameRequired');
    if (!form.adminName.trim()) next.adminName = t('auth.register.onboarding.validation.adminNameRequired');
    if (!form.facilityType || !optionIds.has(form.facilityType)) next.facilityType = t('auth.register.onboarding.validation.facilityTypeRequired');

    const email = form.email.trim().toLowerCase();
    if (!email) {
      next.email = t('auth.register.onboarding.validation.emailRequired');
    } else if (!emailRegex.test(email)) {
      next.email = t('auth.register.onboarding.validation.emailInvalid');
    }

    const password = form.password;
    if (!password) {
      next.password = t('auth.register.onboarding.validation.passwordRequired');
    } else if (password.length < 8) {
      next.password = t('auth.register.onboarding.validation.passwordMinLength');
    } else if (!hasUppercase.test(password)) {
      next.password = t('auth.register.onboarding.validation.passwordUppercase');
    } else if (!hasLowercase.test(password)) {
      next.password = t('auth.register.onboarding.validation.passwordLowercase');
    } else if (!hasNumber.test(password)) {
      next.password = t('auth.register.onboarding.validation.passwordNumber');
    } else if (!hasSpecial.test(password)) {
      next.password = t('auth.register.onboarding.validation.passwordSpecial');
    }

    const phone = toPhoneDigits(form.phone);
    if (phone && phone.length < 10) {
      next.phone = t('auth.register.onboarding.validation.phoneInvalid');
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form, optionIds, t]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || submitInFlightRef.current) return false;
    setIsSuccess(false);
    setSubmitError(null);

    const isValid = validate();
    if (!isValid) return false;

    submitInFlightRef.current = true;
    setIsSubmitting(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: toPhoneDigits(form.phone) || undefined,
        facility_name: form.facilityName.trim(),
        admin_name: form.adminName.trim(),
        facility_type: mapFacilityToBackendType(form.facilityType) || undefined,
      };

      const action = await register(payload);
      const status = action?.meta?.requestStatus;

      if (status === 'fulfilled') {
        await asyncStorage.removeItem(REGISTER_DRAFT_KEY);
        await saveOnboardingEntry(form.facilityType);
        setIsSuccess(true);
        return true;
      }

      const code = action?.payload?.code || action?.error?.code || action?.error?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, action?.payload?.message, t);
      setSubmitError({ code, message });
      return false;
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, register, t, validate]);

  const handleContinue = useCallback(() => {
    router.push('/landing');
  }, [router]);

  return {
    form,
    errors,
    facilityOptions,
    isHydrating,
    isSubmitting,
    isSuccess,
    submitError,
    setFieldValue,
    handleSubmit,
    handleContinue,
    retryHydration: hydrate,
    hasFacilityOptions: facilityOptions.length > 0,
  };
};

export default useRegisterScreen;


