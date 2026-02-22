const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'patient-1' };
let mockCrudData = null;

const mockGet = jest.fn();
const mockRemove = jest.fn();
const mockReset = jest.fn();
const mockGetPatientById = jest.fn();
const mockResetPatientLookup = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (key) => key })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  usePatient: jest.fn(),
  usePatientAccess: jest.fn(),
}));

jest.mock('@utils', () => {
  const actual = jest.requireActual('@utils');
  return {
    ...actual,
    confirmAction: jest.fn(() => true),
  };
});

jest.mock('@platform/screens/patients/usePatientResourceCrud', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePatientResourceDetailScreen = require('@platform/screens/patients/PatientResourceDetailScreen/usePatientResourceDetailScreen').default;
const usePatientResourceCrud = require('@platform/screens/patients/usePatientResourceCrud').default;
const { usePatient, usePatientAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('usePatientResourceDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'patient-1' };
    mockCrudData = {
      id: 'patient-1',
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
      first_name: 'Jane',
      last_name: 'Doe',
      gender: 'FEMALE',
      is_active: true,
    };

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canEditPatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    usePatient.mockReturnValue({
      get: mockGetPatientById,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockResetPatientLookup,
    });

    usePatientResourceCrud.mockImplementation(() => ({
      get: mockGet,
      remove: mockRemove,
      data: mockCrudData,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    }));
  });

  it('filters technical identity rows for non-super users', () => {
    const { result } = renderHook(() => usePatientResourceDetailScreen('patients'));
    const valueKeys = result.current.detailRows.map((row) => row.valueKey);

    expect(valueKeys).not.toContain('id');
    expect(valueKeys).not.toContain('tenant_id');
    expect(valueKeys).not.toContain('facility_id');
    expect(valueKeys).toContain('first_name');
    expect(valueKeys).toContain('last_name');
  });

  it('keeps technical identity rows for privileged tenant-wide administrators', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canEditPatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceDetailScreen('patients'));
    const valueKeys = result.current.detailRows.map((row) => row.valueKey);

    expect(valueKeys).toContain('id');
    expect(valueKeys).toContain('tenant_id');
    expect(valueKeys).toContain('facility_id');
  });

  it('redirects to dashboard when patient access is denied at route level', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: false,
      canEditPatientRecords: false,
      canDeletePatientRecords: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => usePatientResourceDetailScreen('patients'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('blocks edit/delete handlers for read-only users', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canEditPatientRecords: false,
      canDeletePatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceDetailScreen('patients'));

    expect(result.current.canEdit).toBe(false);
    expect(result.current.canDelete).toBe(false);

    act(() => {
      result.current.onEdit();
    });

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockPush).not.toHaveBeenCalledWith('/patients/patients/patient-1/edit');
    expect(mockRemove).not.toHaveBeenCalled();
    expect(confirmAction).not.toHaveBeenCalled();
  });

  it('redirects scoped users to access denied notice when detail record is outside tenant scope', async () => {
    mockCrudData = {
      id: 'patient-1',
      tenant_id: 'tenant-2',
      facility_id: 'facility-9',
      first_name: 'Unscoped',
      last_name: 'Patient',
    };

    renderHook(() => usePatientResourceDetailScreen('patients'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/patients/patients?notice=accessDenied');
    });
  });

  it('hydrates patient-identifiers detail with a human-readable patient label', () => {
    mockParams = { id: 'identifier-1' };
    mockCrudData = {
      id: 'identifier-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-a',
      identifier_type: 'MRN',
      identifier_value: 'MRN-100',
    };
    usePatient.mockReturnValue({
      get: mockGetPatientById,
      data: { id: 'patient-a', first_name: 'Amy', last_name: 'Jones' },
      isLoading: false,
      errorCode: null,
      reset: mockResetPatientLookup,
    });

    const { result } = renderHook(() => usePatientResourceDetailScreen('patient-identifiers'));
    const valueKeys = result.current.detailRows.map((row) => row.valueKey);

    expect(mockGetPatientById).toHaveBeenCalledWith('patient-a');
    expect(result.current.item.patient_display_label).toBe('Amy Jones');
    expect(valueKeys).toContain('patient_display_label');
    expect(valueKeys).not.toContain('patient_id');
  });

  it('hydrates patient-allergies detail with a human-readable patient label', () => {
    mockParams = { id: 'allergy-1' };
    mockCrudData = {
      id: 'allergy-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-b',
      allergen: 'Dust',
      severity: 'MILD',
    };
    usePatient.mockReturnValue({
      get: mockGetPatientById,
      data: { id: 'patient-b', first_name: 'Asha', last_name: 'Moraa' },
      isLoading: false,
      errorCode: null,
      reset: mockResetPatientLookup,
    });

    const { result } = renderHook(() => usePatientResourceDetailScreen('patient-allergies'));
    const valueKeys = result.current.detailRows.map((row) => row.valueKey);

    expect(mockGetPatientById).toHaveBeenCalledWith('patient-b');
    expect(result.current.item.patient_display_label).toBe('Asha Moraa');
    expect(valueKeys).toContain('patient_display_label');
    expect(valueKeys).not.toContain('patient_id');
  });
});
