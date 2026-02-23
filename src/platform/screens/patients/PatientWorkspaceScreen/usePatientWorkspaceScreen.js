import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n, useNetwork, usePatient, usePatientAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  getPatientResourceConfig,
  PATIENT_RESOURCE_IDS,
} from '../patientResourceConfigs';
import {
  isEntitlementDeniedError,
  resolveErrorMessage,
} from '../patientScreenUtils';
import usePatientAllergy from '@hooks/usePatientAllergy';
import usePatientContact from '@hooks/usePatientContact';
import usePatientDocument from '@hooks/usePatientDocument';
import usePatientGuardian from '@hooks/usePatientGuardian';
import usePatientIdentifier from '@hooks/usePatientIdentifier';
import usePatientMedicalHistory from '@hooks/usePatientMedicalHistory';
import useConsent from '@hooks/useConsent';

const TAB_TO_PANELS = Object.freeze({
  summary: ['summary'],
  identity: ['identifiers', 'contacts', 'guardians'],
  care: ['allergies', 'histories'],
  documents: ['documents'],
  consents: ['consents'],
});

const PANEL_TO_RESOURCE_ID = Object.freeze({
  identifiers: PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS,
  contacts: PATIENT_RESOURCE_IDS.PATIENT_CONTACTS,
  guardians: PATIENT_RESOURCE_IDS.PATIENT_GUARDIANS,
  allergies: PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES,
  histories: PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES,
  documents: PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS,
  consents: PATIENT_RESOURCE_IDS.CONSENTS,
});

const VALID_MODES = new Set(['create', 'edit']);

const sanitizeString = (value) => String(value || '').trim();
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const getScalarParam = (value) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const resolveItems = (value) => {
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value)) return value;
  return [];
};

const sanitizeTab = (value) => {
  const normalized = sanitizeString(value).toLowerCase();
  return Object.prototype.hasOwnProperty.call(TAB_TO_PANELS, normalized)
    ? normalized
    : 'summary';
};

const sanitizePanel = (value, tab) => {
  const normalized = sanitizeString(value).toLowerCase();
  const panelCandidates = TAB_TO_PANELS[tab] || TAB_TO_PANELS.summary;
  if (panelCandidates.includes(normalized)) return normalized;
  return panelCandidates[0];
};

const sanitizeMode = (value) => {
  const normalized = sanitizeString(value).toLowerCase();
  return VALID_MODES.has(normalized) ? normalized : '';
};

const validateValues = (fields, values, t) => {
  const errors = {};

  (fields || []).forEach((field) => {
    const rawValue = values?.[field.name];
    const normalized = typeof rawValue === 'boolean' ? rawValue : sanitizeString(rawValue);

    if (field.required) {
      const hasValue = typeof normalized === 'boolean' ? true : Boolean(normalized);
      if (!hasValue) {
        errors[field.name] = t('patients.common.form.requiredField');
        return;
      }
    }

    if (field.maxLength && typeof normalized === 'string' && normalized.length > field.maxLength) {
      errors[field.name] = t('patients.common.form.maxLength', { max: field.maxLength });
      return;
    }

    if (
      (field.name === 'date_of_birth' || field.name === 'diagnosis_date')
      && normalized
      && typeof normalized === 'string'
      && !DATE_ONLY_REGEX.test(normalized)
    ) {
      errors[field.name] = t('patients.common.form.dateFormat');
    }
  });

  return errors;
};

const resolvePatientSummaryValues = (patient) => ({
  first_name: sanitizeString(patient?.first_name),
  last_name: sanitizeString(patient?.last_name),
  date_of_birth: sanitizeString(patient?.date_of_birth).slice(0, 10),
  gender: sanitizeString(patient?.gender),
  is_active: patient?.is_active !== false,
});

const usePatientWorkspaceScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const {
    canAccessPatients,
    canManagePatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = usePatientAccess();

  const patientCrud = usePatient();
  const identifierCrud = usePatientIdentifier();
  const contactCrud = usePatientContact();
  const guardianCrud = usePatientGuardian();
  const allergyCrud = usePatientAllergy();
  const historyCrud = usePatientMedicalHistory();
  const documentCrud = usePatientDocument();
  const consentCrud = useConsent();

  const patientId = sanitizeString(getScalarParam(searchParams?.id));
  const requestedTab = sanitizeString(getScalarParam(searchParams?.tab));
  const requestedPanel = sanitizeString(getScalarParam(searchParams?.panel));
  const requestedMode = sanitizeString(getScalarParam(searchParams?.mode));
  const requestedRecordId = sanitizeString(getScalarParam(searchParams?.recordId));

  const activeTab = sanitizeTab(requestedTab);
  const activePanel = sanitizePanel(requestedPanel, activeTab);
  const mode = (!isResolved || canManagePatientRecords)
    ? sanitizeMode(requestedMode)
    : '';

  const normalizedTenantId = sanitizeString(tenantId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const isSummaryEditMode = activeTab === 'summary' && mode === 'edit';

  const panelHookMap = useMemo(
    () => ({
      identifiers: identifierCrud,
      contacts: contactCrud,
      guardians: guardianCrud,
      allergies: allergyCrud,
      histories: historyCrud,
      documents: documentCrud,
      consents: consentCrud,
    }),
    [
      identifierCrud,
      contactCrud,
      guardianCrud,
      allergyCrud,
      historyCrud,
      documentCrud,
      consentCrud,
    ]
  );

  const activePanelHook = panelHookMap[activePanel] || null;
  const activeResourceId = PANEL_TO_RESOURCE_ID[activePanel];
  const activePanelConfig = activeResourceId
    ? getPatientResourceConfig(activeResourceId)
    : null;

  const buildWorkspacePath = useCallback(
    ({ tab = activeTab, panel = activePanel, nextMode = '', recordId = '' } = {}) => {
      const normalizedTab = sanitizeTab(tab);
      const normalizedPanel = sanitizePanel(panel, normalizedTab);
      const params = new URLSearchParams();

      if (normalizedTab && normalizedTab !== 'summary') {
        params.set('tab', normalizedTab);
      }
      if (normalizedPanel && normalizedPanel !== TAB_TO_PANELS[normalizedTab][0]) {
        params.set('panel', normalizedPanel);
      }
      if (sanitizeMode(nextMode)) {
        params.set('mode', sanitizeMode(nextMode));
      }
      if (sanitizeMode(nextMode) === 'edit' && sanitizeString(recordId)) {
        params.set('recordId', sanitizeString(recordId));
      }

      const query = params.toString();
      return query
        ? `/patients/patients/${patientId}?${query}`
        : `/patients/patients/${patientId}`;
    },
    [activePanel, activeTab, patientId]
  );

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
      return;
    }
    if (!patientId) {
      router.replace('/patients/patients');
      return;
    }

    const expectedPath = buildWorkspacePath({
      tab: activeTab,
      panel: activePanel,
      nextMode: mode,
      recordId: requestedRecordId,
    });
    const expectedSuffix = expectedPath.split(`/patients/patients/${patientId}`)[1] || '';
    const currentSuffix = (() => {
      const params = new URLSearchParams();
      if (requestedTab) params.set('tab', requestedTab);
      if (requestedPanel) params.set('panel', requestedPanel);
      if (requestedMode) params.set('mode', requestedMode);
      if (requestedRecordId) params.set('recordId', requestedRecordId);
      const raw = params.toString();
      return raw ? `?${raw}` : '';
    })();
    if (expectedSuffix !== currentSuffix) {
      router.replace(expectedPath);
    }
  }, [
    isResolved,
    canAccessPatients,
    hasScope,
    patientId,
    requestedTab,
    requestedPanel,
    requestedMode,
    requestedRecordId,
    activeTab,
    activePanel,
    mode,
    buildWorkspacePath,
    router,
  ]);

  const fetchPatient = useCallback(() => {
    if (!patientId || isOffline || !canAccessPatients) return;
    patientCrud.reset();
    patientCrud.get(patientId);
  }, [patientId, isOffline, canAccessPatients, patientCrud]);

  const fetchPanelRecords = useCallback(
    (panelKey = activePanel) => {
      if (panelKey === 'summary' || !panelHookMap[panelKey] || isOffline || !patientId) return;

      const params = {
        page: 1,
        limit: 100,
        sort_by: 'updated_at',
        order: 'desc',
        patient_id: patientId,
      };
      if (!canManageAllTenants && normalizedTenantId) {
        params.tenant_id = normalizedTenantId;
      }

      const hook = panelHookMap[panelKey];
      hook.reset();
      hook.list(params);
    },
    [
      activePanel,
      panelHookMap,
      isOffline,
      patientId,
      canManageAllTenants,
      normalizedTenantId,
    ]
  );

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  useEffect(() => {
    fetchPanelRecords(activePanel);
  }, [activePanel, fetchPanelRecords]);

  const patient = useMemo(() => patientCrud.data || null, [patientCrud.data]);
  const panelItems = useMemo(
    () => resolveItems(activePanelHook?.data),
    [activePanelHook?.data]
  );

  const [summaryValues, setSummaryValues] = useState(resolvePatientSummaryValues(patient));
  const [summaryErrors, setSummaryErrors] = useState({});
  useEffect(() => {
    setSummaryValues(resolvePatientSummaryValues(patient));
    setSummaryErrors({});
  }, [patient]);

  const [panelDraft, setPanelDraft] = useState(null);
  const draftSignatureRef = useRef('');

  useEffect(() => {
    if (!activePanelConfig || activePanel === 'summary') {
      setPanelDraft(null);
      draftSignatureRef.current = '';
      return;
    }

    if (!mode) {
      setPanelDraft(null);
      draftSignatureRef.current = '';
      return;
    }

    const signature = `${activePanel}:${mode}:${requestedRecordId}`;
    if (signature === draftSignatureRef.current) return;

    if (mode === 'create') {
      const baseValues = activePanelConfig.getInitialValues
        ? activePanelConfig.getInitialValues({}, {})
        : {};
      setPanelDraft({
        panel: activePanel,
        mode: 'create',
        recordId: '',
        values: baseValues,
        errors: {},
      });
      draftSignatureRef.current = signature;
      return;
    }

    const existing = panelItems.find((item) => sanitizeString(item?.id) === requestedRecordId);
    if (!existing) return;

    const baseValues = activePanelConfig.getInitialValues
      ? activePanelConfig.getInitialValues(existing, {})
      : {};
    setPanelDraft({
      panel: activePanel,
      mode: 'edit',
      recordId: requestedRecordId,
      values: baseValues,
      errors: {},
    });
    draftSignatureRef.current = signature;
  }, [activePanelConfig, activePanel, mode, requestedRecordId, panelItems]);

  const genderOptions = useMemo(
    () => [
      { value: 'MALE', label: t('patients.resources.patients.options.gender.male') },
      { value: 'FEMALE', label: t('patients.resources.patients.options.gender.female') },
      { value: 'OTHER', label: t('patients.resources.patients.options.gender.other') },
      { value: 'UNKNOWN', label: t('patients.resources.patients.options.gender.unknown') },
    ],
    [t]
  );

  const onSelectTab = useCallback(
    (tab) => {
      const normalizedTab = sanitizeTab(tab);
      const defaultPanel = TAB_TO_PANELS[normalizedTab][0];
      router.replace(
        buildWorkspacePath({
          tab: normalizedTab,
          panel: defaultPanel,
        })
      );
    },
    [buildWorkspacePath, router]
  );

  const onSelectPanel = useCallback(
    (panel) => {
      router.replace(
        buildWorkspacePath({
          tab: activeTab,
          panel,
        })
      );
    },
    [activeTab, buildWorkspacePath, router]
  );

  const closeEditor = useCallback(() => {
    setPanelDraft(null);
    draftSignatureRef.current = '';
    router.replace(
      buildWorkspacePath({
        tab: activeTab,
        panel: activePanel,
      })
    );
  }, [activePanel, activeTab, buildWorkspacePath, router]);

  const onStartCreate = useCallback(() => {
    if (!canManagePatientRecords || activePanel === 'summary') return;
    router.replace(
      buildWorkspacePath({
        tab: activeTab,
        panel: activePanel,
        nextMode: 'create',
      })
    );
  }, [activePanel, activeTab, buildWorkspacePath, canManagePatientRecords, router]);

  const onStartEditRecord = useCallback(
    (recordId) => {
      if (!canManagePatientRecords || activePanel === 'summary') return;
      const normalizedRecordId = sanitizeString(recordId);
      if (!normalizedRecordId) return;
      router.replace(
        buildWorkspacePath({
          tab: activeTab,
          panel: activePanel,
          nextMode: 'edit',
          recordId: normalizedRecordId,
        })
      );
    },
    [activePanel, activeTab, buildWorkspacePath, canManagePatientRecords, router]
  );

  const onDeleteRecord = useCallback(
    async (recordId) => {
      if (!canDeletePatientRecords || !activePanelHook || activePanel === 'summary') return;
      const normalizedRecordId = sanitizeString(recordId);
      if (!normalizedRecordId) return;
      if (!confirmAction(t('patients.workspace.state.deleteConfirm'))) return;
      await activePanelHook.remove(normalizedRecordId);
      fetchPanelRecords(activePanel);
    },
    [
      canDeletePatientRecords,
      activePanelHook,
      activePanel,
      t,
      fetchPanelRecords,
    ]
  );

  const onDeletePatient = useCallback(async () => {
    if (!canDeletePatientRecords || !patientId) return;
    if (typeof patientCrud.remove !== 'function') return;
    if (!confirmAction(t('patients.workspace.state.deletePatientConfirm'))) return;

    const result = await patientCrud.remove(patientId);
    if (result === undefined) return;

    router.replace('/patients/patients');
  }, [canDeletePatientRecords, patientCrud, patientId, router, t]);

  const onPanelDraftChange = useCallback((name, value) => {
    setPanelDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        values: { ...current.values, [name]: value },
        errors: { ...current.errors, [name]: undefined },
      };
    });
  }, []);

  const onPanelSubmit = useCallback(async () => {
    if (!panelDraft || !activePanelConfig || !activePanelHook || !canManagePatientRecords) return;
    const fields = activePanelConfig.fields || [];
    const nextErrors = validateValues(fields, panelDraft.values, t);
    if (Object.keys(nextErrors).length > 0) {
      setPanelDraft((current) => (current ? { ...current, errors: nextErrors } : current));
      return;
    }

    const payloadBase = activePanelConfig.toPayload
      ? activePanelConfig.toPayload(panelDraft.values)
      : { ...panelDraft.values };
    const payload = {
      ...payloadBase,
      patient_id: patientId,
    };

    const tenantForPayload = sanitizeString(patient?.tenant_id) || normalizedTenantId;
    if (tenantForPayload) {
      payload.tenant_id = tenantForPayload;
    }

    if (panelDraft.mode === 'edit') {
      await activePanelHook.update(panelDraft.recordId, payload);
    } else {
      await activePanelHook.create(payload);
    }

    closeEditor();
    fetchPanelRecords(activePanel);
  }, [
    panelDraft,
    activePanelConfig,
    activePanelHook,
    canManagePatientRecords,
    t,
    patientId,
    patient?.tenant_id,
    normalizedTenantId,
    closeEditor,
    fetchPanelRecords,
    activePanel,
  ]);

  const onSummaryFieldChange = useCallback((name, value) => {
    setSummaryValues((current) => ({ ...current, [name]: value }));
    setSummaryErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const onStartSummaryEdit = useCallback(() => {
    if (!canManagePatientRecords) return;
    router.replace(
      buildWorkspacePath({
        tab: 'summary',
        panel: 'summary',
        nextMode: 'edit',
      })
    );
  }, [buildWorkspacePath, canManagePatientRecords, router]);

  const onCancelSummaryEdit = useCallback(() => {
    setSummaryErrors({});
    setSummaryValues(resolvePatientSummaryValues(patient));
    router.replace(
      buildWorkspacePath({
        tab: 'summary',
        panel: 'summary',
      })
    );
  }, [buildWorkspacePath, patient, router]);

  const onSaveSummary = useCallback(async () => {
    if (!canManagePatientRecords || !patientId) return;
    const nextErrors = validateValues(
      [
        { name: 'first_name', required: true, maxLength: 120 },
        { name: 'last_name', required: true, maxLength: 120 },
        { name: 'date_of_birth' },
      ],
      summaryValues,
      t
    );
    if (Object.keys(nextErrors).length > 0) {
      setSummaryErrors(nextErrors);
      return;
    }

    const payload = {
      first_name: sanitizeString(summaryValues.first_name),
      last_name: sanitizeString(summaryValues.last_name),
      date_of_birth: sanitizeString(summaryValues.date_of_birth)
        ? `${sanitizeString(summaryValues.date_of_birth)}T00:00:00.000Z`
        : undefined,
      gender: sanitizeString(summaryValues.gender) || undefined,
      is_active: summaryValues.is_active !== false,
    };

    await patientCrud.update(patientId, payload);
    fetchPatient();
    onCancelSummaryEdit();
  }, [
    canManagePatientRecords,
    patientId,
    summaryValues,
    t,
    patientCrud,
    fetchPatient,
    onCancelSummaryEdit,
  ]);

  const panelRows = useMemo(() => {
    if (!activePanelConfig) return [];
    return panelItems.map((item, index) => {
      const title = sanitizeString(activePanelConfig.getItemTitle?.(item, t))
        || t('patients.common.list.unnamedRecord', { position: index + 1 });
      const subtitle = sanitizeString(activePanelConfig.getItemSubtitle?.(item, t));
      return {
        id: sanitizeString(item?.id),
        title,
        subtitle,
        humanFriendlyId: sanitizeString(item?.human_friendly_id) || '',
      };
    });
  }, [activePanelConfig, panelItems, t]);

  const isEntitlementBlocked = isEntitlementDeniedError(
    patientCrud.errorCode || activePanelHook?.errorCode
  );
  const hasError = Boolean(patientCrud.errorCode || activePanelHook?.errorCode) && !isEntitlementBlocked;
  const errorMessage = useMemo(
    () => resolveErrorMessage(
      t,
      patientCrud.errorCode || activePanelHook?.errorCode,
      'patients.workspace.state.loadError'
    ),
    [t, patientCrud.errorCode, activePanelHook?.errorCode]
  );

  const panelOptions = TAB_TO_PANELS[activeTab];
  const tabs = Object.keys(TAB_TO_PANELS);

  return {
    patientId,
    patient,
    tabs,
    activeTab,
    panelOptions,
    activePanel,
    panelRows,
    activePanelConfig,
    panelDraft,
    mode,
    isSummaryEditMode,
    summaryValues,
    summaryErrors,
    genderOptions,
    isLoading: !isResolved || patientCrud.isLoading || activePanelHook?.isLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    canManagePatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    onSelectTab,
    onSelectPanel,
    onRetry: () => {
      fetchPatient();
      fetchPanelRecords(activePanel);
    },
    onGoToSubscriptions: () => router.push('/subscriptions/subscriptions'),
    onStartCreate,
    onDeletePatient,
    onStartEditRecord,
    onDeleteRecord,
    onPanelDraftChange,
    onPanelSubmit,
    onClosePanelEditor: closeEditor,
    onSummaryFieldChange,
    onStartSummaryEdit,
    onCancelSummaryEdit,
    onSaveSummary,
  };
};

export default usePatientWorkspaceScreen;
