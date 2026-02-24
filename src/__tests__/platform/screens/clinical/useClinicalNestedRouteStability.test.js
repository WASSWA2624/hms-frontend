const { renderHook, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockList = jest.fn();
const mockGet = jest.fn();
const mockReset = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useScopeAccess: jest.fn(),
}));

jest.mock('@platform/screens/clinical/useClinicalResourceCrud', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useClinicalResourceListScreen =
  require('@platform/screens/clinical/ClinicalResourceListScreen/useClinicalResourceListScreen').default;
const useClinicalResourceDetailScreen =
  require('@platform/screens/clinical/ClinicalResourceDetailScreen/useClinicalResourceDetailScreen').default;
const { useI18n, useNetwork, useScopeAccess } = require('@hooks');
const useClinicalResourceCrud = require('@platform/screens/clinical/useClinicalResourceCrud').default;

describe('Clinical Nested Route Stability', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocalSearchParams.mockImplementation(() => ({
      tenantId: ['tenant-1'],
      facilityId: ['facility-1'],
      patientId: ['patient-1'],
      status: ['ACTIVE'],
    }));

    useI18n.mockReturnValue({
      t: (key) => key,
    });

    useNetwork.mockReturnValue({
      isOffline: false,
    });

    useScopeAccess.mockReturnValue({
      canRead: true,
      canWrite: true,
      canDelete: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    useClinicalResourceCrud.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: jest.fn(),
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('does not repeatedly refetch list on rerender with stable query values', async () => {
    const { rerender } = renderHook(() => useClinicalResourceListScreen('encounters'));

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));

    rerender({});

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
  });

  it('does not repeatedly refetch detail on rerender when id is array-shaped', async () => {
    mockUseLocalSearchParams.mockImplementation(() => ({
      id: ['encounter-1'],
      tenantId: ['tenant-1'],
      facilityId: ['facility-1'],
      patientId: ['patient-1'],
    }));

    useClinicalResourceCrud.mockReturnValue({
      list: mockList,
      get: mockGet,
      remove: jest.fn(),
      data: { id: 'encounter-1', tenant_id: 'tenant-1' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { rerender } = renderHook(() => useClinicalResourceDetailScreen('encounters'));

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));

    rerender({});

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
  });
});
