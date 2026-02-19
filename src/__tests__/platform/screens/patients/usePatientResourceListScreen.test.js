const { act, renderHook, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useI18n: jest.fn(() => ({
    t: (key, values) => {
      if (key === 'patients.common.list.bulkDeleteConfirm') {
        return `Delete ${values?.count || 0}?`;
      }
      if (values && typeof values === 'object' && Object.prototype.hasOwnProperty.call(values, 'position')) {
        return `${key}-${values.position}`;
      }
      return key;
    },
    locale: 'en-US',
  })),
  useNetwork: jest.fn(),
  usePatientAccess: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
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

const usePatientResourceListScreen = require('@platform/screens/patients/PatientResourceListScreen/usePatientResourceListScreen').default;
const usePatientResourceCrud = require('@platform/screens/patients/usePatientResourceCrud').default;
const { useAuth, useNetwork, usePatientAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('usePatientResourceListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockUseWindowDimensions.mockReturnValue({
      width: 1280,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    useAuth.mockReturnValue({ user: { id: 'user-1' } });
    useNetwork.mockReturnValue({ isOffline: false });
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });
    usePatientResourceCrud.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('sends bounded numeric list params and scoped tenant/facility filters', () => {
    renderHook(() => usePatientResourceListScreen('patients'));

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledTimes(1);
    const params = mockList.mock.calls[0][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
    expect(params).toMatchObject({
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
    });
  });

  it('switches between table and mobile list modes by width', () => {
    const { result: desktopResult } = renderHook(() => usePatientResourceListScreen('patients'));
    expect(desktopResult.current.isTableMode).toBe(true);

    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });
    const { result: mobileResult } = renderHook(() => usePatientResourceListScreen('patients'));
    expect(mobileResult.current.isTableMode).toBe(false);
  });

  it('supports global all-field search and scoped field search', () => {
    usePatientResourceCrud.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'patient-1',
            tenant_id: 'tenant-1',
            first_name: 'Alice',
            last_name: 'Ngugi',
            gender: 'FEMALE',
          },
          {
            id: 'patient-2',
            tenant_id: 'tenant-1',
            first_name: 'Brian',
            last_name: 'Beta',
            gender: 'MALE',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePatientResourceListScreen('patients'));

    act(() => {
      result.current.onSearch('beta');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('patient-2');

    act(() => {
      result.current.onSearchScopeChange('first_name');
      result.current.onSearch('alice');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('patient-1');
  });

  it('supports multi-condition OR filters', () => {
    usePatientResourceCrud.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'patient-1', tenant_id: 'tenant-1', first_name: 'A', gender: 'MALE', is_active: true },
          { id: 'patient-2', tenant_id: 'tenant-1', first_name: 'B', gender: 'FEMALE', is_active: false },
          { id: 'patient-3', tenant_id: 'tenant-1', first_name: 'C', gender: 'FEMALE', is_active: true },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePatientResourceListScreen('patients'));
    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'gender');
      result.current.onFilterOperatorChange(firstFilterId, 'equals');
      result.current.onFilterValueChange(firstFilterId, 'male');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'is_active');
      result.current.onFilterOperatorChange(secondFilterId, 'is');
      result.current.onFilterValueChange(secondFilterId, 'off');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['patient-1', 'patient-2']);
  });

  it('hides add/delete actions for read-only roles', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: false,
      canEditPatientRecords: false,
      canDeletePatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceListScreen('patients'));
    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      searchScope: 'gender',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'gender', operator: 'equals', value: 'male' }],
      columnOrder: ['createdAt', 'title', 'subtitle', 'updatedAt'],
      visibleColumns: ['title', 'createdAt'],
      sortField: 'createdAt',
      sortDirection: 'asc',
    });

    const { result } = renderHook(() => usePatientResourceListScreen('patients'));

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('gender');
    });

    act(() => {
      result.current.onDensityChange('compact');
    });

    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('blocks delete when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    usePatientResourceCrud.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 'patient-1', tenant_id: 'tenant-1', first_name: 'A' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePatientResourceListScreen('patients'));
    await act(async () => {
      await result.current.onDelete('patient-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('redirects unauthorized users to dashboard when access is resolved', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: false,
      canCreatePatientRecords: false,
      canEditPatientRecords: false,
      canDeletePatientRecords: false,
      canManageAllTenants: false,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientResourceListScreen('patients'));
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
