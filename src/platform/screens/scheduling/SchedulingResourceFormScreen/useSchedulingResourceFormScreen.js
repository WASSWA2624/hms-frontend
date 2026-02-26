/**
 * Shared logic for scheduling resource create/edit screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppointment, useI18n, useNetwork, useSchedulingAccess } from '@hooks';
import { listAppointments } from '@features/appointment';
import { listPatients } from '@features/patient';
import { listProviderSchedules } from '@features/provider-schedule';
import { listUsers } from '@features/user';
import {
  getSchedulingResourceConfig,
  SCHEDULING_LOOKUP_SOURCES,
  sanitizeString,
  SCHEDULING_ROUTE_ROOT,
  SCHEDULING_RESOURCE_IDS,
  withSchedulingContext,
} from '../schedulingResourceConfigs';
import useSchedulingResourceCrud from '../useSchedulingResourceCrud';
import {
  isAccessDeniedError,
  normalizeRecordId,
  normalizeSchedulingContext,
  resolveErrorMessage,
} from '../schedulingScreenUtils';

const getSearchParamValue = (value) => (Array.isArray(value) ? value[0] : value);

const padDatePart = (value) => String(value).padStart(2, '0');

const toDateTimeInputValue = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return '';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) return normalized;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()}-${padDatePart(parsed.getMonth() + 1)}-${padDatePart(parsed.getDate())}T${padDatePart(parsed.getHours())}:${padDatePart(parsed.getMinutes())}`;
};

const toIsoDateTime = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return '';
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString();
};

const addMinutes = (baseDate, minutes) => new Date(baseDate.getTime() + (minutes * 60 * 1000));

const LOOKUP_FETCH_LIMIT = 12;
const LOOKUP_DEBOUNCE_MS = 280;
const UUID_LIKE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const buildDefaultDateTimeWindow = () => {
  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + (30 - (start.getMinutes() % 30 || 30)));
  const end = addMinutes(start, 30);
  return {
    start: toDateTimeInputValue(start.toISOString()),
    end: toDateTimeInputValue(end.toISOString()),
  };
};

const resolveReminderDateFromAppointment = (appointment) => {
  const appointmentStartIso = toIsoDateTime(
    appointment?.scheduled_start || appointment?.start_time || appointment?.scheduled_for
  );
  if (!appointmentStartIso) {
    return toDateTimeInputValue(addMinutes(new Date(), 5).toISOString());
  }
  const reminderDate = addMinutes(new Date(appointmentStartIso), -24 * 60);
  if (Number.isNaN(reminderDate.getTime()) || reminderDate.getTime() <= Date.now()) {
    return toDateTimeInputValue(addMinutes(new Date(), 5).toISOString());
  }
  return toDateTimeInputValue(reminderDate.toISOString());
};

const splitLabelParts = (...values) =>
  values.map((value) => sanitizeString(value)).filter(Boolean);

const buildLookupLabel = (parts = []) => {
  const normalized = Array.isArray(parts) ? parts.filter(Boolean) : [];
  if (!normalized.length) return '';
  return normalized.join(' · ');
};

const resolvePatientOption = (entry, index) => {
  const id = sanitizeString(entry?.id || entry?.human_friendly_id);
  if (!id) return null;
  const patientName = sanitizeString(entry?.full_name)
    || splitLabelParts(entry?.first_name, entry?.last_name).join(' ')
    || sanitizeString(entry?.name);
  const friendlyId = sanitizeString(entry?.human_friendly_id);
  const phone = sanitizeString(entry?.phone || entry?.primary_phone);
  const label = buildLookupLabel([
    patientName || friendlyId || id || `Patient ${index + 1}`,
    friendlyId && friendlyId !== id ? friendlyId : '',
    phone,
  ]);
  return { value: id, label: label || id };
};

const resolveProviderOption = (entry, index) => {
  const id = sanitizeString(entry?.id || entry?.human_friendly_id);
  if (!id) return null;
  const providerName = sanitizeString(entry?.full_name)
    || sanitizeString(entry?.name)
    || sanitizeString(entry?.display_name);
  const email = sanitizeString(entry?.email);
  const phone = sanitizeString(entry?.phone);
  const friendlyId = sanitizeString(entry?.human_friendly_id);
  const label = buildLookupLabel([
    providerName || email || phone || `Provider ${index + 1}`,
    friendlyId && friendlyId !== id ? friendlyId : '',
    email && email !== providerName ? email : '',
  ]);
  return { value: id, label: label || id };
};

const resolveAppointmentOption = (entry, index) => {
  const id = sanitizeString(entry?.id || entry?.human_friendly_id);
  if (!id) return null;
  const reason = sanitizeString(entry?.reason);
  const scheduledStart = sanitizeString(entry?.scheduled_start);
  const patientId = sanitizeString(entry?.patient_id);
  const friendlyId = sanitizeString(entry?.human_friendly_id);
  const label = buildLookupLabel([
    reason || scheduledStart || `Appointment ${index + 1}`,
    patientId,
    friendlyId && friendlyId !== id ? friendlyId : '',
  ]);
  return { value: id, label: label || id };
};

const resolveProviderScheduleOption = (entry, index) => {
  const id = sanitizeString(entry?.id || entry?.human_friendly_id);
  if (!id) return null;
  const providerId = sanitizeString(entry?.provider_user_id);
  const dayOfWeek = sanitizeString(entry?.day_of_week);
  const friendlyId = sanitizeString(entry?.human_friendly_id);
  const label = buildLookupLabel([
    providerId || `Schedule ${index + 1}`,
    dayOfWeek ? `Day ${dayOfWeek}` : '',
    friendlyId && friendlyId !== id ? friendlyId : '',
  ]);
  return { value: id, label: label || id };
};

const normalizeLookupItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const dedupeLookupOptions = (options = []) => {
  const map = new Map();
  options.forEach((option) => {
    const value = sanitizeString(option?.value);
    if (!value) return;
    if (!map.has(value)) {
      map.set(value, {
        value,
        label: sanitizeString(option?.label) || value,
      });
    }
  });
  return Array.from(map.values());
};

const useSchedulingResourceFormScreen = (resourceId) => {
  const config = getSchedulingResourceConfig(resourceId);
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const patientParam = getSearchParamValue(searchParams?.patientId);
  const providerUserParam = getSearchParamValue(searchParams?.providerUserId);
  const scheduleParam = getSearchParamValue(searchParams?.scheduleId);
  const appointmentParam = getSearchParamValue(searchParams?.appointmentId);
  const statusParam = getSearchParamValue(searchParams?.status);
  const dayOfWeekParam = getSearchParamValue(searchParams?.dayOfWeek);
  const isAvailableParam = getSearchParamValue(searchParams?.isAvailable);
  const recordIdParam = getSearchParamValue(searchParams?.id);
  const routeRecordId = useMemo(() => normalizeRecordId(recordIdParam), [recordIdParam]);
  const isEdit = Boolean(routeRecordId);
  const context = useMemo(
    () => normalizeSchedulingContext({
      patientId: patientParam,
      providerUserId: providerUserParam,
      scheduleId: scheduleParam,
      appointmentId: appointmentParam,
      status: statusParam,
      dayOfWeek: dayOfWeekParam,
      isAvailable: isAvailableParam,
    }),
    [
      patientParam,
      providerUserParam,
      scheduleParam,
      appointmentParam,
      statusParam,
      dayOfWeekParam,
      isAvailableParam,
    ]
  );
  const {
    canAccessScheduling,
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useSchedulingAccess();

  const { get, create, update, data, isLoading, errorCode, reset } = useSchedulingResourceCrud(resourceId);
  const {
    get: getAppointmentForPrefill,
    data: appointmentPrefillData,
    reset: resetAppointmentPrefill,
  } = useAppointment();

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const listPath = useMemo(
    () => withSchedulingContext(config?.routePath || SCHEDULING_ROUTE_ROOT, context),
    [config?.routePath, context]
  );

  const record = data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  const createInitializedRef = useRef(false);
  const appointmentPrefillRef = useRef('');
  const [values, setValues] = useState({});
  const [lookupQueries, setLookupQueries] = useState({});
  const [lookupOptionsByField, setLookupOptionsByField] = useState({});
  const [lookupLoadingByField, setLookupLoadingByField] = useState({});
  const [lookupErrorByField, setLookupErrorByField] = useState({});
  const lookupRequestVersionRef = useRef({});

  const lookupFields = useMemo(
    () => (config?.fields || []).filter((field) => field.type === 'lookup'),
    [config]
  );

  const setFieldValue = useCallback((fieldName, nextValue) => {
    setValues((previous) => ({
      ...previous,
      [fieldName]: nextValue,
    }));
  }, []);

  const setLookupQuery = useCallback((fieldName, nextValue) => {
    setLookupQueries((previous) => ({
      ...previous,
      [fieldName]: nextValue,
    }));
  }, []);

  const addRepeaterItem = useCallback((fieldName) => {
    if (!config) return;
    const repeaterField = (config.fields || []).find(
      (field) => field.name === fieldName && field.type === 'repeater'
    );
    if (!repeaterField) return;
    const nextItem = typeof repeaterField.createItem === 'function'
      ? repeaterField.createItem({
        values,
        context,
      })
      : {};

    setValues((previous) => {
      const existing = Array.isArray(previous[fieldName]) ? previous[fieldName] : [];
      return {
        ...previous,
        [fieldName]: [...existing, nextItem],
      };
    });
  }, [config, values, context]);

  const removeRepeaterItem = useCallback((fieldName, index) => {
    setValues((previous) => {
      const existing = Array.isArray(previous[fieldName]) ? [...previous[fieldName]] : [];
      if (index < 0 || index >= existing.length) return previous;
      existing.splice(index, 1);
      return {
        ...previous,
        [fieldName]: existing,
      };
    });
  }, []);

  const setRepeaterFieldValue = useCallback((fieldName, index, childFieldName, nextValue) => {
    setValues((previous) => {
      const existing = Array.isArray(previous[fieldName]) ? [...previous[fieldName]] : [];
      if (index < 0 || index >= existing.length) return previous;
      const nextRow = {
        ...(existing[index] || {}),
        [childFieldName]: nextValue,
      };
      existing[index] = nextRow;
      return {
        ...previous,
        [fieldName]: existing,
      };
    });
  }, []);

  const initializeValues = useCallback(
    (sourceRecord) => {
      if (!config) return;
      const baseValues = config.getInitialValues(sourceRecord, {
        tenantId: normalizedTenantId,
        facilityId: normalizedFacilityId,
        ...context,
      });

      const nextValues = {
        ...baseValues,
      };

      if (config.requiresTenant) {
        nextValues.tenant_id = sanitizeString(
          sourceRecord?.tenant_id || (!canManageAllTenants ? normalizedTenantId : '')
        );
      }

      if (config.supportsFacility && !sanitizeString(nextValues.facility_id) && normalizedFacilityId) {
        nextValues.facility_id = normalizedFacilityId;
      }

      setValues(nextValues);
    },
    [config, normalizedTenantId, normalizedFacilityId, context, canManageAllTenants]
  );

  const lookupScopeTenantId = useMemo(
    () => sanitizeString(values.tenant_id) || normalizedTenantId,
    [values.tenant_id, normalizedTenantId]
  );

  const lookupScopeFacilityId = useMemo(
    () => sanitizeString(values.facility_id) || normalizedFacilityId,
    [values.facility_id, normalizedFacilityId]
  );

  const fetchLookupOptions = useCallback(
    async (field, searchTerm) => {
      const fieldName = field?.name;
      const lookupSource = field?.lookup?.source;
      if (!fieldName || !lookupSource) return;

      const requestVersion = (lookupRequestVersionRef.current[fieldName] || 0) + 1;
      lookupRequestVersionRef.current[fieldName] = requestVersion;

      setLookupLoadingByField((previous) => ({
        ...previous,
        [fieldName]: true,
      }));
      setLookupErrorByField((previous) => ({
        ...previous,
        [fieldName]: null,
      }));

      const tenantScope = sanitizeString(lookupScopeTenantId);
      const facilityScope = sanitizeString(lookupScopeFacilityId);
      const params = {
        page: 1,
        limit: LOOKUP_FETCH_LIMIT,
      };
      const normalizedSearch = sanitizeString(searchTerm);
      if (normalizedSearch) {
        params.search = normalizedSearch;
      }
      if (tenantScope && UUID_LIKE_REGEX.test(tenantScope)) {
        params.tenant_id = tenantScope;
      }
      if (facilityScope && UUID_LIKE_REGEX.test(facilityScope)) {
        params.facility_id = facilityScope;
      }

      try {
        let items = [];
        if (lookupSource === SCHEDULING_LOOKUP_SOURCES.PATIENT) {
          const response = await listPatients(params);
          items = normalizeLookupItems(response);
        } else if (lookupSource === SCHEDULING_LOOKUP_SOURCES.PROVIDER_USER) {
          const response = await listUsers(params);
          items = normalizeLookupItems(response);
        } else if (lookupSource === SCHEDULING_LOOKUP_SOURCES.APPOINTMENT) {
          const patientId = sanitizeString(values.patient_id || context.patientId);
          const providerUserId = sanitizeString(values.provider_user_id || context.providerUserId);
          if (patientId) params.patient_id = patientId;
          if (providerUserId) params.provider_user_id = providerUserId;
          const response = await listAppointments(params);
          items = normalizeLookupItems(response);
        } else if (lookupSource === SCHEDULING_LOOKUP_SOURCES.PROVIDER_SCHEDULE) {
          const providerUserId = sanitizeString(values.provider_user_id || context.providerUserId);
          if (providerUserId) params.provider_user_id = providerUserId;
          const response = await listProviderSchedules(params);
          items = normalizeLookupItems(response);
        }

        if (lookupRequestVersionRef.current[fieldName] !== requestVersion) return;

        const options = dedupeLookupOptions(
          items
            .map((entry, index) => {
              if (lookupSource === SCHEDULING_LOOKUP_SOURCES.PATIENT) {
                return resolvePatientOption(entry, index);
              }
              if (lookupSource === SCHEDULING_LOOKUP_SOURCES.PROVIDER_USER) {
                return resolveProviderOption(entry, index);
              }
              if (lookupSource === SCHEDULING_LOOKUP_SOURCES.APPOINTMENT) {
                return resolveAppointmentOption(entry, index);
              }
              if (lookupSource === SCHEDULING_LOOKUP_SOURCES.PROVIDER_SCHEDULE) {
                return resolveProviderScheduleOption(entry, index);
              }
              return null;
            })
            .filter(Boolean)
        );

        const selectedValue = sanitizeString(values[fieldName]);
        const selectedOption = selectedValue && !options.some((option) => option.value === selectedValue)
          ? [{ value: selectedValue, label: selectedValue }]
          : [];

        setLookupOptionsByField((previous) => ({
          ...previous,
          [fieldName]: dedupeLookupOptions([...selectedOption, ...options]),
        }));
      } catch {
        if (lookupRequestVersionRef.current[fieldName] !== requestVersion) return;

        const selectedValue = sanitizeString(values[fieldName]);
        setLookupOptionsByField((previous) => ({
          ...previous,
          [fieldName]: selectedValue ? [{ value: selectedValue, label: selectedValue }] : [],
        }));
        setLookupErrorByField((previous) => ({
          ...previous,
          [fieldName]: t('scheduling.common.form.lookupLoadError'),
        }));
      } finally {
        if (lookupRequestVersionRef.current[fieldName] !== requestVersion) return;
        setLookupLoadingByField((previous) => ({
          ...previous,
          [fieldName]: false,
        }));
      }
    },
    [
      lookupScopeTenantId,
      lookupScopeFacilityId,
      values,
      context.patientId,
      context.providerUserId,
      t,
    ]
  );

  useEffect(() => {
    if (!isResolved || !config) return;
    if (!canAccessScheduling || !hasScope) {
      router.replace('/dashboard');
      return;
    }

    if (!isEdit && !canCreateSchedulingRecords) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !canEditSchedulingRecords) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
      return;
    }

    if (isEdit && !routeRecordId) {
      router.replace(listPath);
    }
  }, [
    isResolved,
    config,
    canAccessScheduling,
    hasScope,
    isEdit,
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    routeRecordId,
    router,
    listPath,
  ]);

  useEffect(() => {
    if (!config || !isEdit || !routeRecordId || !isResolved || !canEditSchedulingRecords) return;
    reset();
    get(routeRecordId);
  }, [config, isEdit, routeRecordId, isResolved, canEditSchedulingRecords, reset, get]);

  useEffect(() => {
    if (!config || isEdit || !isResolved || !canCreateSchedulingRecords) return;
    if (createInitializedRef.current) return;
    initializeValues(null);
    createInitializedRef.current = true;
  }, [config, isEdit, isResolved, canCreateSchedulingRecords, initializeValues]);

  useEffect(() => {
    if (!lookupFields.length) return;

    setLookupQueries((previous) => {
      const nextState = {};
      lookupFields.forEach((field) => {
        nextState[field.name] = previous[field.name] || '';
      });
      return nextState;
    });

    setLookupOptionsByField((previous) => {
      const nextState = {};
      lookupFields.forEach((field) => {
        nextState[field.name] = previous[field.name] || [];
      });
      return nextState;
    });
  }, [lookupFields]);

  const lookupDependencySignature = useMemo(
    () =>
      lookupFields.map((field) => `${field.name}:${sanitizeString(values[field.name])}`).join('|'),
    [lookupFields, values]
  );

  const lookupSearchSignature = useMemo(
    () =>
      lookupFields.map((field) => `${field.name}:${sanitizeString(lookupQueries[field.name])}`).join('|'),
    [lookupFields, lookupQueries]
  );

  useEffect(() => {
    if (!lookupFields.length) return;

    const timers = lookupFields.map((field) =>
      setTimeout(() => {
        const normalizedQuery = sanitizeString(lookupQueries[field.name]);
        const selectedValue = sanitizeString(values[field.name]);
        fetchLookupOptions(field, normalizedQuery || selectedValue || '');
      }, field?.lookup?.debounceMs || LOOKUP_DEBOUNCE_MS)
    );

    return () => {
      timers.forEach((timerId) => clearTimeout(timerId));
    };
  }, [
    lookupFields,
    lookupDependencySignature,
    lookupSearchSignature,
    lookupScopeTenantId,
    lookupScopeFacilityId,
    context.patientId,
    context.providerUserId,
    fetchLookupOptions,
    lookupQueries,
    values,
  ]);

  useEffect(() => {
    const isCreateMode = !isEdit && isResolved && canCreateSchedulingRecords;
    const supportsAppointmentPrefill = [
      SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS,
      SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS,
      SCHEDULING_RESOURCE_IDS.VISIT_QUEUES,
    ].includes(resourceId);
    if (!isCreateMode || !supportsAppointmentPrefill) return;

    const appointmentId = sanitizeString(values.appointment_id || context.appointmentId);
    if (!appointmentId || appointmentPrefillRef.current === appointmentId) return;
    appointmentPrefillRef.current = appointmentId;
    resetAppointmentPrefill();
    getAppointmentForPrefill(appointmentId);
  }, [
    isEdit,
    isResolved,
    canCreateSchedulingRecords,
    resourceId,
    values.appointment_id,
    context.appointmentId,
    resetAppointmentPrefill,
    getAppointmentForPrefill,
  ]);

  useEffect(() => {
    const appointmentRecord = appointmentPrefillData && typeof appointmentPrefillData === 'object' && !Array.isArray(appointmentPrefillData)
      ? appointmentPrefillData
      : null;
    if (!appointmentRecord || isEdit) return;

    if (resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS) {
      if (!sanitizeString(values.participant_patient_id) && sanitizeString(appointmentRecord.patient_id)) {
        setFieldValue('participant_patient_id', sanitizeString(appointmentRecord.patient_id));
      }
      if (!sanitizeString(values.participant_user_id) && sanitizeString(appointmentRecord.provider_user_id)) {
        setFieldValue('participant_user_id', sanitizeString(appointmentRecord.provider_user_id));
      }
      return;
    }

    if (resourceId === SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS) {
      if (!sanitizeString(values.scheduled_at)) {
        setFieldValue('scheduled_at', resolveReminderDateFromAppointment(appointmentRecord));
      }
      return;
    }

    if (resourceId === SCHEDULING_RESOURCE_IDS.VISIT_QUEUES) {
      if (!sanitizeString(values.patient_id) && sanitizeString(appointmentRecord.patient_id)) {
        setFieldValue('patient_id', sanitizeString(appointmentRecord.patient_id));
      }
      if (!sanitizeString(values.provider_user_id) && sanitizeString(appointmentRecord.provider_user_id)) {
        setFieldValue('provider_user_id', sanitizeString(appointmentRecord.provider_user_id));
      }
      if (!sanitizeString(values.facility_id) && sanitizeString(appointmentRecord.facility_id)) {
        setFieldValue('facility_id', sanitizeString(appointmentRecord.facility_id));
      }
      if (!sanitizeString(values.queued_at)) {
        setFieldValue('queued_at', toDateTimeInputValue(new Date().toISOString()));
      }
    }
  }, [
    appointmentPrefillData,
    isEdit,
    resourceId,
    values.participant_patient_id,
    values.participant_user_id,
    values.scheduled_at,
    values.patient_id,
    values.provider_user_id,
    values.facility_id,
    values.queued_at,
    setFieldValue,
  ]);

  useEffect(() => {
    if (resourceId !== SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS || isEdit) return;
    if (!sanitizeString(values.schedule_id)) return;
    if (sanitizeString(values.start_time) && sanitizeString(values.end_time)) return;
    const window = buildDefaultDateTimeWindow();
    if (!sanitizeString(values.start_time)) {
      setFieldValue('start_time', window.start);
    }
    if (!sanitizeString(values.end_time)) {
      setFieldValue('end_time', window.end);
    }
  }, [
    resourceId,
    isEdit,
    values.schedule_id,
    values.start_time,
    values.end_time,
    setFieldValue,
  ]);

  useEffect(() => {
    if (!record || !config) return;
    initializeValues(record);
  }, [record, config, initializeValues]);

  useEffect(() => {
    if (!record || !config || canManageAllTenants || !config.requiresTenant) return;
    const recordTenantId = sanitizeString(record.tenant_id);
    if (!recordTenantId || recordTenantId !== normalizedTenantId) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [record, config, canManageAllTenants, normalizedTenantId, router, listPath]);

  useEffect(() => {
    if (!isEdit || !config || !isResolved) return;
    if (record) return;
    if (isAccessDeniedError(errorCode)) {
      router.replace(`${listPath}${listPath.includes('?') ? '&' : '?'}notice=accessDenied`);
    }
  }, [isEdit, config, isResolved, record, errorCode, router, listPath]);

  const submitErrorMessage = useMemo(() => {
    if (!config) return null;
    return resolveErrorMessage(t, errorCode, `${config.i18nKey}.form.submitErrorMessage`);
  }, [config, t, errorCode]);

  const errors = useMemo(() => {
    if (!config) return {};

    const nextErrors = {};
    const tenantValue = sanitizeString(values.tenant_id);

    if (config.requiresTenant && !tenantValue) {
      nextErrors.tenant_id = t('scheduling.common.form.tenantRequired');
    }

    config.fields.forEach((field) => {
      const rawValue = values[field.name];
      const stringValue = field.type === 'switch' ? rawValue : sanitizeString(rawValue);

      if (field.type === 'repeater') {
        const itemCount = Array.isArray(rawValue) ? rawValue.length : 0;
        if (field.required && itemCount <= 0) {
          nextErrors[field.name] = t('scheduling.common.form.requiredField');
        }
        return;
      }

      if (field.required && !stringValue) {
        nextErrors[field.name] = t('scheduling.common.form.requiredField');
        return;
      }

      if (field.maxLength && typeof stringValue === 'string' && stringValue.length > field.maxLength) {
        nextErrors[field.name] = t('scheduling.common.form.maxLength', { max: field.maxLength });
      }
    });

    if (typeof config.validate === 'function') {
      const configErrors = config.validate(values, t) || {};
      Object.entries(configErrors).forEach(([key, value]) => {
        if (value) {
          nextErrors[key] = value;
        }
      });
    }

    return nextErrors;
  }, [config, values, t]);

  const isSubmitDisabled =
    !isResolved ||
    isLoading ||
    Object.keys(errors).length > 0 ||
    (isEdit ? !canEditSchedulingRecords : !canCreateSchedulingRecords);

  const lookupStateByField = useMemo(() => {
    const result = {};
    lookupFields.forEach((field) => {
      result[field.name] = {
        query: lookupQueries[field.name] || '',
        options: lookupOptionsByField[field.name] || [],
        isLoading: Boolean(lookupLoadingByField[field.name]),
        error: lookupErrorByField[field.name] || null,
      };
    });
    return result;
  }, [lookupFields, lookupQueries, lookupOptionsByField, lookupLoadingByField, lookupErrorByField]);

  const handleSubmit = useCallback(async () => {
    if (!config || isSubmitDisabled) return;

    const payload = {
      ...config.toPayload(values),
    };

    if (config.requiresTenant) {
      payload.tenant_id = sanitizeString(values.tenant_id);
      if (!canManageAllTenants) {
        payload.tenant_id = normalizedTenantId;
      }
    }

    if (config.supportsFacility) {
      payload.facility_id = sanitizeString(values.facility_id) || undefined;
      if (!canManageAllTenants && normalizedFacilityId && !payload.facility_id) {
        payload.facility_id = normalizedFacilityId;
      }
    }

    try {
      const result = isEdit && routeRecordId
        ? await update(routeRecordId, payload)
        : await create(payload);

      if (!result) return;

      const noticeType = isOffline ? 'queued' : isEdit ? 'updated' : 'created';
      const separator = listPath.includes('?') ? '&' : '?';
      router.replace(`${listPath}${separator}notice=${noticeType}`);
    } catch {
      // Hook-level error handling already updates state.
    }
  }, [
    config,
    isSubmitDisabled,
    values,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    isEdit,
    routeRecordId,
    update,
    create,
    isOffline,
    listPath,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push(listPath);
  }, [router, listPath]);

  const tenantLocked = Boolean(config?.requiresTenant && (!canManageAllTenants || isEdit));

  return {
    config,
    context,
    isEdit,
    values,
    setFieldValue,
    setLookupQuery,
    lookupStateByField,
    addRepeaterItem,
    removeRepeaterItem,
    setRepeaterFieldValue,
    errors,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    submitErrorMessage,
    isOffline,
    record,
    tenantLocked,
    tenantHint: tenantLocked
      ? t('scheduling.common.form.tenantLockedHint')
      : t('scheduling.common.form.tenantHint'),
    canCreateSchedulingRecords,
    canEditSchedulingRecords,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isSubmitDisabled,
  };
};

export default useSchedulingResourceFormScreen;
