/**
 * useRoleListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: (key) => key,
  })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useRole: jest.fn(),
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

const useRoleListScreen = require('@platform/screens/settings/RoleListScreen/useRoleListScreen').default;
const { useAuth, useNetwork, useRole, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useRoleListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  const renderUseRoleListScreen = async () => {
    const rendered = renderHook(() => useRoleListScreen());
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
    useRole.mockReturnValue({
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

  it('global admin path enables list actions and uses capped numeric pagination', async () => {
    const { result } = await renderUseRoleListScreen();

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(result.current.isTableMode).toBe(true);
    expect(result.current.canViewTechnicalIds).toBe(true);
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');

    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('uses mobile mode below table breakpoint', async () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    const { result } = await renderUseRoleListScreen();
    expect(result.current.isTableMode).toBe(false);
  });

  it('tenant-scoped admins fetch and view only roles in their tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'role-1', tenant_id: 'tenant-1', name: 'Nurse' },
          { id: 'role-2', tenant_id: 'tenant-2', name: 'Billing' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseRoleListScreen();

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(result.current.items.map((item) => item.id)).toEqual(['role-1']);
    expect(result.current.canViewTechnicalIds).toBe(false);
  });

  it('supports advanced filters with OR grouping', async () => {
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'role-1', tenant_id: 'tenant-1', name: 'Billing', description: 'Finance operations' },
          { id: 'role-2', tenant_id: 'tenant-1', name: 'Nurse', description: 'Clinical workflow' },
          { id: 'role-3', tenant_id: 'tenant-1', name: 'Reception', description: 'Front desk' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseRoleListScreen();

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'name');
      result.current.onFilterOperatorChange(firstFilterId, 'equals');
      result.current.onFilterValueChange(firstFilterId, 'nurse');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;

    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'description');
      result.current.onFilterOperatorChange(secondFilterId, 'contains');
      result.current.onFilterValueChange(secondFilterId, 'desk');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['role-2', 'role-3']);
  });

  it('loads and persists table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['tenant', 'facility', 'name', 'description'],
      visibleColumns: ['tenant', 'name'],
      searchScope: 'tenant',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'tenant', operator: 'contains', value: 'acme' }],
      sortField: 'tenant',
      sortDirection: 'desc',
    });

    const { result } = await renderUseRoleListScreen();

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('tenant');
      expect(result.current.sortField).toBe('tenant');
      expect(result.current.sortDirection).toBe('desc');
    });

    act(() => {
      result.current.onDensityChange('compact');
    });

    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('redirects unauthorized users to settings', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUseRoleListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUseRoleListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('maps notice query and clears list query params', async () => {
    mockParams = { notice: 'accessDenied' };

    const { result } = await renderUseRoleListScreen();

    expect(result.current.noticeMessage).toBe('role.list.noticeAccessDenied');
    expect(mockReplace).toHaveBeenCalledWith('/settings/roles');
  });

  it('shows access-denied notice on forbidden API response', async () => {
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: { items: [] },
      isLoading: false,
      errorCode: 'FORBIDDEN',
      reset: mockReset,
    });

    const { result } = await renderUseRoleListScreen();

    expect(result.current.noticeMessage).toBe('role.list.noticeAccessDenied');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'role-1' });

    const { result } = await renderUseRoleListScreen();

    await act(async () => {
      await result.current.onDelete('role-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('prevents tenant-scoped users from opening, editing, or deleting out-of-scope roles', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'role-2', tenant_id: 'tenant-2', name: 'External role' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseRoleListScreen();

    act(() => {
      result.current.onItemPress('role-2');
    });

    act(() => {
      result.current.onEdit('role-2');
    });

    await act(async () => {
      await result.current.onDelete('role-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/roles?notice=accessDenied');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('prevents tenant-scoped users from opening roles missing from scoped rows', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useRole.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{ id: 'role-1', tenant_id: 'tenant-1', name: 'Scoped role' }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseRoleListScreen();

    act(() => {
      result.current.onItemPress('missing-role-id');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/roles?notice=accessDenied');
  });
});
