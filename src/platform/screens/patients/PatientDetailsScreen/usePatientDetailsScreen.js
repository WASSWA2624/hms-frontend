import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useFacility,
  useI18n,
  useNetwork,
  usePatient,
  usePatientAccess,
} from '@hooks';
import { confirmAction } from '@utils';
import useAddress from '@hooks/useAddress';
import usePatientAllergy from '@hooks/usePatientAllergy';
import usePatientContact from '@hooks/usePatientContact';
import usePatientDocument from '@hooks/usePatientDocument';
import usePatientGuardian from '@hooks/usePatientGuardian';
import usePatientIdentifier from '@hooks/usePatientIdentifier';
import usePatientMedicalHistory from '@hooks/usePatientMedicalHistory';
import {
  getPatientResourceConfig,
  PATIENT_RESOURCE_IDS,
} from '../patientResourceConfigs';
import {
  findRecordByRouteId,
  isEntitlementDeniedError,
  resolveErrorMessage,
} from '../patientScreenUtils';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const RESOURCE_KEYS = Object.freeze({
  IDENTIFIERS: 'identifiers',
  GUARDIANS: 'guardians',
  CONTACTS: 'contacts',
  ALLERGIES: 'allergies',
  HISTORIES: 'histories',
  ADDRESSES: 'addresses',
  DOCUMENTS: 'documents',
});

const EMPTY_RESOURCE_EDITORS = Object.freeze({
  [RESOURCE_KEYS.IDENTIFIERS]: null,
  [RESOURCE_KEYS.GUARDIANS]: null,
  [RESOURCE_KEYS.CONTACTS]: null,
  [RESOURCE_KEYS.ALLERGIES]: null,
  [RESOURCE_KEYS.HISTORIES]: null,
  [RESOURCE_KEYS.ADDRESSES]: null,
  [RESOURCE_KEYS.DOCUMENTS]: null,
});
const DEFAULT_TAB_KEY = 'details';
const WORKSPACE_PANEL_TO_RESOURCE_KEY = Object.freeze({
  identifiers: RESOURCE_KEYS.IDENTIFIERS,
  guardians: RESOURCE_KEYS.GUARDIANS,
  contacts: RESOURCE_KEYS.CONTACTS,
  allergies: RESOURCE_KEYS.ALLERGIES,
  histories: RESOURCE_KEYS.HISTORIES,
  addresses: RESOURCE_KEYS.ADDRESSES,
  documents: RESOURCE_KEYS.DOCUMENTS,
});
const WORKSPACE_PANEL_TO_TAB_KEY = Object.freeze({
  identifiers: 'identity',
  guardians: 'identity',
  contacts: 'contacts',
  allergies: 'care',
  histories: 'care',
  addresses: 'address',
  documents: 'documents',
});
const REALTIME_SYNC_INTERVAL_MS = 10000;
const NOTICE_AUTO_DISMISS_MS = 4500;
const EMPTY_NOTICE_STATE = Object.freeze({ message: '', variant: 'info' });
const EMPTY_RESOURCE_DELETE_STATE = Object.freeze({ resourceKey: '', recordId: '' });

const sanitizeString = (value) => String(value || '').trim();
const parseOptionalNumber = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

const normalizeRouteTabKey = (value) => {
  const normalized = sanitizeString(value).toLowerCase();
  if (!normalized) return DEFAULT_TAB_KEY;

  if (normalized === 'summary' || normalized === 'details') return 'details';
  if (normalized === 'identity' || normalized === 'identifiers') return 'identity';
  if (normalized === 'contacts') return 'contacts';
  if (normalized === 'care') return 'care';
  if (normalized === 'address' || normalized === 'addresses') return 'address';
  if (normalized === 'documents' || normalized === 'docs') return 'documents';

  return DEFAULT_TAB_KEY;
};

const normalizeRoutePanelKey = (value) => {
  const normalized = sanitizeString(value).toLowerCase();
  return WORKSPACE_PANEL_TO_RESOURCE_KEY[normalized] ? normalized : '';
};

const normalizeRouteMode = (value) => {
  const normalized = sanitizeString(value).toLowerCase();
  if (normalized === 'create' || normalized === 'edit') return normalized;
  return '';
};

const resolveRouteIntent = ({ tab, panel, mode, recordId }) => {
  const normalizedPanel = normalizeRoutePanelKey(panel);
  const normalizedTab = normalizeRouteTabKey(tab);
  const modeValue = normalizeRouteMode(mode);
  const resourceKey = normalizedPanel
    ? WORKSPACE_PANEL_TO_RESOURCE_KEY[normalizedPanel]
    : '';
  const tabKey = normalizedPanel
    ? WORKSPACE_PANEL_TO_TAB_KEY[normalizedPanel]
    : normalizedTab;

  return {
    tabKey,
    panelKey: normalizedPanel,
    resourceKey,
    mode: modeValue,
    recordId: sanitizeString(recordId),
  };
};

const getScalarParam = (value) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const resolveItems = (value) => {
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && sanitizeString(value?.id)) {
    return [value];
  }
  return [];
};

const resolveFacilityLabel = (facility, fallbackLabel) => (
  sanitizeString(facility?.name)
  || sanitizeString(facility?.human_friendly_id)
  || sanitizeString(facility?.facility_code)
  || sanitizeString(fallbackLabel)
);

const hasOptionValue = (options, value) => {
  const normalizedValue = sanitizeString(value);
  if (!normalizedValue) return false;
  return (options || []).some((option) => (
    sanitizeString(option?.value) === normalizedValue
  ));
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
      return;
    }

    if (field.type === 'number' && typeof normalized === 'string' && normalized) {
      const numericValue = Number(normalized);
      if (!Number.isFinite(numericValue)) {
        errors[field.name] = t('patients.common.form.invalidNumber');
        return;
      }

      if (typeof field.min === 'number' && numericValue < field.min) {
        errors[field.name] = t('patients.common.form.minValue', { min: field.min });
        return;
      }

      if (typeof field.max === 'number' && numericValue > field.max) {
        errors[field.name] = t('patients.common.form.maxValue', { max: field.max });
      }
    }
  });

  return errors;
};

const resolvePatientSummaryValues = (patient, fallbackFacilityId = '') => ({
  first_name: sanitizeString(patient?.first_name),
  last_name: sanitizeString(patient?.last_name),
  date_of_birth: sanitizeString(patient?.date_of_birth).slice(0, 10),
  gender: sanitizeString(patient?.gender),
  facility_id: sanitizeString(patient?.facility_id || fallbackFacilityId),
  is_active: patient?.is_active !== false,
});

const resolveResourceLabel = (resourceKey, t) => {
  if (resourceKey === RESOURCE_KEYS.IDENTIFIERS) {
    return t('patients.workspace.panels.identifiers');
  }
  if (resourceKey === RESOURCE_KEYS.GUARDIANS) {
    return t('patients.workspace.panels.guardians');
  }
  if (resourceKey === RESOURCE_KEYS.CONTACTS) {
    return t('patients.workspace.panels.contacts');
  }
  if (resourceKey === RESOURCE_KEYS.ALLERGIES) {
    return t('patients.workspace.panels.allergies');
  }
  if (resourceKey === RESOURCE_KEYS.HISTORIES) {
    return t('patients.workspace.panels.histories');
  }
  if (resourceKey === RESOURCE_KEYS.ADDRESSES) {
    return t('address.list.title');
  }
  if (resourceKey === RESOURCE_KEYS.DOCUMENTS) {
    return t('patients.workspace.panels.documents');
  }
  return t('patients.workspace.actions.newRecord');
};

const ADDRESS_RESOURCE_CONFIG = Object.freeze({
  id: RESOURCE_KEYS.ADDRESSES,
  i18nKey: 'address',
  fields: [
    {
      name: 'address_type',
      type: 'select',
      required: true,
      labelKey: 'address.form.typeLabel',
      placeholderKey: 'address.form.typePlaceholder',
      hintKey: 'address.form.typeHint',
      options: [
        { value: 'HOME', labelKey: 'address.types.HOME' },
        { value: 'WORK', labelKey: 'address.types.WORK' },
        { value: 'BILLING', labelKey: 'address.types.BILLING' },
        { value: 'SHIPPING', labelKey: 'address.types.SHIPPING' },
        { value: 'OTHER', labelKey: 'address.types.OTHER' },
      ],
    },
    {
      name: 'line1',
      type: 'text',
      required: true,
      maxLength: 255,
      labelKey: 'address.form.line1Label',
      placeholderKey: 'address.form.line1Placeholder',
      hintKey: 'address.form.line1Hint',
    },
    {
      name: 'line2',
      type: 'text',
      required: false,
      maxLength: 255,
      labelKey: 'address.form.line2Label',
      placeholderKey: 'address.form.line2Placeholder',
      hintKey: 'address.form.line2Hint',
    },
    {
      name: 'city',
      type: 'text',
      required: false,
      maxLength: 120,
      labelKey: 'address.form.cityLabel',
      placeholderKey: 'address.form.cityPlaceholder',
      hintKey: 'address.form.cityHint',
    },
    {
      name: 'state',
      type: 'text',
      required: false,
      maxLength: 120,
      labelKey: 'address.form.stateLabel',
      placeholderKey: 'address.form.statePlaceholder',
      hintKey: 'address.form.stateHint',
    },
    {
      name: 'postal_code',
      type: 'text',
      required: false,
      maxLength: 40,
      labelKey: 'address.form.postalCodeLabel',
      placeholderKey: 'address.form.postalCodePlaceholder',
      hintKey: 'address.form.postalCodeHint',
    },
    {
      name: 'country',
      type: 'country',
      required: false,
      maxLength: 120,
      labelKey: 'address.form.countryLabel',
      placeholderKey: 'address.form.countryPlaceholder',
      hintKey: 'address.form.countryHint',
    },
    {
      name: 'latitude',
      type: 'number',
      required: false,
      labelKey: 'address.form.latitudeLabel',
      placeholderKey: 'address.form.latitudePlaceholder',
      hintKey: 'address.form.latitudeHint',
      min: -90,
      max: 90,
    },
    {
      name: 'longitude',
      type: 'number',
      required: false,
      labelKey: 'address.form.longitudeLabel',
      placeholderKey: 'address.form.longitudePlaceholder',
      hintKey: 'address.form.longitudeHint',
      min: -180,
      max: 180,
    },
  ],
  getInitialValues: (record) => ({
    address_type: sanitizeString(record?.address_type),
    line1: sanitizeString(record?.line1 || record?.line_1),
    line2: sanitizeString(record?.line2 || record?.line_2),
    city: sanitizeString(record?.city),
    state: sanitizeString(record?.state),
    postal_code: sanitizeString(record?.postal_code),
    country: sanitizeString(record?.country),
    latitude: sanitizeString(record?.latitude),
    longitude: sanitizeString(record?.longitude),
  }),
  toPayload: (values) => ({
    address_type: sanitizeString(values.address_type),
    line1: sanitizeString(values.line1),
    line2: sanitizeString(values.line2) || null,
    city: sanitizeString(values.city) || null,
    state: sanitizeString(values.state) || null,
    postal_code: sanitizeString(values.postal_code) || null,
    country: sanitizeString(values.country) || null,
    latitude: parseOptionalNumber(values.latitude),
    longitude: parseOptionalNumber(values.longitude),
  }),
  getItemTitle: (item, t) => sanitizeString(item?.line1 || item?.line_1) || t('address.list.unnamed'),
  getItemSubtitle: (item) => [
    sanitizeString(item?.city),
    sanitizeString(item?.state),
    sanitizeString(item?.postal_code),
    sanitizeString(item?.country),
  ].filter(Boolean).join(', '),
});

const usePatientDetailsScreen = () => {
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
    facilityId,
    isResolved,
  } = usePatientAccess();

  const patientCrud = usePatient();
  const facilityCrud = useFacility();
  const addressCrud = useAddress();
  const allergyCrud = usePatientAllergy();
  const historyCrud = usePatientMedicalHistory();
  const identifierCrud = usePatientIdentifier();
  const contactCrud = usePatientContact();
  const guardianCrud = usePatientGuardian();
  const documentCrud = usePatientDocument();

  const {
    data: patientData,
    errorCode: patientErrorCode,
    get: getPatientRecord,
    update: updatePatientRecord,
    remove: removePatientRecord,
    reset: resetPatientRecord,
  } = patientCrud;

  const {
    data: facilityData,
    isLoading: isFacilityLoading,
    errorCode: facilityErrorCode,
    list: listFacilities,
    reset: resetFacilities,
  } = facilityCrud;

  const {
    data: identifierData,
    isLoading: isIdentifierLoading,
    errorCode: identifierErrorCode,
    list: listIdentifiers,
    create: createIdentifier,
    update: updateIdentifier,
    remove: removeIdentifier,
    reset: resetIdentifiers,
  } = identifierCrud;

  const {
    data: guardianData,
    isLoading: isGuardianLoading,
    errorCode: guardianErrorCode,
    list: listGuardians,
    create: createGuardian,
    update: updateGuardian,
    remove: removeGuardian,
    reset: resetGuardians,
  } = guardianCrud;

  const {
    data: allergyData,
    isLoading: isAllergyLoading,
    errorCode: allergyErrorCode,
    list: listAllergies,
    create: createAllergy,
    update: updateAllergy,
    remove: removeAllergy,
    reset: resetAllergies,
  } = allergyCrud;

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    errorCode: historyErrorCode,
    list: listHistories,
    create: createHistory,
    update: updateHistory,
    remove: removeHistory,
    reset: resetHistories,
  } = historyCrud;

  const {
    data: contactData,
    isLoading: isContactLoading,
    errorCode: contactErrorCode,
    list: listContacts,
    create: createContact,
    update: updateContact,
    remove: removeContact,
    reset: resetContacts,
  } = contactCrud;

  const {
    data: addressData,
    isLoading: isAddressLoading,
    errorCode: addressErrorCode,
    list: listAddresses,
    create: createAddress,
    update: updateAddress,
    remove: removeAddress,
    reset: resetAddresses,
  } = addressCrud;

  const {
    data: documentData,
    isLoading: isDocumentLoading,
    errorCode: documentErrorCode,
    list: listDocuments,
    create: createDocument,
    update: updateDocument,
    remove: removeDocument,
    reset: resetDocuments,
  } = documentCrud;

  const routePatientId = sanitizeString(getScalarParam(searchParams?.id));
  const routeIntent = useMemo(
    () =>
      resolveRouteIntent({
        tab: getScalarParam(searchParams?.tab),
        panel: getScalarParam(searchParams?.panel),
        mode: getScalarParam(searchParams?.mode),
        recordId: getScalarParam(searchParams?.recordId),
      }),
    [
      searchParams?.tab,
      searchParams?.panel,
      searchParams?.mode,
      searchParams?.recordId,
    ]
  );
  const [selectedTabKey, setSelectedTabKey] = useState(routeIntent.tabKey || DEFAULT_TAB_KEY);
  const [pendingDeepLinkAction, setPendingDeepLinkAction] = useState(
    routeIntent.mode ? routeIntent : null
  );
  const [resolvedPatientId, setResolvedPatientId] = useState('');
  const normalizedTenantId = sanitizeString(tenantId);
  const normalizedFacilityId = sanitizeString(facilityId);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const patient = useMemo(
    () => (patientData && !Array.isArray(patientData?.items) ? patientData : null),
    [patientData]
  );
  const identifierRecords = useMemo(() => resolveItems(identifierData), [identifierData]);
  const guardianRecords = useMemo(() => resolveItems(guardianData), [guardianData]);
  const contactRecords = useMemo(() => resolveItems(contactData), [contactData]);
  const allergyRecords = useMemo(() => resolveItems(allergyData), [allergyData]);
  const historyRecords = useMemo(() => resolveItems(historyData), [historyData]);
  const documentRecords = useMemo(() => resolveItems(documentData), [documentData]);
  const addressRecords = useMemo(() => resolveItems(addressData), [addressData]);
  const recordsByResourceKey = useMemo(
    () => ({
      [RESOURCE_KEYS.IDENTIFIERS]: identifierRecords,
      [RESOURCE_KEYS.GUARDIANS]: guardianRecords,
      [RESOURCE_KEYS.CONTACTS]: contactRecords,
      [RESOURCE_KEYS.ALLERGIES]: allergyRecords,
      [RESOURCE_KEYS.HISTORIES]: historyRecords,
      [RESOURCE_KEYS.ADDRESSES]: addressRecords,
      [RESOURCE_KEYS.DOCUMENTS]: documentRecords,
    }),
    [
      identifierRecords,
      guardianRecords,
      contactRecords,
      allergyRecords,
      historyRecords,
      addressRecords,
      documentRecords,
    ]
  );
  const resourceLoadingByKey = useMemo(
    () => ({
      [RESOURCE_KEYS.IDENTIFIERS]: isIdentifierLoading,
      [RESOURCE_KEYS.GUARDIANS]: isGuardianLoading,
      [RESOURCE_KEYS.CONTACTS]: isContactLoading,
      [RESOURCE_KEYS.ALLERGIES]: isAllergyLoading,
      [RESOURCE_KEYS.HISTORIES]: isHistoryLoading,
      [RESOURCE_KEYS.ADDRESSES]: isAddressLoading,
      [RESOURCE_KEYS.DOCUMENTS]: isDocumentLoading,
    }),
    [
      isIdentifierLoading,
      isGuardianLoading,
      isContactLoading,
      isAllergyLoading,
      isHistoryLoading,
      isAddressLoading,
      isDocumentLoading,
    ]
  );

  const resourceConfigs = useMemo(
    () => ({
      [RESOURCE_KEYS.IDENTIFIERS]: getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS),
      [RESOURCE_KEYS.GUARDIANS]: getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_GUARDIANS),
      [RESOURCE_KEYS.CONTACTS]: getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_CONTACTS),
      [RESOURCE_KEYS.ALLERGIES]: getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES),
      [RESOURCE_KEYS.HISTORIES]: getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES),
      [RESOURCE_KEYS.DOCUMENTS]: getPatientResourceConfig(PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS),
      [RESOURCE_KEYS.ADDRESSES]: ADDRESS_RESOURCE_CONFIG,
    }),
    []
  );

  const crudByResource = useMemo(
    () => ({
      [RESOURCE_KEYS.IDENTIFIERS]: {
        list: listIdentifiers,
        create: createIdentifier,
        update: updateIdentifier,
        remove: removeIdentifier,
        reset: resetIdentifiers,
      },
      [RESOURCE_KEYS.GUARDIANS]: {
        list: listGuardians,
        create: createGuardian,
        update: updateGuardian,
        remove: removeGuardian,
        reset: resetGuardians,
      },
      [RESOURCE_KEYS.CONTACTS]: {
        list: listContacts,
        create: createContact,
        update: updateContact,
        remove: removeContact,
        reset: resetContacts,
      },
      [RESOURCE_KEYS.ALLERGIES]: {
        list: listAllergies,
        create: createAllergy,
        update: updateAllergy,
        remove: removeAllergy,
        reset: resetAllergies,
      },
      [RESOURCE_KEYS.HISTORIES]: {
        list: listHistories,
        create: createHistory,
        update: updateHistory,
        remove: removeHistory,
        reset: resetHistories,
      },
      [RESOURCE_KEYS.DOCUMENTS]: {
        list: listDocuments,
        create: createDocument,
        update: updateDocument,
        remove: removeDocument,
        reset: resetDocuments,
      },
      [RESOURCE_KEYS.ADDRESSES]: {
        list: listAddresses,
        create: createAddress,
        update: updateAddress,
        remove: removeAddress,
        reset: resetAddresses,
      },
    }),
    [
      listIdentifiers,
      createIdentifier,
      updateIdentifier,
      removeIdentifier,
      resetIdentifiers,
      listGuardians,
      createGuardian,
      updateGuardian,
      removeGuardian,
      resetGuardians,
      listContacts,
      createContact,
      updateContact,
      removeContact,
      resetContacts,
      listAllergies,
      createAllergy,
      updateAllergy,
      removeAllergy,
      resetAllergies,
      listHistories,
      createHistory,
      updateHistory,
      removeHistory,
      resetHistories,
      listDocuments,
      createDocument,
      updateDocument,
      removeDocument,
      resetDocuments,
      listAddresses,
      createAddress,
      updateAddress,
      removeAddress,
      resetAddresses,
    ]
  );

  const resourceKeysByTab = useMemo(
    () => ({
      details: [],
      identity: [RESOURCE_KEYS.IDENTIFIERS, RESOURCE_KEYS.GUARDIANS],
      contacts: [RESOURCE_KEYS.CONTACTS],
      care: [RESOURCE_KEYS.ALLERGIES, RESOURCE_KEYS.HISTORIES],
      address: [RESOURCE_KEYS.ADDRESSES],
      documents: [RESOURCE_KEYS.DOCUMENTS],
    }),
    []
  );

  const buildCollectionParams = useCallback((internalPatientId) => {
    if (!internalPatientId || isOffline || !canAccessPatients || !hasScope) return null;

    const params = {
      page: 1,
      limit: 100,
      sort_by: 'updated_at',
      order: 'desc',
      patient_id: internalPatientId,
    };

    if (!canManageAllTenants && normalizedTenantId) {
      params.tenant_id = normalizedTenantId;
    }

    return params;
  }, [
    isOffline,
    canAccessPatients,
    hasScope,
    canManageAllTenants,
    normalizedTenantId,
  ]);

  const fetchPatient = useCallback(async () => {
    if (!routePatientId || isOffline || !canAccessPatients || !hasScope) {
      setResolvedPatientId('');
      return '';
    }

    const patientRecord = await getPatientRecord(routePatientId);
    const internalPatientId = sanitizeString(patientRecord?.id);
    if (!patientRecord || !internalPatientId) {
      setResolvedPatientId('');
      return '';
    }

    setResolvedPatientId((current) => (
      current === internalPatientId
        ? current
        : internalPatientId
    ));
    return internalPatientId;
  }, [
    routePatientId,
    isOffline,
    canAccessPatients,
    hasScope,
    getPatientRecord,
  ]);

  const fetchResourceCollection = useCallback(async (resourceKey, internalPatientId = resolvedPatientId) => {
    const params = buildCollectionParams(internalPatientId);
    if (!params) return undefined;

    const resourceCrud = crudByResource[resourceKey];
    if (!resourceCrud || typeof resourceCrud.list !== 'function') return undefined;

    return resourceCrud.list(params);
  }, [buildCollectionParams, crudByResource, resolvedPatientId]);

  const fetchAllCollections = useCallback(async (internalPatientId = resolvedPatientId) => {
    if (!internalPatientId) return;

    await Promise.all([
      fetchResourceCollection(RESOURCE_KEYS.IDENTIFIERS, internalPatientId),
      fetchResourceCollection(RESOURCE_KEYS.GUARDIANS, internalPatientId),
      fetchResourceCollection(RESOURCE_KEYS.CONTACTS, internalPatientId),
      fetchResourceCollection(RESOURCE_KEYS.ALLERGIES, internalPatientId),
      fetchResourceCollection(RESOURCE_KEYS.HISTORIES, internalPatientId),
      fetchResourceCollection(RESOURCE_KEYS.ADDRESSES, internalPatientId),
      fetchResourceCollection(RESOURCE_KEYS.DOCUMENTS, internalPatientId),
    ]);
  }, [fetchResourceCollection, resolvedPatientId]);

  const fetchCollectionsForTab = useCallback(async (
    tabKey,
    internalPatientId = resolvedPatientId
  ) => {
    if (!internalPatientId) return;
    const resourceKeys = resourceKeysByTab[tabKey] || [];
    if (resourceKeys.length === 0) return;

    await Promise.all(
      resourceKeys.map((resourceKey) =>
        fetchResourceCollection(resourceKey, internalPatientId))
    );
  }, [fetchResourceCollection, resolvedPatientId, resourceKeysByTab]);

  const liveSyncInFlightRef = useRef(false);
  const refreshWorkspaceData = useCallback(async ({
    activeTabOnly = false,
    tabKey = DEFAULT_TAB_KEY,
  } = {}) => {
    if (!routePatientId || isOffline || !canAccessPatients || !hasScope) return '';
    if (liveSyncInFlightRef.current) return '';

    liveSyncInFlightRef.current = true;
    try {
      const internalPatientId = await fetchPatient();
      if (internalPatientId) {
        if (activeTabOnly) {
          await fetchCollectionsForTab(tabKey, internalPatientId);
        } else {
          await fetchAllCollections(internalPatientId);
        }
      }
      return internalPatientId;
    } finally {
      liveSyncInFlightRef.current = false;
    }
  }, [
    routePatientId,
    isOffline,
    canAccessPatients,
    hasScope,
    fetchPatient,
    fetchCollectionsForTab,
    fetchAllCollections,
  ]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadInitialData = useCallback(async () => {
    if (!isResolved) return;

    if (!canAccessPatients || !hasScope || !routePatientId) {
      setResolvedPatientId('');
      setIsInitialLoading(false);
      return;
    }

    setIsInitialLoading(true);
    try {
      await refreshWorkspaceData();
    } finally {
      setIsInitialLoading(false);
    }
  }, [
    isResolved,
    canAccessPatients,
    hasScope,
    routePatientId,
    refreshWorkspaceData,
  ]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const tenantForFacilityList = sanitizeString(patient?.tenant_id) || normalizedTenantId;
    if (!tenantForFacilityList || isOffline || !canAccessPatients || !hasScope) {
      resetFacilities();
      return;
    }

    resetFacilities();
    listFacilities({
      page: 1,
      limit: 100,
      sort_by: 'name',
      order: 'asc',
      tenant_id: tenantForFacilityList,
    });
  }, [
    patient?.tenant_id,
    normalizedTenantId,
    isOffline,
    canAccessPatients,
    hasScope,
    listFacilities,
    resetFacilities,
  ]);

  useEffect(() => {
    setResolvedPatientId('');
  }, [routePatientId]);

  useEffect(() => {
    setSelectedTabKey(routeIntent.tabKey || DEFAULT_TAB_KEY);
    if (!routeIntent.mode) {
      setPendingDeepLinkAction(null);
      return;
    }

    setPendingDeepLinkAction({
      tabKey: routeIntent.tabKey,
      panelKey: routeIntent.panelKey,
      resourceKey: routeIntent.resourceKey,
      mode: routeIntent.mode,
      recordId: routeIntent.recordId,
    });
  }, [
    routePatientId,
    routeIntent.tabKey,
    routeIntent.panelKey,
    routeIntent.resourceKey,
    routeIntent.mode,
    routeIntent.recordId,
  ]);

  const [isPatientDeleted, setIsPatientDeleted] = useState(false);
  useEffect(() => {
    setIsPatientDeleted(false);
  }, [routePatientId]);

  const [isSummaryEditMode, setIsSummaryEditMode] = useState(false);
  const [summaryValues, setSummaryValues] = useState(
    resolvePatientSummaryValues(patient, normalizedFacilityId)
  );
  const [summaryErrors, setSummaryErrors] = useState({});
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [isDeletingPatient, setIsDeletingPatient] = useState(false);
  const [noticeState, setNoticeState] = useState(EMPTY_NOTICE_STATE);
  const [isRetrying, setIsRetrying] = useState(false);

  const summaryFacilityOptions = useMemo(
    () => {
      const options = resolveItems(facilityData).map((facility, index) => ({
        value: sanitizeString(facility?.id),
        label: resolveFacilityLabel(
          facility,
          t('patients.common.form.unnamedFacility', { position: index + 1 })
        ),
      }));

      const selectedFacilityId = sanitizeString(
        summaryValues?.facility_id
        || patient?.facility_id
        || normalizedFacilityId
      );
      if (selectedFacilityId && !hasOptionValue(options, selectedFacilityId)) {
        options.unshift({
          value: selectedFacilityId,
          label: resolveFacilityLabel(
            {
              id: selectedFacilityId,
              name: patient?.facility_label || patient?.facility_name,
              human_friendly_id: patient?.facility_human_friendly_id,
            },
            selectedFacilityId
          ),
        });
      }

      return [
        {
          value: '',
          label: t('patients.resources.patients.form.facilityPlaceholder'),
        },
        ...options,
      ];
    },
    [
      facilityData,
      t,
      summaryValues?.facility_id,
      patient?.facility_id,
      patient?.facility_label,
      patient?.facility_name,
      patient?.facility_human_friendly_id,
      normalizedFacilityId,
    ]
  );

  const summaryFacilityErrorMessage = useMemo(
    () => (
      facilityErrorCode
        ? resolveErrorMessage(t, facilityErrorCode, 'patients.common.form.facilityLoadErrorMessage')
        : ''
    ),
    [facilityErrorCode, t]
  );

  useEffect(() => {
    setSummaryValues(resolvePatientSummaryValues(patient, normalizedFacilityId));
    setSummaryErrors({});
  }, [patient, normalizedFacilityId]);

  useEffect(() => {
    if (!canManagePatientRecords) {
      setIsSummaryEditMode(false);
    }
  }, [canManagePatientRecords]);

  const [resourceEditors, setResourceEditors] = useState(EMPTY_RESOURCE_EDITORS);
  const [activeResourceSubmitKey, setActiveResourceSubmitKey] = useState('');
  const [activeResourceDelete, setActiveResourceDelete] = useState(EMPTY_RESOURCE_DELETE_STATE);
  useEffect(() => {
    setResourceEditors(EMPTY_RESOURCE_EDITORS);
  }, [routePatientId]);
  const hasActiveResourceEditors = useMemo(
    () => Object.values(resourceEditors || {}).some(Boolean),
    [resourceEditors]
  );

  const setActionNotice = useCallback((message, variant = 'info') => {
    const normalizedMessage = sanitizeString(message);
    if (!normalizedMessage) return;

    setNoticeState({
      message: normalizedMessage,
      variant: sanitizeString(variant) || 'info',
    });
  }, []);

  const onDismissNotice = useCallback(() => {
    setNoticeState(EMPTY_NOTICE_STATE);
  }, []);

  useEffect(() => {
    if (!noticeState?.message) return undefined;
    const timerId = setTimeout(() => {
      setNoticeState(EMPTY_NOTICE_STATE);
    }, NOTICE_AUTO_DISMISS_MS);
    return () => clearTimeout(timerId);
  }, [noticeState?.message]);

  useEffect(() => {
    setNoticeState(EMPTY_NOTICE_STATE);
    setIsSavingSummary(false);
    setIsDeletingPatient(false);
    setIsRetrying(false);
    setActiveResourceSubmitKey('');
    setActiveResourceDelete(EMPTY_RESOURCE_DELETE_STATE);
  }, [routePatientId]);

  useEffect(() => {
    if (
      !isResolved
      || !routePatientId
      || !canAccessPatients
      || !hasScope
      || isOffline
      || isPatientDeleted
      || isInitialLoading
      || isSummaryEditMode
      || hasActiveResourceEditors
      || isSavingSummary
      || isDeletingPatient
      || Boolean(activeResourceSubmitKey)
      || Boolean(activeResourceDelete?.recordId)
    ) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      void refreshWorkspaceData({
        activeTabOnly: true,
        tabKey: selectedTabKey,
      });
    }, REALTIME_SYNC_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    isResolved,
    routePatientId,
    canAccessPatients,
    hasScope,
    isOffline,
    isPatientDeleted,
    isInitialLoading,
    isSummaryEditMode,
    hasActiveResourceEditors,
    isSavingSummary,
    isDeletingPatient,
    activeResourceSubmitKey,
    activeResourceDelete,
    selectedTabKey,
    refreshWorkspaceData,
  ]);

  const resourceErrorCodes = useMemo(
    () => ({
      [RESOURCE_KEYS.IDENTIFIERS]: identifierErrorCode,
      [RESOURCE_KEYS.GUARDIANS]: guardianErrorCode,
      [RESOURCE_KEYS.CONTACTS]: contactErrorCode,
      [RESOURCE_KEYS.ALLERGIES]: allergyErrorCode,
      [RESOURCE_KEYS.HISTORIES]: historyErrorCode,
      [RESOURCE_KEYS.ADDRESSES]: addressErrorCode,
      [RESOURCE_KEYS.DOCUMENTS]: documentErrorCode,
    }),
    [
      identifierErrorCode,
      guardianErrorCode,
      contactErrorCode,
      allergyErrorCode,
      historyErrorCode,
      addressErrorCode,
      documentErrorCode,
    ]
  );

  const onResourceCreate = useCallback((resourceKey) => {
    if (!canManagePatientRecords) return;

    const config = resourceConfigs[resourceKey];
    if (!config) return;

    const values = config.getInitialValues ? config.getInitialValues({}, {}) : {};
    setResourceEditors((current) => ({
      ...current,
      [resourceKey]: {
        mode: 'create',
        recordId: '',
        values,
        errors: {},
      },
    }));
  }, [canManagePatientRecords, resourceConfigs]);

  const onResourceEdit = useCallback((resourceKey, record) => {
    if (!canManagePatientRecords) return;

    const config = resourceConfigs[resourceKey];
    const recordId = sanitizeString(record?.id);
    if (!config || !recordId) return;

    const values = config.getInitialValues ? config.getInitialValues(record, {}) : {};
    setResourceEditors((current) => ({
      ...current,
      [resourceKey]: {
        mode: 'edit',
        recordId,
        values,
        errors: {},
      },
    }));
  }, [canManagePatientRecords, resourceConfigs]);

  useEffect(() => {
    if (!pendingDeepLinkAction) return;
    if (!resolvedPatientId || isInitialLoading) return;
    if (!canManagePatientRecords) {
      setPendingDeepLinkAction(null);
      return;
    }

    const {
      mode,
      tabKey,
      resourceKey,
      recordId,
    } = pendingDeepLinkAction;

    if (tabKey && selectedTabKey !== tabKey) {
      setSelectedTabKey(tabKey);
    }

    if (!resourceKey) {
      if (mode === 'edit') {
        setIsSummaryEditMode(true);
      }
      setPendingDeepLinkAction(null);
      return;
    }

    if (mode === 'create') {
      onResourceCreate(resourceKey);
      setPendingDeepLinkAction(null);
      return;
    }

    if (mode !== 'edit' || !recordId) {
      setPendingDeepLinkAction(null);
      return;
    }

    const record = findRecordByRouteId(recordsByResourceKey[resourceKey], recordId);
    if (record) {
      onResourceEdit(resourceKey, record);
      setPendingDeepLinkAction(null);
      return;
    }

    const isTargetResourceLoading = Boolean(resourceLoadingByKey[resourceKey]);
    if (!isTargetResourceLoading) {
      setPendingDeepLinkAction(null);
    }
  }, [
    pendingDeepLinkAction,
    canManagePatientRecords,
    resolvedPatientId,
    isInitialLoading,
    selectedTabKey,
    onResourceCreate,
    onResourceEdit,
    recordsByResourceKey,
    resourceLoadingByKey,
  ]);

  const onResourceFieldChange = useCallback((resourceKey, name, value) => {
    setResourceEditors((current) => {
      const editor = current?.[resourceKey];
      if (!editor) return current;

      return {
        ...current,
        [resourceKey]: {
          ...editor,
          values: { ...editor.values, [name]: value },
          errors: { ...editor.errors, [name]: undefined },
        },
      };
    });
  }, []);

  const onResourceCancel = useCallback((resourceKey) => {
    setResourceEditors((current) => ({
      ...current,
      [resourceKey]: null,
    }));
  }, []);

  const onResourceSubmit = useCallback(async (resourceKey) => {
    if (!canManagePatientRecords || !resolvedPatientId) return;

    const editor = resourceEditors?.[resourceKey];
    const config = resourceConfigs[resourceKey];
    const resourceCrud = crudByResource[resourceKey];

    if (!editor || !config || !resourceCrud) return;

    const nextErrors = validateValues(config.fields || [], editor.values, t);
    if (Object.keys(nextErrors).length > 0) {
      setResourceEditors((current) => ({
        ...current,
        [resourceKey]: {
          ...editor,
          errors: nextErrors,
        },
      }));
      return;
    }

    if (activeResourceSubmitKey) return;
    setActiveResourceSubmitKey(resourceKey);

    try {
      const payloadBase = config.toPayload
        ? config.toPayload(editor.values)
        : { ...editor.values };

      const payload = {
        ...payloadBase,
        patient_id: resolvedPatientId,
      };

      const tenantForPayload = sanitizeString(patient?.tenant_id) || normalizedTenantId;
      if (tenantForPayload) {
        payload.tenant_id = tenantForPayload;
      }

      const result = editor.mode === 'edit'
        ? await resourceCrud.update(editor.recordId, payload)
        : await resourceCrud.create(payload);

      if (!result) {
        const errorMessage = resolveErrorMessage(
          t,
          resourceErrorCodes[resourceKey],
          'patients.workspace.state.saveError'
        );
        setActionNotice(errorMessage, 'error');
        return;
      }

      setResourceEditors((current) => ({
        ...current,
        [resourceKey]: null,
      }));

      await refreshWorkspaceData();

      const resourceLabel = resolveResourceLabel(resourceKey, t);
      const successKey = editor.mode === 'edit'
        ? 'patients.workspace.state.recordUpdatedSuccess'
        : 'patients.workspace.state.recordCreatedSuccess';
      setActionNotice(t(successKey, { resource: resourceLabel }), 'success');
    } finally {
      setActiveResourceSubmitKey((current) => (current === resourceKey ? '' : current));
    }
  }, [
    canManagePatientRecords,
    resolvedPatientId,
    resourceEditors,
    resourceConfigs,
    crudByResource,
    t,
    patient?.tenant_id,
    normalizedTenantId,
    refreshWorkspaceData,
    activeResourceSubmitKey,
    resourceErrorCodes,
    setActionNotice,
  ]);

  const onResourceDelete = useCallback(async (resourceKey, recordId) => {
    if (!canDeletePatientRecords) return;

    const resourceCrud = crudByResource[resourceKey];
    const normalizedRecordId = sanitizeString(recordId);

    if (!resourceCrud || !normalizedRecordId) return;
    if (!confirmAction(t('patients.workspace.state.deleteConfirm'))) return;
    if (activeResourceDelete?.recordId) return;

    setActiveResourceDelete({ resourceKey, recordId: normalizedRecordId });

    try {
      const result = await resourceCrud.remove(normalizedRecordId);
      if (!result) {
        const errorMessage = resolveErrorMessage(
          t,
          resourceErrorCodes[resourceKey],
          'patients.workspace.state.deleteError'
        );
        setActionNotice(errorMessage, 'error');
        return;
      }

      setResourceEditors((current) => {
        if (current?.[resourceKey]?.recordId !== normalizedRecordId) return current;
        return {
          ...current,
          [resourceKey]: null,
        };
      });

      await refreshWorkspaceData();

      setActionNotice(
        t('patients.workspace.state.recordDeletedSuccess', {
          resource: resolveResourceLabel(resourceKey, t),
        }),
        'success'
      );
    } finally {
      setActiveResourceDelete((current) => {
        const isCurrentDelete = (
          current?.resourceKey === resourceKey
          && current?.recordId === normalizedRecordId
        );
        return isCurrentDelete ? EMPTY_RESOURCE_DELETE_STATE : current;
      });
    }
  }, [
    canDeletePatientRecords,
    crudByResource,
    t,
    refreshWorkspaceData,
    activeResourceDelete,
    resourceErrorCodes,
    setActionNotice,
  ]);

  const onSummaryFieldChange = useCallback((name, value) => {
    setSummaryValues((current) => ({ ...current, [name]: value }));
    setSummaryErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const onStartSummaryEdit = useCallback(() => {
    if (!canManagePatientRecords) return;
    setIsSummaryEditMode(true);
  }, [canManagePatientRecords]);

  const onCancelSummaryEdit = useCallback(() => {
    setSummaryErrors({});
    setSummaryValues(resolvePatientSummaryValues(patient, normalizedFacilityId));
    setIsSummaryEditMode(false);
  }, [patient, normalizedFacilityId]);

  const onSaveSummary = useCallback(async () => {
    if (!canManagePatientRecords || !resolvedPatientId) return;
    if (isSavingSummary) return;

    const nextErrors = validateValues(
      [
        { name: 'first_name', required: true, maxLength: 120 },
        { name: 'last_name', required: true, maxLength: 120 },
        { name: 'date_of_birth' },
      ],
      summaryValues,
      t
    );

    const normalizedSummaryFacilityId = sanitizeString(summaryValues.facility_id);
    if (
      normalizedSummaryFacilityId
      && summaryFacilityOptions.length > 0
      && !hasOptionValue(summaryFacilityOptions, normalizedSummaryFacilityId)
    ) {
      nextErrors.facility_id = t('patients.common.form.invalidFacilitySelection');
    }

    if (Object.keys(nextErrors).length > 0) {
      setSummaryErrors(nextErrors);
      return;
    }

    setIsSavingSummary(true);

    try {
      const payload = {
        first_name: sanitizeString(summaryValues.first_name),
        last_name: sanitizeString(summaryValues.last_name),
        date_of_birth: sanitizeString(summaryValues.date_of_birth)
          ? `${sanitizeString(summaryValues.date_of_birth)}T00:00:00.000Z`
          : null,
        gender: sanitizeString(summaryValues.gender) || null,
        facility_id: sanitizeString(summaryValues.facility_id) || null,
        is_active: summaryValues.is_active !== false,
      };

      const result = await updatePatientRecord(resolvedPatientId, payload);
      if (!result) {
        setActionNotice(
          resolveErrorMessage(t, patientErrorCode, 'patients.workspace.state.saveError'),
          'error'
        );
        return;
      }

      await refreshWorkspaceData();
      setIsSummaryEditMode(false);
      setActionNotice(t('patients.workspace.state.patientUpdatedSuccess'), 'success');
    } finally {
      setIsSavingSummary(false);
    }
  }, [
    canManagePatientRecords,
    resolvedPatientId,
    summaryValues,
    summaryFacilityOptions,
    t,
    updatePatientRecord,
    refreshWorkspaceData,
    isSavingSummary,
    patientErrorCode,
    setActionNotice,
  ]);

  const onDeletePatient = useCallback(async () => {
    if (!canDeletePatientRecords || !resolvedPatientId) return;
    if (typeof removePatientRecord !== 'function') return;
    if (!confirmAction(t('patients.workspace.state.deletePatientConfirm'))) return;
    if (isDeletingPatient) return;

    setIsDeletingPatient(true);
    try {
      const result = await removePatientRecord(resolvedPatientId);
      if (!result) {
        setActionNotice(
          resolveErrorMessage(t, patientErrorCode, 'patients.workspace.state.deleteError'),
          'error'
        );
        return;
      }

      setIsSummaryEditMode(false);
      setSummaryErrors({});
      setResourceEditors(EMPTY_RESOURCE_EDITORS);
      setIsPatientDeleted(true);

      resetPatientRecord();
      resetIdentifiers();
      resetGuardians();
      resetContacts();
      resetAllergies();
      resetHistories();
      resetAddresses();
      resetDocuments();
      resetFacilities();

      setActionNotice(t('patients.workspace.state.patientDeletedSuccess'), 'success');
    } finally {
      setIsDeletingPatient(false);
    }
  }, [
    canDeletePatientRecords,
    resolvedPatientId,
    removePatientRecord,
    resetPatientRecord,
    resetIdentifiers,
    resetGuardians,
    resetContacts,
    resetAllergies,
    resetHistories,
    resetAddresses,
    resetDocuments,
    resetFacilities,
    t,
    isDeletingPatient,
    patientErrorCode,
    setActionNotice,
  ]);

  const genderOptions = useMemo(
    () => [
      { value: 'MALE', label: t('patients.resources.patients.options.gender.male') },
      { value: 'FEMALE', label: t('patients.resources.patients.options.gender.female') },
      { value: 'OTHER', label: t('patients.resources.patients.options.gender.other') },
      { value: 'UNKNOWN', label: t('patients.resources.patients.options.gender.unknown') },
    ],
    [t]
  );

  const resourceSections = useMemo(
    () => ({
      [RESOURCE_KEYS.IDENTIFIERS]: {
        key: RESOURCE_KEYS.IDENTIFIERS,
        config: resourceConfigs[RESOURCE_KEYS.IDENTIFIERS],
        records: identifierRecords,
        editor: resourceEditors[RESOURCE_KEYS.IDENTIFIERS],
        isLoading: isIdentifierLoading,
        errorCode: identifierErrorCode,
        errorMessage: identifierErrorCode
          ? resolveErrorMessage(t, identifierErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
      [RESOURCE_KEYS.GUARDIANS]: {
        key: RESOURCE_KEYS.GUARDIANS,
        config: resourceConfigs[RESOURCE_KEYS.GUARDIANS],
        records: guardianRecords,
        editor: resourceEditors[RESOURCE_KEYS.GUARDIANS],
        isLoading: isGuardianLoading,
        errorCode: guardianErrorCode,
        errorMessage: guardianErrorCode
          ? resolveErrorMessage(t, guardianErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
      [RESOURCE_KEYS.CONTACTS]: {
        key: RESOURCE_KEYS.CONTACTS,
        config: resourceConfigs[RESOURCE_KEYS.CONTACTS],
        records: contactRecords,
        editor: resourceEditors[RESOURCE_KEYS.CONTACTS],
        isLoading: isContactLoading,
        errorCode: contactErrorCode,
        errorMessage: contactErrorCode
          ? resolveErrorMessage(t, contactErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
      [RESOURCE_KEYS.ALLERGIES]: {
        key: RESOURCE_KEYS.ALLERGIES,
        config: resourceConfigs[RESOURCE_KEYS.ALLERGIES],
        records: allergyRecords,
        editor: resourceEditors[RESOURCE_KEYS.ALLERGIES],
        isLoading: isAllergyLoading,
        errorCode: allergyErrorCode,
        errorMessage: allergyErrorCode
          ? resolveErrorMessage(t, allergyErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
      [RESOURCE_KEYS.HISTORIES]: {
        key: RESOURCE_KEYS.HISTORIES,
        config: resourceConfigs[RESOURCE_KEYS.HISTORIES],
        records: historyRecords,
        editor: resourceEditors[RESOURCE_KEYS.HISTORIES],
        isLoading: isHistoryLoading,
        errorCode: historyErrorCode,
        errorMessage: historyErrorCode
          ? resolveErrorMessage(t, historyErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
      [RESOURCE_KEYS.ADDRESSES]: {
        key: RESOURCE_KEYS.ADDRESSES,
        config: resourceConfigs[RESOURCE_KEYS.ADDRESSES],
        records: addressRecords,
        editor: resourceEditors[RESOURCE_KEYS.ADDRESSES],
        isLoading: isAddressLoading,
        errorCode: addressErrorCode,
        errorMessage: addressErrorCode
          ? resolveErrorMessage(t, addressErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
      [RESOURCE_KEYS.DOCUMENTS]: {
        key: RESOURCE_KEYS.DOCUMENTS,
        config: resourceConfigs[RESOURCE_KEYS.DOCUMENTS],
        records: documentRecords,
        editor: resourceEditors[RESOURCE_KEYS.DOCUMENTS],
        isLoading: isDocumentLoading,
        errorCode: documentErrorCode,
        errorMessage: documentErrorCode
          ? resolveErrorMessage(t, documentErrorCode, 'patients.workspace.state.loadError')
          : '',
      },
    }),
    [
      resourceConfigs,
      identifierRecords,
      guardianRecords,
      contactRecords,
      allergyRecords,
      historyRecords,
      addressRecords,
      documentRecords,
      resourceEditors,
      isIdentifierLoading,
      isGuardianLoading,
      isContactLoading,
      isAllergyLoading,
      isHistoryLoading,
      isAddressLoading,
      isDocumentLoading,
      identifierErrorCode,
      guardianErrorCode,
      contactErrorCode,
      allergyErrorCode,
      historyErrorCode,
      addressErrorCode,
      documentErrorCode,
      t,
    ]
  );

  const hasMissingContext = !routePatientId || !canAccessPatients || !hasScope;
  const hasUnresolvedPatient = (
    Boolean(routePatientId)
    && !resolvedPatientId
    && !patient
    && !isInitialLoading
  );
  const activeEntitlementErrorCode = (
    patientErrorCode
    || identifierErrorCode
    || guardianErrorCode
    || contactErrorCode
    || allergyErrorCode
    || historyErrorCode
    || addressErrorCode
    || documentErrorCode
  );
  const isEntitlementBlocked = isEntitlementDeniedError(activeEntitlementErrorCode);
  const hasPatientLevelError = Boolean(patientErrorCode) && !patient;
  const hasError = (
    !isPatientDeleted
    && !isEntitlementBlocked
    && (hasMissingContext || hasUnresolvedPatient || hasPatientLevelError)
  );
  const errorMessage = useMemo(() => {
    if (hasMissingContext || hasUnresolvedPatient) return t('patients.workspace.state.loadError');
    return resolveErrorMessage(
      t,
      patientErrorCode,
      'patients.workspace.state.loadError'
    );
  }, [t, patientErrorCode, hasMissingContext, hasUnresolvedPatient]);

  const onSelectTab = useCallback((tabKey) => {
    const normalizedTab = normalizeRouteTabKey(tabKey);
    setSelectedTabKey(normalizedTab);
    setPendingDeepLinkAction(null);

    const normalizedRoutePatientId = sanitizeString(routePatientId);
    if (!normalizedRoutePatientId) return;

    const query = new URLSearchParams();
    if (normalizedTab !== DEFAULT_TAB_KEY) {
      query.set('tab', normalizedTab);
    }

    const queryString = query.toString();
    const targetPath = queryString
      ? `/patients/patients/${encodeURIComponent(normalizedRoutePatientId)}?${queryString}`
      : `/patients/patients/${encodeURIComponent(normalizedRoutePatientId)}`;
    router.replace(targetPath);
  }, [routePatientId, router]);

  const onRetry = useCallback(async () => {
    if (isPatientDeleted || isRetrying) return;
    setIsRetrying(true);
    try {
      await loadInitialData();
    } finally {
      setIsRetrying(false);
    }
  }, [isPatientDeleted, isRetrying, loadInitialData]);

  return {
    patientId: resolvedPatientId,
    routePatientId,
    initialTabKey: routeIntent.tabKey,
    selectedTabKey,
    patient,
    identifierRecords,
    guardianRecords,
    contactRecords,
    allergyRecords,
    historyRecords,
    documentRecords,
    addressRecords,
    resourceSections,
    resourceKeys: RESOURCE_KEYS,
    isSummaryEditMode,
    summaryValues,
    summaryErrors,
    summaryFacilityOptions,
    isSummaryFacilityLoading: isFacilityLoading,
    summaryFacilityErrorMessage,
    isSavingSummary,
    isDeletingPatient,
    activeResourceSubmitKey,
    activeResourceDelete,
    genderOptions,
    isLoading: !isResolved || isInitialLoading,
    isRetrying,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    isPatientDeleted,
    noticeMessage: noticeState.message,
    noticeVariant: noticeState.variant,
    canManagePatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    onRetry,
    onSelectTab,
    onDismissNotice,
    onGoToSubscriptions: () => router.push('/subscriptions/subscriptions'),
    onDeletePatient,
    onSummaryFieldChange,
    onStartSummaryEdit,
    onCancelSummaryEdit,
    onSaveSummary,
    onResourceCreate,
    onResourceEdit,
    onResourceDelete,
    onResourceFieldChange,
    onResourceSubmit,
    onResourceCancel,
  };
};

export default usePatientDetailsScreen;
