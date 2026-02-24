const { renderHook, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockList = jest.fn();
const mockGet = jest.fn();
const mockReset = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockStorageGetItem = jest.fn();
const mockStorageSetItem = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useSchedulingAccess: jest.fn(),
}));

jest.mock('@platform/screens/scheduling/useSchedulingResourceCrud', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: (...args) => mockStorageGetItem(...args),
    setItem: (...args) => mockStorageSetItem(...args),
  },
}));

const useSchedulingResourceListScreen =
  require('@platform/screens/scheduling/SchedulingResourceListScreen/useSchedulingResourceListScreen').default;
const useSchedulingResourceDetailScreen =
  require('@platform/screens/scheduling/SchedulingResourceDetailScreen/useSchedulingResourceDetailScreen').default;
const { useAuth, useI18n, useNetwork, useSchedulingAccess } = require('@hooks');
const useSchedulingResourceCrud = require('@platform/screens/scheduling/useSchedulingResourceCrud').default;

describe('Scheduling Nested Route Stability', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocalSearchParams.mockImplementation(() => ({
      patientId: ['patient-1'],
      providerUserId: ['provider-1'],
      scheduleId: ['schedule-1'],
      appointmentId: ['appointment-1'],
      status: ['SCHEDULED'],
      dayOfWeek: ['2'],
      isAvailable: ['true'],
    }));

    useI18n.mockReturnValue({
      t: (key) => key,
      locale: 'en',
    });

    useAuth.mockReturnValue({
      user: { id: 'user-1' },
    });

    useNetwork.mockReturnValue({
      isOffline: false,
    });

    useSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canCreateSchedulingRecords: true,
      canEditSchedulingRecords: true,
      canDeleteSchedulingRecords: true,
      canCancelAppointments: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    mockStorageGetItem.mockResolvedValue(null);

    useSchedulingResourceCrud.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: jest.fn(),
      cancel: jest.fn(),
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('does not repeatedly refetch list on rerender with stable query values', async () => {
    const { rerender } = renderHook(() => useSchedulingResourceListScreen('appointments'));

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));

    rerender({});

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
  });

  it('does not repeatedly refetch detail on rerender when id is array-shaped', async () => {
    mockUseLocalSearchParams.mockImplementation(() => ({
      id: ['appointment-1'],
      patientId: ['patient-1'],
      providerUserId: ['provider-1'],
    }));

    useSchedulingResourceCrud.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: jest.fn(),
      cancel: jest.fn(),
      data: { id: 'appointment-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { rerender } = renderHook(() => useSchedulingResourceDetailScreen('appointments'));

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));

    rerender({});

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
  });
});
