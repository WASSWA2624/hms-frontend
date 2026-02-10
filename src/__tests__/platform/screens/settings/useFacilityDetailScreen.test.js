/**
 * useFacilityDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useFacilityDetailScreen = require('@platform/screens/settings/FacilityDetailScreen/useFacilityDetailScreen').default;

const mockPush = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useFacility: jest.fn(),
}));

jest.mock('@utils', () => {
  const actual = jest.requireActual('@utils');
  return {
    ...actual,
    confirmAction: jest.fn(() => true),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({ id: 'fid-1' }),
}));

const { useFacility, useNetwork } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useFacilityDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useFacility.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'fid-1', name: 'Test Facility' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns facility, handlers, and state', () => {
    const { result } = renderHook(() => useFacilityDetailScreen());
    expect(result.current.facility).toEqual({ id: 'fid-1', name: 'Test Facility' });
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onBack).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls get on mount with id', () => {
    renderHook(() => useFacilityDetailScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('fid-1');
  });

  it('onRetry calls fetchDetail', () => {
    const { result } = renderHook(() => useFacilityDetailScreen());
    mockReset.mockClear();
    mockGet.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('fid-1');
  });

  it('onBack pushes route to list', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useFacilityDetailScreen());
    result.current.onBack();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities');
  });

  it('onEdit pushes edit route when id available', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useFacilityDetailScreen());
    result.current.onEdit();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities/fid-1/edit');
  });

  it('exposes errorMessage when errorCode set', () => {
    useFacility.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'FACILITY_NOT_FOUND',
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityDetailScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBeDefined();
  });

  it('onDelete calls remove then navigates with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    mockPush.mockClear();
    const { result } = renderHook(() => useFacilityDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useFacilityDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities?notice=queued');
  });

  it('onDelete does not navigate when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    mockPush.mockClear();
    const { result } = renderHook(() => useFacilityDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('onDelete does not throw when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useFacilityDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).toHaveBeenCalledWith('fid-1');
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useFacilityDetailScreen());
    await act(async () => {
      await result.current.onDelete();
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles null facility when data is null', () => {
    useFacility.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityDetailScreen());
    expect(result.current.facility).toBeNull();
  });

  it('handles null facility when data is array', () => {
    useFacility.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: [],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityDetailScreen());
    expect(result.current.facility).toBeNull();
  });
});
