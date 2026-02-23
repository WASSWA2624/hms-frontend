const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockSearchParams = {};

const mockPatientGet = jest.fn();
const mockPatientUpdate = jest.fn();
const mockPatientRemove = jest.fn();
const mockPatientReset = jest.fn();

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
  usePatient: jest.fn(),
  usePatientAccess: jest.fn(),
}));

jest.mock('@hooks/usePatientIdentifier', () => jest.fn());
jest.mock('@hooks/usePatientContact', () => jest.fn());
jest.mock('@hooks/usePatientGuardian', () => jest.fn());
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
const { usePatient, usePatientAccess } = require('@hooks');
const usePatientIdentifier = require('@hooks/usePatientIdentifier');
const usePatientContact = require('@hooks/usePatientContact');
const usePatientGuardian = require('@hooks/usePatientGuardian');
const usePatientDocument = require('@hooks/usePatientDocument');
const useAddress = require('@hooks/useAddress');

describe('usePatientDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = { id: 'patient-1' };

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    usePatient.mockReturnValue({
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
      expect(mockPatientGet).toHaveBeenCalledWith('patient-1');
    });

    expect(mockListIdentifiers).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(mockListContacts).toHaveBeenCalledWith(expect.objectContaining({
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

  it('manages resource editor lifecycle locally and submits create payload', async () => {
    mockCreateIdentifiers.mockResolvedValue({ id: 'identifier-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await waitFor(() => {
      expect(result.current.resourceSections.identifiers).toBeTruthy();
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

  it('surfaces entitlement blocked state when backend returns MODULE_NOT_ENTITLED', async () => {
    usePatient.mockReturnValue({
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

  it('deletes patient locally without redirecting to another screen', async () => {
    mockPatientRemove.mockResolvedValue({ id: 'patient-1' });

    const { result } = renderHook(() => usePatientDetailsScreen());

    await act(async () => {
      await result.current.onDeletePatient();
    });

    expect(mockPatientRemove).toHaveBeenCalledWith('patient-1');
    expect(result.current.isPatientDeleted).toBe(true);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
