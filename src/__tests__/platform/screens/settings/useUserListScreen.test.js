/**
 * useUserListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: (key, values) => {
      if (key === 'user.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
      return key;
    },
  })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useUser: jest.fn(),
  useTenantAccess: jest.fn(),
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

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

const useUserListScreen = require('@platform/screens/settings/UserListScreen/useUserListScreen').default;
const { useAuth, useNetwork, useUser, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useUserListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  const renderUseUserListScreen = async () => {
    const rendered = renderHook(() => useUserListScreen());
    await act(async () => {
      await Promise.resolve();
    });
    return rendered;
  };

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
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useUser.mockReturnValue({
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

  it('fetches list with capped limit and enables table mode on desktop width', async () => {
    const { result } = await renderUseUserListScreen();
    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(result.current.isTableMode).toBe(true);
    expect(result.current.canViewTechnicalIds).toBe(true);
  });

  it('tenant-scoped admins query only their tenant', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    await renderUseUserListScreen();

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 100,
      tenant_id: 'tenant-1',
    });
  });

  it('tenant-scoped admins only render records in their tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'u-1', tenant_id: 'tenant-1', email: 'one@acme.org', status: 'ACTIVE' },
          { id: 'u-2', tenant_id: 'tenant-2', email: 'two@acme.org', status: 'ACTIVE' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserListScreen();

    expect(result.current.items.map((item) => item.id)).toEqual(['u-1']);
  });

  it('supports scoped search and status filter', async () => {
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'u-1', email: 'a@acme.org', status: 'ACTIVE' },
          { id: 'u-2', email: 'b@acme.org', status: 'SUSPENDED' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserListScreen();

    act(() => {
      result.current.onSearchScopeChange('email');
      result.current.onSearch('b@');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['u-2']);

    const filterId = result.current.filters[0].id;
    act(() => {
      result.current.onFilterFieldChange(filterId, 'status');
      result.current.onFilterOperatorChange(filterId, 'is');
      result.current.onFilterValueChange(filterId, 'active');
      result.current.onSearch('');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['u-1']);
  });

  it('uses cached records when offline and live payload is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.users.list.cache')) {
        return [{ id: 'cached-1', email: 'cached@acme.org', status: 'ACTIVE' }];
      }
      return null;
    });

    const { result } = await renderUseUserListScreen();

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('cached-1');
    });
  });

  it('redirects unauthorized users to settings after role resolution', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = await renderUseUserListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onAdd).toBeUndefined();
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped users without tenant context', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUseUserListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('bulk delete removes selected users when confirmed', async () => {
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [{ id: 'u-1', email: 'one@acme.org' }, { id: 'u-2', email: 'two@acme.org' }] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = await renderUseUserListScreen();

    act(() => {
      result.current.onToggleUserSelection('u-1');
      result.current.onToggleUserSelection('u-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'u-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'u-2');
  });

  it('prevents tenant-scoped users from opening users outside tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'u-2', tenant_id: 'tenant-2', email: 'outside@acme.org', status: 'ACTIVE' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserListScreen();

    act(() => {
      result.current.onUserPress('u-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/users?notice=accessDenied');
  });

  it('prevents tenant-scoped users from opening users missing from scoped rows', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'u-1', tenant_id: 'tenant-1', email: 'inside@acme.org', status: 'ACTIVE' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseUserListScreen();

    act(() => {
      result.current.onUserPress('missing-user-id');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/users?notice=accessDenied');
  });
});
