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
const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 320;
const MAX_PHONE_LENGTH = 15;
const MAX_PASSWORD_LENGTH = 128;

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

  const normalizeValue = useCallback((key, value) => {
    if (key === 'facilityName' || key === 'adminName') {
      return String(value || '').replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH);
    }
    if (key === 'email') {
      return String(value || '').trim().slice(0, MAX_EMAIL_LENGTH);
    }
    if (key === 'phone') {
      return toPhoneDigits(value).slice(0, MAX_PHONE_LENGTH);
    }
    if (key === 'password') {
      return String(value || '').slice(0, MAX_PASSWORD_LENGTH);
    }
    return value;
  }, []);

  const validateField = useCallback((key, sourceForm) => {
    if (key === 'facilityName') {
      const value = sourceForm.facilityName.trim();
      if (!value) return t('auth.register.onboarding.validation.facilityNameRequired');
      if (value.length > MAX_NAME_LENGTH) return t('forms.validation.maxLength', { max: MAX_NAME_LENGTH });
      return '';
    }
    if (key === 'adminName') {
      const value = sourceForm.adminName.trim();
      if (!value) return t('auth.register.onboarding.validation.adminNameRequired');
      if (value.length > MAX_NAME_LENGTH) return t('forms.validation.maxLength', { max: MAX_NAME_LENGTH });
      return '';
    }
    if (key === 'facilityType') {
      if (!sourceForm.facilityType || !optionIds.has(sourceForm.facilityType)) {
        return t('auth.register.onboarding.validation.facilityTypeRequired');
      }
      return '';
    }
    if (key === 'email') {
      const email = sourceForm.email.trim().toLowerCase();
      if (!email) return t('auth.register.onboarding.validation.emailRequired');
      if (email.length > MAX_EMAIL_LENGTH) return t('forms.validation.maxLength', { max: MAX_EMAIL_LENGTH });
      if (!emailRegex.test(email)) return t('auth.register.onboarding.validation.emailInvalid');
      return '';
    }
    if (key === 'password') {
      const password = sourceForm.password;
      if (!password) return t('auth.register.onboarding.validation.passwordRequired');
      if (password.length < 8) return t('auth.register.onboarding.validation.passwordMinLength');
      if (!hasUppercase.test(password)) return t('auth.register.onboarding.validation.passwordUppercase');
      if (!hasLowercase.test(password)) return t('auth.register.onboarding.validation.passwordLowercase');
      if (!hasNumber.test(password)) return t('auth.register.onboarding.validation.passwordNumber');
      if (!hasSpecial.test(password)) return t('auth.register.onboarding.validation.passwordSpecial');
      if (password.length > MAX_PASSWORD_LENGTH) return t('forms.validation.maxLength', { max: MAX_PASSWORD_LENGTH });
      return '';
    }
    if (key === 'phone') {
      const phone = sourceForm.phone;
      if (!phone) return '';
      if (!/^[0-9]+$/.test(phone)) return t('auth.register.onboarding.validation.phoneInvalid');
      if (phone.length < 10) return t('auth.register.onboarding.validation.phoneInvalid');
      return '';
    }
    return '';
  }, [optionIds, t]);

  const validate = useCallback((sourceForm = form) => {
    const next = {
      facilityName: validateField('facilityName', sourceForm),
      adminName: validateField('adminName', sourceForm),
      facilityType: validateField('facilityType', sourceForm),
      email: validateField('email', sourceForm),
      phone: validateField('phone', sourceForm),
      password: validateField('password', sourceForm),
    };

    const compact = Object.fromEntries(Object.entries(next).filter(([, message]) => Boolean(message)));
    setErrors(compact);
    return Object.keys(compact).length === 0;
  }, [form, validateField]);

  const setFieldValue = useCallback((key, value) => {
    setForm((prev) => {
      const nextForm = { ...prev, [key]: normalizeValue(key, value) };
      const message = validateField(key, nextForm);
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        if (message) nextErrors[key] = message;
        else delete nextErrors[key];
        return nextErrors;
      });
      return nextForm;
    });
    setSubmitError(null);
  }, [normalizeValue, validateField]);

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


