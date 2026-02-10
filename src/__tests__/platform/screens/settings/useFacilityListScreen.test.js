/**
 * useFacilityListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useFacilityListScreen = require('@platform/screens/settings/FacilityListScreen/useFacilityListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

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
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

const { useFacility, useNetwork } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useFacilityListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useFacility.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useFacilityListScreen());
    expect(result.current.items).toEqual([]);
    expect(result.current.search).toBe('');
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onSearch).toBe('function');
    expect(typeof result.current.onFacilityPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useFacilityListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useFacilityListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onSearch updates list with trimmed search', () => {
    const { result } = renderHook(() => useFacilityListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    act(() => {
      result.current.onSearch('  clinic  ');
    });
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20, search: 'clinic' });
  });

  it('onRetry uses current search', () => {
    const { result } = renderHook(() => useFacilityListScreen());
    act(() => {
      result.current.onSearch('facility');
    });
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20, search: 'facility' });
  });

  it('onFacilityPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useFacilityListScreen());
    result.current.onFacilityPress('fid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities/fid-1');
  });

  it('onAdd pushes route to create', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useFacilityListScreen());
    result.current.onAdd();
    expect(mockPush).toHaveBeenCalledWith('/settings/facilities/create');
  });

  it('exposes errorMessage when errorCode set', () => {
    useFacility.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('facility.list.loadError');
  });

  it('onDelete calls remove then fetchList', async () => {
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useFacilityListScreen());
    await act(async () => {
      await result.current.onDelete('fid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete sets notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useFacilityListScreen());
    await act(async () => {
      await result.current.onDelete('fid-1');
    });
    expect(result.current.noticeMessage).toBe('facility.list.noticeQueued');
  });

  it('onDelete does not refetch when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFacilityListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('fid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFacilityListScreen());
    await act(async () => {
      await result.current.onDelete('fid-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not throw or refetch when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useFacilityListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('fid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useFacilityListScreen());
    await act(async () => {
      await result.current.onDelete('fid-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles items from data', () => {
    useFacility.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 'f1', name: 'Facility 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityListScreen());
    expect(result.current.items).toEqual([{ id: 'f1', name: 'Facility 1' }]);
  });

  it('handles items array data', () => {
    useFacility.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: [{ id: 'f1', name: 'Facility 1' }],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useFacilityListScreen());
    expect(result.current.items).toEqual([{ id: 'f1', name: 'Facility 1' }]);
  });

  it('handles notice param and clears it', () => {
    mockParams = { notice: 'created' };
    const { result } = renderHook(() => useFacilityListScreen());
    expect(result.current.noticeMessage).toBe('facility.list.noticeCreated');
    expect(mockReplace).toHaveBeenCalledWith('/settings/facilities');
  });
});
