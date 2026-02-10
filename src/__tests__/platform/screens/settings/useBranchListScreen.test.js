/**
 * useBranchListScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useBranchListScreen = require('@platform/screens/settings/BranchListScreen/useBranchListScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useBranch: jest.fn(),
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

const { useBranch, useNetwork } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useBranchListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useBranch.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [], pagination: {} },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('returns items, handlers, and state', () => {
    const { result } = renderHook(() => useBranchListScreen());
    expect(result.current.items).toEqual([]);
    expect(result.current.search).toBe('');
    expect(typeof result.current.onRetry).toBe('function');
    expect(typeof result.current.onSearch).toBe('function');
    expect(typeof result.current.onBranchPress).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('calls list on mount', () => {
    renderHook(() => useBranchListScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onRetry calls fetchList', () => {
    const { result } = renderHook(() => useBranchListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onSearch updates list with trimmed search', () => {
    const { result } = renderHook(() => useBranchListScreen());
    mockReset.mockClear();
    mockList.mockClear();
    act(() => {
      result.current.onSearch('  main  ');
    });
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20, search: 'main' });
  });

  it('onRetry uses current search', () => {
    const { result } = renderHook(() => useBranchListScreen());
    act(() => {
      result.current.onSearch('branch');
    });
    mockReset.mockClear();
    mockList.mockClear();
    result.current.onRetry();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20, search: 'branch' });
  });

  it('onBranchPress pushes route with id', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useBranchListScreen());
    result.current.onBranchPress('bid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/branches/bid-1');
  });

  it('onAdd pushes route to create', () => {
    mockPush.mockClear();
    const { result } = renderHook(() => useBranchListScreen());
    result.current.onAdd();
    expect(mockPush).toHaveBeenCalledWith('/settings/branches/create');
  });

  it('exposes errorMessage when errorCode set', () => {
    useBranch.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchListScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('branch.list.loadError');
  });

  it('onDelete calls remove then fetchList', async () => {
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    mockReset.mockClear();
    mockList.mockClear();
    const { result } = renderHook(() => useBranchListScreen());
    await act(async () => {
      await result.current.onDelete('bid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20 });
  });

  it('onDelete sets notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'bid-1' });
    const { result } = renderHook(() => useBranchListScreen());
    await act(async () => {
      await result.current.onDelete('bid-1');
    });
    expect(result.current.noticeMessage).toBe('branch.list.noticeQueued');
  });

  it('onDelete does not refetch when remove returns undefined', async () => {
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBranchListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('bid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete calls stopPropagation when event provided', async () => {
    const stopPropagation = jest.fn();
    mockRemove.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBranchListScreen());
    await act(async () => {
      await result.current.onDelete('bid-1', { stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onDelete does not throw or refetch when remove rejects', async () => {
    mockRemove.mockRejectedValue(new Error('remove failed'));
    const { result } = renderHook(() => useBranchListScreen());
    mockList.mockClear();
    await act(async () => {
      await result.current.onDelete('bid-1');
    });
    expect(mockRemove).toHaveBeenCalledWith('bid-1');
    expect(mockList).not.toHaveBeenCalled();
  });

  it('onDelete does not call remove when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useBranchListScreen());
    await act(async () => {
      await result.current.onDelete('bid-1');
    });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('handles items from data', () => {
    useBranch.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 'b1', name: 'Branch 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchListScreen());
    expect(result.current.items).toEqual([{ id: 'b1', name: 'Branch 1' }]);
  });

  it('handles items array data', () => {
    useBranch.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: [{ id: 'b1', name: 'Branch 1' }],
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    const { result } = renderHook(() => useBranchListScreen());
    expect(result.current.items).toEqual([{ id: 'b1', name: 'Branch 1' }]);
  });

  it('handles notice param and clears it', () => {
    mockParams = { notice: 'created' };
    const { result } = renderHook(() => useBranchListScreen());
    expect(result.current.noticeMessage).toBe('branch.list.noticeCreated');
    expect(mockReplace).toHaveBeenCalledWith('/settings/branches');
  });
});
