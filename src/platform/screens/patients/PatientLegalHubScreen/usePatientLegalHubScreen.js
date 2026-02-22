import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useConsent,
  useI18n,
  useNetwork,
  usePatient,
  usePatientAccess,
  useTermsAcceptance,
  useUser,
} from '@hooks';
import { confirmAction } from '@utils';
import {
  isEntitlementDeniedError,
  resolveErrorMessage,
  resolvePatientDisplayLabel,
  resolveUserDisplayLabel,
} from '../patientScreenUtils';

const VALID_TABS = new Set(['consents', 'terms']);
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeString = (value) => String(value || '').trim();
const getScalarParam = (value) => {
  if (Array.isArray(value)) return value[0];
  return value;
};
const resolveItems = (value) => {
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value)) return value;
  return [];
};
const toIsoDateTime = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  if (DATE_ONLY_REGEX.test(normalized)) return `${normalized}T00:00:00.000Z`;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const sanitizeTab = (value) => {
  const normalized = sanitizeString(value).toLowerCase();
  return VALID_TABS.has(normalized) ? normalized : 'consents';
};

const buildLegalPath = (tab) => {
  const normalizedTab = sanitizeTab(tab);
  return `/patients/legal?tab=${normalizedTab}`;
};

const resolvePatientLabel = (record, patientLabelsById, fallback) => {
  const directLabel = sanitizeString(
    record?.patient_display_label
    || record?.patient_name
    || record?.patient_label
    || record?.patient_human_friendly_id
  );
  if (directLabel) return directLabel;

  const patientId = sanitizeString(record?.patient_id);
  if (patientId && patientLabelsById && patientLabelsById[patientId]) {
    return patientLabelsById[patientId];
  }

  return fallback;
};

const resolveTermsUserLabel = (record, userLabelsById, fallback) => {
  const directLabel = sanitizeString(
    record?.user_display_label
    || record?.user_name
    || record?.user_email
    || record?.user_human_friendly_id
  );
  if (directLabel) return directLabel;

  const userId = sanitizeString(record?.user_id);
  if (userId && userLabelsById && userLabelsById[userId]) {
    return userLabelsById[userId];
  }

  return fallback;
};

const validateConsentDraft = (values, t, isEditMode) => {
  const errors = {};

  if (!isEditMode && !sanitizeString(values?.patient_id)) {
    errors.patient_id = t('patients.common.form.patientRequired');
  }

  if (!sanitizeString(values?.consent_type)) {
    errors.consent_type = t('patients.common.form.requiredField');
  }

  if (!sanitizeString(values?.status)) {
    errors.status = t('patients.common.form.requiredField');
  }

  const grantedAt = sanitizeString(values?.granted_at);
  if (grantedAt && !DATE_ONLY_REGEX.test(grantedAt)) {
    errors.granted_at = t('patients.common.form.dateFormat');
  }

  const revokedAt = sanitizeString(values?.revoked_at);
  if (revokedAt && !DATE_ONLY_REGEX.test(revokedAt)) {
    errors.revoked_at = t('patients.common.form.dateFormat');
  }

  return errors;
};

const validateTermsDraft = (values, t) => {
  const errors = {};

  if (!sanitizeString(values?.user_id)) {
    errors.user_id = t('patients.common.form.requiredField');
  }

  const version = sanitizeString(values?.version_label);
  if (!version) {
    errors.version_label = t('patients.common.form.requiredField');
  } else if (version.length > 40) {
    errors.version_label = t('patients.common.form.maxLength', { max: 40 });
  }

  return errors;
};

const usePatientLegalHubScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const {
    canAccessPatients,
    canAccessPatientLegalHub,
    canManagePatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = usePatientAccess();

  const consentCrud = useConsent();
  const termsCrud = useTermsAcceptance();
  const patientLookup = usePatient();
  const userLookup = useUser();

  const requestedTab = sanitizeString(getScalarParam(searchParams?.tab));
  const activeTab = sanitizeTab(requestedTab);
  const normalizedTenantId = sanitizeString(tenantId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
      return;
    }

    if (!requestedTab) return;
    if (sanitizeTab(requestedTab) !== requestedTab.toLowerCase()) {
      router.replace(buildLegalPath(activeTab));
    }
  }, [
    isResolved,
    canAccessPatients,
    hasScope,
    requestedTab,
    activeTab,
    router,
  ]);

  const fetchConsents = useCallback(() => {
    if (isOffline || !canAccessPatients) return;

    const params = {
      page: 1,
      limit: 100,
      sort_by: 'updated_at',
      order: 'desc',
    };

    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    }

    consentCrud.reset();
    consentCrud.list(params);
  }, [
    isOffline,
    canAccessPatients,
    canManageAllTenants,
    normalizedTenantId,
    consentCrud,
  ]);

  const fetchTerms = useCallback(() => {
    if (isOffline || !canAccessPatients) return;

    const params = {
      page: 1,
      limit: 100,
      sort_by: 'updated_at',
      order: 'desc',
    };

    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    }

    termsCrud.reset();
    termsCrud.list(params);
  }, [
    isOffline,
    canAccessPatients,
    canManageAllTenants,
    normalizedTenantId,
    termsCrud,
  ]);

  const fetchPatientOptions = useCallback(() => {
    if (isOffline || !canAccessPatients) return;

    const params = {
      page: 1,
      limit: 100,
      sort_by: 'updated_at',
      order: 'desc',
    };

    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    }

    patientLookup.reset();
    patientLookup.list(params);
  }, [
    isOffline,
    canAccessPatients,
    canManageAllTenants,
    normalizedTenantId,
    patientLookup,
  ]);

  const fetchUserOptions = useCallback(() => {
    if (isOffline || !canAccessPatients) return;

    const params = {
      page: 1,
      limit: 100,
      sort_by: 'updated_at',
      order: 'desc',
    };

    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    }

    userLookup.reset();
    userLookup.list(params);
  }, [
    isOffline,
    canAccessPatients,
    canManageAllTenants,
    normalizedTenantId,
    userLookup,
  ]);

  useEffect(() => {
    if (!isResolved || !canAccessPatients || !hasScope || !canAccessPatientLegalHub) return;

    if (activeTab === 'consents') {
      fetchConsents();
      fetchPatientOptions();
      return;
    }

    fetchTerms();
    fetchUserOptions();
  }, [
    isResolved,
    canAccessPatients,
    hasScope,
    canAccessPatientLegalHub,
    activeTab,
    fetchConsents,
    fetchTerms,
    fetchPatientOptions,
    fetchUserOptions,
  ]);

  const patientItems = useMemo(() => resolveItems(patientLookup.data), [patientLookup.data]);
  const userItems = useMemo(() => resolveItems(userLookup.data), [userLookup.data]);

  const patientLabelsById = useMemo(
    () =>
      patientItems.reduce((acc, item, index) => {
        const itemId = sanitizeString(item?.id);
        if (!itemId) return acc;
        acc[itemId] = resolvePatientDisplayLabel(
          item,
          t('patients.common.form.unnamedPatient', { position: index + 1 })
        );
        return acc;
      }, {}),
    [patientItems, t]
  );

  const userLabelsById = useMemo(
    () =>
      userItems.reduce((acc, item, index) => {
        const itemId = sanitizeString(item?.id);
        if (!itemId) return acc;
        acc[itemId] = resolveUserDisplayLabel(
          item,
          t('patients.resources.termsAcceptances.form.unnamedUser', { position: index + 1 })
        );
        return acc;
      }, {}),
    [userItems, t]
  );

  const patientOptions = useMemo(
    () =>
      Object.entries(patientLabelsById).map(([value, label]) => ({
        value,
        label,
      })),
    [patientLabelsById]
  );

  const userOptions = useMemo(
    () =>
      Object.entries(userLabelsById).map(([value, label]) => ({
        value,
        label,
      })),
    [userLabelsById]
  );

  const consentRows = useMemo(() => {
    const items = resolveItems(consentCrud.data);
    return items.map((item, index) => {
      const consentType = sanitizeString(item?.consent_type) || t('patients.legal.tabs.consents');
      const status = sanitizeString(item?.status) || '-';
      const patientLabel = resolvePatientLabel(
        item,
        patientLabelsById,
        t('patients.common.form.unnamedPatient', { position: index + 1 })
      );

      return {
        id: sanitizeString(item?.id),
        title: `${consentType} (${status})`,
        subtitle: patientLabel,
        humanFriendlyId: sanitizeString(item?.human_friendly_id),
        record: item,
      };
    });
  }, [consentCrud.data, patientLabelsById, t]);

  const termsRows = useMemo(() => {
    const items = resolveItems(termsCrud.data);
    return items.map((item, index) => {
      const versionLabel = sanitizeString(item?.version_label)
        || t('patients.legal.labels.version');
      const userLabel = resolveTermsUserLabel(
        item,
        userLabelsById,
        t('patients.resources.termsAcceptances.form.unnamedUser', { position: index + 1 })
      );

      return {
        id: sanitizeString(item?.id),
        title: versionLabel,
        subtitle: userLabel,
        humanFriendlyId: sanitizeString(item?.human_friendly_id),
        record: item,
      };
    });
  }, [termsCrud.data, userLabelsById, t]);

  const rows = activeTab === 'consents' ? consentRows : termsRows;
  const activeCrud = activeTab === 'consents' ? consentCrud : termsCrud;
  const lookupLoading = activeTab === 'consents'
    ? patientLookup.isLoading
    : userLookup.isLoading;

  const openCreateConsentEditor = useCallback(() => {
    setEditor({
      tab: 'consents',
      mode: 'create',
      recordId: '',
      values: {
        patient_id: '',
        consent_type: '',
        status: '',
        granted_at: '',
        revoked_at: '',
      },
      errors: {},
    });
  }, []);

  const openEditConsentEditor = useCallback((row) => {
    const record = row?.record || {};
    setEditor({
      tab: 'consents',
      mode: 'edit',
      recordId: sanitizeString(row?.id),
      values: {
        patient_id: sanitizeString(record?.patient_id),
        consent_type: sanitizeString(record?.consent_type),
        status: sanitizeString(record?.status),
        granted_at: sanitizeString(record?.granted_at).slice(0, 10),
        revoked_at: sanitizeString(record?.revoked_at).slice(0, 10),
      },
      errors: {},
    });
  }, []);

  const openCreateTermsEditor = useCallback(() => {
    setEditor({
      tab: 'terms',
      mode: 'create',
      recordId: '',
      values: {
        user_id: '',
        version_label: '',
      },
      errors: {},
    });
  }, []);

  const onStartCreate = useCallback(() => {
    if (!canManagePatientRecords) return;

    if (activeTab === 'consents') {
      openCreateConsentEditor();
      return;
    }

    openCreateTermsEditor();
  }, [
    canManagePatientRecords,
    activeTab,
    openCreateConsentEditor,
    openCreateTermsEditor,
  ]);

  const onStartEdit = useCallback((row) => {
    if (!canManagePatientRecords || activeTab !== 'consents') return;
    openEditConsentEditor(row);
  }, [canManagePatientRecords, activeTab, openEditConsentEditor]);

  const onCloseEditor = useCallback(() => {
    setEditor(null);
  }, []);

  const onEditorChange = useCallback((name, value) => {
    setEditor((current) => {
      if (!current) return current;
      return {
        ...current,
        values: { ...current.values, [name]: value },
        errors: { ...current.errors, [name]: undefined },
      };
    });
  }, []);

  const onSubmitEditor = useCallback(async () => {
    if (!editor || !canManagePatientRecords) return;

    if (editor.tab === 'consents') {
      const nextErrors = validateConsentDraft(editor.values, t, editor.mode === 'edit');
      if (Object.keys(nextErrors).length > 0) {
        setEditor((current) => (current ? { ...current, errors: nextErrors } : current));
        return;
      }

      const payload = {
        consent_type: sanitizeString(editor.values.consent_type),
        status: sanitizeString(editor.values.status),
        granted_at: toIsoDateTime(editor.values.granted_at) || undefined,
        revoked_at: toIsoDateTime(editor.values.revoked_at) || undefined,
      };

      let result;
      if (editor.mode === 'edit') {
        result = await consentCrud.update(editor.recordId, payload);
      } else {
        result = await consentCrud.create({
          ...payload,
          patient_id: sanitizeString(editor.values.patient_id),
        });
      }

      if (!result) return;
      onCloseEditor();
      fetchConsents();
      return;
    }

    const nextErrors = validateTermsDraft(editor.values, t);
    if (Object.keys(nextErrors).length > 0) {
      setEditor((current) => (current ? { ...current, errors: nextErrors } : current));
      return;
    }

    const result = await termsCrud.create({
      user_id: sanitizeString(editor.values.user_id),
      version_label: sanitizeString(editor.values.version_label),
    });

    if (!result) return;
    onCloseEditor();
    fetchTerms();
  }, [
    editor,
    canManagePatientRecords,
    t,
    consentCrud,
    termsCrud,
    onCloseEditor,
    fetchConsents,
    fetchTerms,
  ]);

  const onDeleteRecord = useCallback(async (row) => {
    if (!canDeletePatientRecords || !row?.id) return;

    if (!confirmAction(t('patients.legal.state.deleteConfirm'))) return;

    if (activeTab === 'consents') {
      const result = await consentCrud.remove(row.id);
      if (!result) return;
      fetchConsents();
      return;
    }

    const result = await termsCrud.remove(row.id);
    if (!result) return;
    fetchTerms();
  }, [
    canDeletePatientRecords,
    t,
    activeTab,
    consentCrud,
    termsCrud,
    fetchConsents,
    fetchTerms,
  ]);

  const consentTypeOptions = useMemo(
    () => [
      { value: 'TREATMENT', label: t('patients.resources.consents.options.consentType.treatment') },
      { value: 'DATA_SHARING', label: t('patients.resources.consents.options.consentType.dataSharing') },
      { value: 'RESEARCH', label: t('patients.resources.consents.options.consentType.research') },
      { value: 'BILLING', label: t('patients.resources.consents.options.consentType.billing') },
      { value: 'OTHER', label: t('patients.resources.consents.options.consentType.other') },
    ],
    [t]
  );

  const consentStatusOptions = useMemo(
    () => [
      { value: 'GRANTED', label: t('patients.resources.consents.options.status.granted') },
      { value: 'REVOKED', label: t('patients.resources.consents.options.status.revoked') },
      { value: 'PENDING', label: t('patients.resources.consents.options.status.pending') },
    ],
    [t]
  );

  const activeErrorCode = activeCrud.errorCode;
  const isEntitlementBlocked = !canAccessPatientLegalHub
    || isEntitlementDeniedError(activeErrorCode);
  const hasError = Boolean(activeErrorCode) && !isEntitlementBlocked;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, activeErrorCode, 'patients.legal.state.loadError'),
    [t, activeErrorCode]
  );

  const onSelectTab = useCallback((tab) => {
    const normalizedTab = sanitizeTab(tab);
    setEditor(null);
    router.replace(buildLegalPath(normalizedTab));
  }, [router]);

  const onRetry = useCallback(() => {
    if (activeTab === 'consents') {
      fetchConsents();
      fetchPatientOptions();
      return;
    }

    fetchTerms();
    fetchUserOptions();
  }, [activeTab, fetchConsents, fetchPatientOptions, fetchTerms, fetchUserOptions]);

  return {
    activeTab,
    tabs: ['consents', 'terms'],
    rows,
    editor,
    patientOptions,
    userOptions,
    consentTypeOptions,
    consentStatusOptions,
    isLoading: !isResolved || activeCrud.isLoading || lookupLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    canManagePatientRecords,
    canDeletePatientRecords,
    onSelectTab,
    onRetry,
    onStartCreate,
    onStartEdit,
    onCloseEditor,
    onEditorChange,
    onSubmitEditor,
    onDeleteRecord,
    onGoToSubscriptions: () => router.push('/subscriptions/subscriptions'),
  };
};

export default usePatientLegalHubScreen;
