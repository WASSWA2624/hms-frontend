const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockList = jest.fn();
const mockReset = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useDebounce: jest.fn((value) => value),
  useI18n: jest.fn(() => ({ t: (key, values) => {
    if (key === 'patients.overview.unnamedPatient') {
      return `Patient ${values?.position || ''}`.trim();
    }
    if (key === 'patients.directory.pageSummary') {
      return `Page ${values?.page}/${values?.totalPages}`;
    }
    return key;
  } })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  usePatient: jest.fn(),
  usePatientAccess: jest.fn(),
}));

const usePatientDirectoryScreen = require('@platform/screens/patients/PatientDirectoryScreen/usePatientDirectoryScreen').default;
const { useDebounce, usePatient, usePatientAccess } = require('@hooks');

describe('usePatientDirectoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-02-22T10:00:00.000Z'));

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });

    usePatient.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: 'patient-1',
            first_name: 'Jane',
            last_name: 'Doe',
            human_friendly_id: 'PAT-0001',
            tenant_label: 'Main Tenant',
            tenant_human_friendly_id: 'TEN-01',
            facility_label: 'Main Facility',
            facility_human_friendly_id: 'FAC-01',
            updated_at: '2026-02-21T10:30:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads directory with bounded numeric params and scoped tenant filters', () => {
    renderHook(() => usePatientDirectoryScreen());

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledTimes(1);

    const params = mockList.mock.calls[0][0];
    expect(params).toMatchObject({
      page: 1,
      limit: 20,
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
    });
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
  });

  it('uses debounced search value and resets to first page on search change', () => {
    const { result } = renderHook(() => usePatientDirectoryScreen());

    act(() => {
      result.current.onSearch('guardian phone');
    });

    const latestParams = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(latestParams.search).toBe('guardian phone');
    expect(latestParams.page).toBe(1);
    expect(useDebounce).toHaveBeenCalledWith('guardian phone', 300);
  });

  it('bounds invalid sort/order/page size inputs to safe defaults', () => {
    const { result } = renderHook(() => usePatientDirectoryScreen());

    act(() => {
      result.current.onSortBy('bad-sort');
      result.current.onOrder('bad-order');
      result.current.onPageSize('999');
    });

    const latestParams = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(latestParams.sort_by).toBe('updated_at');
    expect(latestParams.order).toBe('asc');
    expect(latestParams.limit).toBe(20);
  });

  it('applies advanced patient filters and date ranges as combined query params', () => {
    const { result } = renderHook(() => usePatientDirectoryScreen());

    act(() => {
      result.current.onFilterChange('patient_id', 'PAT-0100');
      result.current.onFilterChange('first_name', 'Jane');
      result.current.onFilterChange('contact', '+256700000010');
      result.current.onFilterChange('appointment_status', 'CONFIRMED');
      result.current.onDateRangeValueChange('created', 'from', '2026-01-01');
      result.current.onDateRangeValueChange('created', 'to', '2026-01-31');
      result.current.onDateRangeValueChange('appointments', 'from', '2026-02-01');
      result.current.onDateRangeValueChange('appointments', 'to', '2026-02-15');
      result.current.onApplyFilters();
    });

    const latestParams = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(latestParams).toEqual(expect.objectContaining({
      patient_id: 'PAT-0100',
      first_name: 'Jane',
      contact: '+256700000010',
      appointment_status: 'CONFIRMED',
      created_from: '2026-01-01',
      created_to: '2026-01-31',
      appointment_from: '2026-02-01',
      appointment_to: '2026-02-15',
      page: 1,
    }));
  });

  it('applies quick date-range presets and maps them to created date filters', () => {
    const { result } = renderHook(() => usePatientDirectoryScreen());

    act(() => {
      result.current.onDateRangePresetChange('created', 'LAST_7_DAYS');
      result.current.onApplyFilters();
    });

    const latestParams = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(latestParams.created_from).toBe('2026-02-16');
    expect(latestParams.created_to).toBe('2026-02-22');
  });

  it('clears advanced filters from query payload', () => {
    const { result } = renderHook(() => usePatientDirectoryScreen());

    act(() => {
      result.current.onFilterChange('patient_id', 'PAT-0200');
      result.current.onApplyFilters();
    });
    let latestParams = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(latestParams.patient_id).toBe('PAT-0200');

    act(() => {
      result.current.onClearFilters();
    });
    latestParams = mockList.mock.calls[mockList.mock.calls.length - 1][0];
    expect(latestParams.patient_id).toBeUndefined();
  });

  it('opens patient workspace route from a selected row', () => {
    const { result } = renderHook(() => usePatientDirectoryScreen());

    act(() => {
      result.current.onOpenPatient('patient-9');
    });

    expect(mockPush).toHaveBeenCalledWith('/patients/patients/patient-9');
  });

  it('flags entitlement blocked state for MODULE_NOT_ENTITLED errors', () => {
    usePatient.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: 'MODULE_NOT_ENTITLED',
      reset: mockReset,
    });

    const { result } = renderHook(() => usePatientDirectoryScreen());
    expect(result.current.isEntitlementBlocked).toBe(true);
  });
});
