const { renderHook, act } = require('@testing-library/react-native');

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

const mockListConsents = jest.fn();
const mockCreateConsents = jest.fn();
const mockUpdateConsents = jest.fn();
const mockRemoveConsents = jest.fn();
const mockResetConsents = jest.fn();

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
jest.mock('@hooks/usePatientAllergy', () => jest.fn());
jest.mock('@hooks/usePatientMedicalHistory', () => jest.fn());
jest.mock('@hooks/usePatientDocument', () => jest.fn());
jest.mock('@hooks/useConsent', () => jest.fn());

jest.mock('@utils', () => {
  const actual = jest.requireActual('@utils');
  return {
    ...actual,
    confirmAction: jest.fn(() => true),
  };
});

const usePatientWorkspaceScreen = require('@platform/screens/patients/PatientWorkspaceScreen/usePatientWorkspaceScreen').default;
const { usePatient, usePatientAccess } = require('@hooks');
const usePatientIdentifier = require('@hooks/usePatientIdentifier');
const usePatientContact = require('@hooks/usePatientContact');
const usePatientGuardian = require('@hooks/usePatientGuardian');
const usePatientAllergy = require('@hooks/usePatientAllergy');
const usePatientMedicalHistory = require('@hooks/usePatientMedicalHistory');
const usePatientDocument = require('@hooks/usePatientDocument');
const useConsent = require('@hooks/useConsent');

describe('usePatientWorkspaceScreen', () => {
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
    useConsent.mockReturnValue({
      list: mockListConsents,
      create: mockCreateConsents,
      update: mockUpdateConsents,
      remove: mockRemoveConsents,
      reset: mockResetConsents,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });
  });

  it('normalizes invalid tab/panel params and redirects to canonical workspace path', () => {
    mockSearchParams = { id: 'patient-1', tab: 'invalid-tab', panel: 'unknown-panel' };

    renderHook(() => usePatientWorkspaceScreen());

    expect(mockReplace).toHaveBeenCalledWith('/patients/patients/patient-1');
  });

  it('loads active panel records and supports create mode routing in tabbed workspace', () => {
    mockSearchParams = { id: 'patient-1', tab: 'care', panel: 'allergies' };

    usePatientAllergy.mockReturnValue({
      list: mockListAllergies,
      create: mockCreateAllergies,
      update: mockUpdateAllergies,
      remove: mockRemoveAllergies,
      reset: mockResetAllergies,
      data: {
        items: [
          {
            id: 'allergy-1',
            human_friendly_id: 'ALG-001',
            allergen: 'Peanuts',
            severity: 'SEVERE',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
    });

    const { result } = renderHook(() => usePatientWorkspaceScreen());

    expect(mockPatientGet).toHaveBeenCalledWith('patient-1');
    expect(mockListAllergies).toHaveBeenCalledWith(expect.objectContaining({
      patient_id: 'patient-1',
      tenant_id: 'tenant-1',
    }));
    expect(result.current.panelRows).toHaveLength(1);
    expect(result.current.panelRows[0]).toEqual(expect.objectContaining({ id: 'allergy-1' }));

    act(() => {
      result.current.onStartCreate();
    });

    expect(mockReplace).toHaveBeenCalledWith('/patients/patients/patient-1?tab=care&mode=create');
  });

  it('surfaces entitlement blocked state when backend returns MODULE_NOT_ENTITLED', () => {
    usePatient.mockReturnValue({
      get: mockPatientGet,
      update: mockPatientUpdate,
      remove: mockPatientRemove,
      reset: mockPatientReset,
      data: null,
      isLoading: false,
      errorCode: 'MODULE_NOT_ENTITLED',
    });

    const { result } = renderHook(() => usePatientWorkspaceScreen());
    expect(result.current.isEntitlementBlocked).toBe(true);
  });

  it('strips edit mode from route params for read-only access', () => {
    mockSearchParams = { id: 'patient-1', tab: 'summary', mode: 'edit' };

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canManagePatientRecords: false,
      canDeletePatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    renderHook(() => usePatientWorkspaceScreen());

    expect(mockReplace).toHaveBeenCalledWith('/patients/patients/patient-1');
  });

  it('deletes patient and returns to directory when RBAC allows', async () => {
    mockPatientRemove.mockResolvedValue({ id: 'patient-1' });

    const { result } = renderHook(() => usePatientWorkspaceScreen());

    await act(async () => {
      await result.current.onDeletePatient();
    });

    expect(mockPatientRemove).toHaveBeenCalledWith('patient-1');
    expect(mockReplace).toHaveBeenCalledWith('/patients/patients');
  });
});
