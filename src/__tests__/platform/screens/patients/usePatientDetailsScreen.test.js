const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockSearchParams = {};

const mockPatientGet = jest.fn();
const mockPatientList = jest.fn();
const mockPatientUpdate = jest.fn();
const mockPatientRemove = jest.fn();
const mockPatientReset = jest.fn();
const mockListFacilities = jest.fn();
const mockResetFacilities = jest.fn();

const mockListIdentifiers = jest.fn();
const mockCreateIdentifiers = jest.fn();
const mockUpdateIdentifiers = jest.fn();
const mockRemoveIdentifiers = jest.fn();
const mockResetIdentifiers = jest.fn();

const mockListContacts = jest.fn();
const mockCreateContacts = jest.fn();
const mockUpdateContacts = jest.fn();
const mockRemoveContacts = jest.fn();
const mockResetContacts = jest.fn();

const mockListGuardians = jest.fn();
const mockCreateGuardians = jest.fn();
const mockUpdateGuardians = jest.fn();
const mockRemoveGuardians = jest.fn();
const mockResetGuardians = jest.fn();

const mockListAllergies = jest.fn();
const mockCreateAllergies = jest.fn();
const mockUpdateAllergies = jest.fn();
const mockRemoveAllergies = jest.fn();
const mockResetAllergies = jest.fn();

const mockListHistories = jest.fn();
const mockCreateHistories = jest.fn();
const mockUpdateHistories = jest.fn();
const mockRemoveHistories = jest.fn();
const mockResetHistories = jest.fn();

const mockListDocuments = jest.fn();
const mockCreateDocuments = jest.fn();
const mockUpdateDocuments = jest.fn();
const mockRemoveDocuments = jest.fn();
const mockResetDocuments = jest.fn();

const mockListAddresses = jest.fn();
const mockCreateAddresses = jest.fn();
const mockUpdateAddresses = jest.fn();
const mockRemoveAddresses = jest.fn();
const mockResetAddresses = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (key, values) => {
    if (key === 'patients.common.list.unnamedRecord') return `Record ${values?.position || ''}`.trim();
    if (key === 'patients.overview.unnamedPatient') return `Patient ${values?.position || ''}`.trim();
    return key;
  } })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useFacility: jest.fn(),
  usePatient: jest.fn(),
  usePatientAccess: jest.fn(),
}));

jest.mock('@hooks/usePatientIdentifier', () => jest.fn());
jest.mock('@hooks/usePatientContact', () => jest.fn());
jest.mock('@hooks/usePatientGuardian', () => jest.fn());
jest.mock('@hooks/usePatientAllergy', () => jest.fn());
jest.mock('@hooks/usePatientMedicalHistory', () => jest.fn());
jest.mock('@hooks/usePatientDocument', () => jest.fn());
jest.mock('@hooks/useAddress', () => jest.fn());

jest.mock('@utils', () => {
  const actual = jest.requireActual('@utils');
  return {
    ...actual,
    confirmAction: jest.fn(() => true),
  };
});

const usePatientDetailsScreen = require('@platform/screens/patients/PatientDetailsScreen/usePatientDetailsScreen').default;
const { useFacility, usePatient, usePatientAccess } = require('@hooks');
const usePatientIdentifier = require('@hooks/usePatientIdentifier');
const usePatientContact = require('@hooks/usePatientContact');
const usePatientGuardian = require('@hooks/usePatientGuardian');
const usePatientAllergy = require('@hooks/usePatientAllergy');
const usePatientMedicalHistory = require('@hooks/usePatientMedicalHistory');
const usePatientDocument = require('@hooks/usePatientDocument');
const useAddress = require('@hooks/useAddress');

describe('usePatientDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = { id: 'PAT-001' };
    mockPatientList.mockResolvedValue({
      items: [
        {
          id: 'patient-1',
          human_friendly_id: 'PAT-001',
        },
      ],
    });
    mockPatientGet.mockResolvedValue({
      id: 'patient-1',
      first_name: 'Jane',
      last_name: 'Doe',
      human_friendly_id: 'PAT-001',
      tenant_id: 'tenant-1',
    });

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });

    useFacility.mockReturnValue({
      list: mockListFacilities,
      reset: mockResetFacilities,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatient.mockReturnValue({
      list: mockPatientList,
      get: mockPatientGet,
      update: mockPatientUpdate,
      remove: mockPatientRemove,
      reset: mockPatientReset,
      data: {
        id: 'patient-1',
        first_name: 'Jane',
        last_name: 'Doe',
        human_friendly_id: 'PAT-001',
        tenant_id: 'tenant-1',
      },
      isLoading: false,
      errorCode: null,
    });

    usePatientIdentifier.mockReturnValue({
      list: mockListIdentifiers,
      create: mockCreateIdentifiers,
      update: mockUpdateIdentifiers,
      remove: mockRemoveIdentifiers,
      reset: mockResetIdentifiers,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatientContact.mockReturnValue({
      list: mockListContacts,
      create: mockCreateContacts,
      update: mockUpdateContacts,
      remove: mockRemoveContacts,
      reset: mockResetContacts,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatientGuardian.mockReturnValue({
      list: mockListGuardians,
      create: mockCreateGuardians,
      update: mockUpdateGuardians,
      remove: mockRemoveGuardians,
      reset: mockResetGuardians,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatientAllergy.mockReturnValue({
      list: mockListAllergies,
      create: mockCreateAllergies,
      update: mockUpdateAllergies,
      remove: mockRemoveAllergies,
      reset: mockResetAllergies,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatientMedicalHistory.mockReturnValue({
      list: mockListHistories,
      create: mockCreateHistories,
      update: mockUpdateHistories,
      remove: mockRemoveHistories,
      reset: mockResetHistories,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatientDocument.mockReturnValue({
      list: mockListDocuments,
      create: mockCreateDocuments,
      update: mockUpdateDocuments,
      remove: mockRemoveDocuments,
      reset: mockResetDocuments,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    useAddress.mockReturnValue({
      list: mockListAddresses,
      create: mockCreateAddresses,
      update: mockUpdateAddresses,
      remove: mockRemoveAddresses,
      reset: mockResetAddresses,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });
  });

  it('loads patient and patient-scoped resource collections on mount', async () => {
    renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT-001');
    });

    expect(mockListIdentifiers).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListContacts).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListAllergies).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListHistories).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListGuardians).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListDocuments).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListAddresses).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
  });

  it('resolves human-friendly route IDs via direct patient get call', async () => {
    mockSearchParams = { id: 'PAT0000001' };
    mockPatientGet.mockResolvedValue({
      id: 'patient-99',
      first_name: 'Mapped',
      last_name: 'Patient',
      human_friendly_id: 'PAT-0000001',
      tenant_id: 'tenant-1',
    });
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });

    renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT0000001');
    });
  });

  it('normalizes route tab query into patient details tab keys', async () => {
    mockSearchParams = { id: 'PAT-001', tab: 'addresses' };

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.initialTabKey).toBe('address');
    });
  });

  it('prioritizes panel over tab and auto-opens the requested create editor', async () => {
    mockSearchParams = {
      id: 'PAT-001',
      tab: 'documents',
      panel: 'allergies',
      mode: 'create',
    };

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.patientId).toBe('patient-1');
    });
    await waitFor(() => {
      expect(result.current.selectedTabKey).toBe('care');
      expect(result.current.resourceSections.allergies.editor.mode).toBe('create');
    });
  });

  it('auto-opens targeted panel edit from deep-link mode and recordId', async () => {
    mockSearchParams = {
      id: 'PAT-001',
      panel: 'contacts',
      mode: 'edit',
      recordId: 'contact-22',
    };

    usePatientContact.mockReturnValue({
      list: mockListContacts,
      create: mockCreateContacts,
      update: mockUpdateContacts,
      remove: mockRemoveContacts,
      reset: mockResetContacts,
      data: {
        items: [
          {
            id: 'contact-22',
            contact_type: 'PHONE',
            value: '+1555000111',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
    });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.selectedTabKey).toBe('contacts');
    });
    await waitFor(() => {
      expect(result.current.resourceSections.contacts.editor.mode).toBe('edit');
      expect(result.current.resourceSections.contacts.editor.recordId).toBe('contact-22');
    });
  });

  it('opens summary edit when route mode=edit without panel', async () => {
    mockSearchParams = { id: 'PAT-001', mode: 'edit' };
    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.patientId).toBe('patient-1');
    });
    await waitFor(() => {
      expect(result.current.isSummaryEditMode).toBe(true);
    });
  });

  it('syncs selected tab to route query when user switches tabs', async () => {
    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.patientId).toBe('patient-1');
    });

    act(() => {
      result.current.onSelectTab('documents');
    });

    expect(result.current.selectedTabKey).toBe('documents');
    expect(mockReplace).toHaveBeenCalledWith('/patients/patients/PAT-001?tab=documents');
  });

  it('polls only active-tab resources during background sync', async () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => usePatientDetailsScreen());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.onSelectTab('contacts');
      });

      const identifiersCallsBefore = mockListIdentifiers.mock.calls.length;
      const guardiansCallsBefore = mockListGuardians.mock.calls.length;
      const contactsCallsBefore = mockListContacts.mock.calls.length;
      const documentsCallsBefore = mockListDocuments.mock.calls.length;
      const addressesCallsBefore = mockListAddresses.mock.calls.length;
      const allergiesCallsBefore = mockListAllergies.mock.calls.length;
      const historiesCallsBefore = mockListHistories.mock.calls.length;

      await act(async () => {
        jest.advanceTimersByTime(10050);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(mockListContacts.mock.calls.length).toBeGreaterThan(contactsCallsBefore);
      });
      expect(mockListIdentifiers.mock.calls.length).toBe(identifiersCallsBefore);
      expect(mockListGuardians.mock.calls.length).toBe(guardiansCallsBefore);
      expect(mockListDocuments.mock.calls.length).toBe(documentsCallsBefore);
      expect(mockListAddresses.mock.calls.length).toBe(addressesCallsBefore);
      expect(mockListAllergies.mock.calls.length).toBe(allergiesCallsBefore);
      expect(mockListHistories.mock.calls.length).toBe(historiesCallsBefore);
    } finally {
      jest.useRealTimers();
    }
  });

  it('manages resource editor lifecycle locally and submits create payload', async () => {
    mockCreateIdentifiers.mockResolvedValue({ id: 'identifier-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT-001');
    });

    act(() => {
      result.current.onResourceCreate(result.current.resourceKeys.IDENTIFIERS);
    });

    expect(result.current.resourceSections.identifiers.editor.mode).toBe('create');

    act(() => {
      result.current.onResourceFieldChange(
        result.current.resourceKeys.IDENTIFIERS,
        'identifier_type',
        'MRN'
      );
      result.current.onResourceFieldChange(
        result.current.resourceKeys.IDENTIFIERS,
        'identifier_value',
        'MRN-1001'
      );
    });

    await act(async () => {
      await result.current.onResourceSubmit(result.current.resourceKeys.IDENTIFIERS);
    });

    expect(mockCreateIdentifiers).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
      identifier_type: 'MRN',
      identifier_value: 'MRN-1001',
    }));
    expect(result.current.resourceSections.identifiers.editor).toBeNull();
  });

  it('supports resource delete and refresh without route navigation', async () => {
    mockRemoveContacts.mockResolvedValue({ id: 'contact-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await act(async () => {
      await result.current.onResourceDelete(result.current.resourceKeys.CONTACTS, 'contact-1');
    });

    expect(mockRemoveContacts).toHaveBeenCalledWith('contact-1');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('supports local summary edit state and saves patient changes', async () => {
    mockPatientUpdate.mockResolvedValue({ id: 'patient-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());
    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT-001');
    });

    act(() => {
      result.current.onStartSummaryEdit();
    });

    expect(result.current.isSummaryEditMode).toBe(true);

    act(() => {
      result.current.onSummaryFieldChange('first_name', 'Janet');
    });

    await act(async () => {
      await result.current.onSaveSummary();
    });

    expect(mockPatientUpdate).toHaveBeenCalledWith('patient-1', expect.objectContaining({
      first_name: 'Janet',
      last_name: 'Doe',
    }));
    expect(result.current.isSummaryEditMode).toBe(false);
  });

  it('shows a success notice after saving summary updates', async () => {
    mockPatientUpdate.mockResolvedValue({ id: 'patient-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());
    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT-001');
    });
    await waitFor(() => {
      expect(result.current.patientId).toBe('patient-1');
    });

    await act(async () => {
      await result.current.onSaveSummary();
    });

    await waitFor(() => {
      expect(result.current.noticeVariant).toBe('success');
      expect(result.current.noticeMessage).toBe('patients.workspace.state.patientUpdatedSuccess');
    });
  });

  it('shows an error notice when a resource save fails', async () => {
    mockCreateIdentifiers.mockResolvedValue(null);
    usePatientIdentifier.mockReturnValue({
      list: mockListIdentifiers,
      create: mockCreateIdentifiers,
      update: mockUpdateIdentifiers,
      remove: mockRemoveIdentifiers,
      reset: mockResetIdentifiers,
      data: { items: [] },
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
    });

    const { result } = renderHook(() => usePatientDetailsScreen());
    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT-001');
    });

    act(() => {
      result.current.onResourceCreate(result.current.resourceKeys.IDENTIFIERS);
      result.current.onResourceFieldChange(
        result.current.resourceKeys.IDENTIFIERS,
        'identifier_type',
        'MRN'
      );
      result.current.onResourceFieldChange(
        result.current.resourceKeys.IDENTIFIERS,
        'identifier_value',
        'MRN-1001'
      );
    });

    await act(async () => {
      await result.current.onResourceSubmit(result.current.resourceKeys.IDENTIFIERS);
    });

    expect(result.current.noticeVariant).toBe('error');
    expect(result.current.noticeMessage).toBe('patients.workspace.state.saveError');
  });

  it('surfaces entitlement blocked state when backend returns MODULE_NOT_ENTITLED', async () => {
    usePatient.mockReturnValue({
      list: mockPatientList,
      get: mockPatientGet,
      update: mockPatientUpdate,
      remove: mockPatientRemove,
      reset: mockPatientReset,
      data: null,
      isLoading: false,
      errorCode: 'MODULE_NOT_ENTITLED',
    });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.isEntitlementBlocked).toBe(true);
    });
  });

  it('keeps the page available when a resource collection fails', async () => {
    usePatientContact.mockReturnValue({
      list: mockListContacts,
      create: mockCreateContacts,
      update: mockUpdateContacts,
      remove: mockRemoveContacts,
      reset: mockResetContacts,
      data: { items: [] },
      isLoading: false,
      errorCode: 'errors.network.timeout',
    });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.hasError).toBe(false);
    });

    expect(result.current.resourceSections.contacts.errorCode).toBe('errors.network.timeout');
    expect(result.current.resourceSections.contacts.errorMessage).toBeTruthy();
  });

  it('deletes patient locally without redirecting to another screen', async () => {
    mockPatientRemove.mockResolvedValue({ id: 'patient-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());
    await waitFor(() => {
      expect(mockPatientGet).toHaveBeenCalledWith('PAT-001');
    });
    await waitFor(() => {
      expect(result.current.patientId).toBe('patient-1');
    });

    await act(async () => {
      await result.current.onDeletePatient();
    });

    expect(mockPatientRemove).toHaveBeenCalledWith('patient-1');
    expect(result.current.isPatientDeleted).toBe(true);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
