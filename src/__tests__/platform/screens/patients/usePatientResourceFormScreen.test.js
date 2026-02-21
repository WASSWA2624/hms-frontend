const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};
let mockCrudData = null;

const mockGet = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockResetCrud = jest.fn();
const mockListPatients = jest.fn();
const mockResetPatients = jest.fn();
const mockListTenants = jest.fn();
const mockResetTenants = jest.fn();
const mockListFacilities = jest.fn();
const mockResetFacilities = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: (key, values) => {
      if (values && typeof values === 'object' && Object.prototype.hasOwnProperty.call(values, 'position')) {
        return `${key}-${values.position}`;
      }
      return key;
    },
  })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  usePatient: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  usePatientAccess: jest.fn(),
}));

jest.mock('@platform/screens/patients/usePatientResourceCrud', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePatientResourceFormScreen = require('@platform/screens/patients/PatientResourceFormScreen/usePatientResourceFormScreen').default;
const usePatientResourceCrud = require('@platform/screens/patients/usePatientResourceCrud').default;
const {
  usePatient,
  useTenant,
  useFacility,
  usePatientAccess,
} = require('@hooks');

describe('usePatientResourceFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockCrudData = null;

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    usePatient.mockReturnValue({
      list: mockListPatients,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPatients,
    });

    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-a', name: 'North Tenant' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-1', name: 'Main Facility' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });

    usePatientResourceCrud.mockImplementation(() => ({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: mockCrudData,
      isLoading: false,
      errorCode: null,
      reset: mockResetCrud,
    }));
  });

  it('hides tenant and facility fields when pre-known context values exist', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: true,
      tenantId: 'tenant-context',
      facilityId: 'facility-context',
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(result.current.values.tenant_id).toBe('tenant-context');
    });

    expect(result.current.showTenantField).toBe(false);
    expect(result.current.visibleFields.some((field) => field.name === 'facility_id')).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).not.toHaveBeenCalled();
  });

  it('uses tenant and facility selectors backed by lookup options', async () => {
    const { result } = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });

    act(() => {
      result.current.setFieldValue('tenant_id', 'tenant-a');
    });

    await waitFor(() => {
      expect(mockListFacilities).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
        tenant_id: 'tenant-a',
      });
    });

    const facilityField = result.current.visibleFields.find((field) => field.name === 'facility_id');
    expect(result.current.showTenantField).toBe(true);
    expect(result.current.tenantOptions.length).toBeGreaterThan(0);
    expect(facilityField).toBeTruthy();
    expect(facilityField.type).toBe('select');
    expect(facilityField.options[0]).toMatchObject({
      value: 'facility-1',
      label: 'Main Facility',
    });
  });

  it('keeps create and edit core writable fields aligned for patients form', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const createHook = renderHook(() => usePatientResourceFormScreen('patients'));
    const createFields = createHook.result.current.visibleFields.map((field) => field.name);

    mockParams = { id: 'patient-1' };
    mockCrudData = {
      id: 'patient-1',
      tenant_id: 'tenant-1',
      first_name: 'Jane',
      last_name: 'Doe',
      facility_id: 'facility-1',
      is_active: true,
    };

    const editHook = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(editHook.result.current.isEdit).toBe(true);
    });

    const editFields = editHook.result.current.visibleFields.map((field) => field.name);
    expect(editFields).toEqual(createFields);
  });
});
