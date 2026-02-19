/**
 * useContactListScreen Hook Tests
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
      if (key === 'contact.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
      return key;
    },
  })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useContact: jest.fn(),
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

const useContactListScreen = require('@platform/screens/settings/ContactListScreen/useContactListScreen').default;
const { useAuth, useNetwork, useContact, useTenantAccess } = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useContactListScreen', () => {
  const mockList = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  const renderUseContactListScreen = async () => {
    const rendered = renderHook(() => useContactListScreen());
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
    useContact.mockReturnValue({
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

  it('global admin path enables list/create/delete and table mode', async () => {
    const { result } = await renderUseContactListScreen();

    expect(mockReset).toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(result.current.isTableMode).toBe(true);
    expect(typeof result.current.onAdd).toBe('function');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
    expect(result.current.canViewTechnicalIds).toBe(true);

    await waitFor(() => {
      expect(asyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('uses compact mobile list mode below table breakpoint', async () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 420,
      height: 900,
      scale: 1,
      fontScale: 1,
    });

    const { result } = await renderUseContactListScreen();
    expect(result.current.isTableMode).toBe(false);
  });

  it('global all-field search and scoped search behave correctly', async () => {
    useContact.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          {
            id: 'contact-1',
            value: 'billing@acme.org',
            contact_type: 'EMAIL',
            is_primary: true,
          },
          {
            id: 'contact-2',
            value: '+256700111222',
            contact_type: 'PHONE',
            is_primary: false,
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseContactListScreen();

    act(() => {
      result.current.onSearch('700111');
    });
    expect(result.current.items.some((item) => item.id === 'contact-2')).toBe(true);

    act(() => {
      result.current.onSearchScopeChange('type');
      result.current.onSearch('email');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('contact-1');
  });

  it('advanced filters support multi-condition OR grouping', async () => {
    useContact.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'contact-1', value: 'primary@acme.org', contact_type: 'EMAIL', is_primary: true },
          { id: 'contact-2', value: 'team@beta.org', contact_type: 'EMAIL', is_primary: false },
          { id: 'contact-3', value: '+256700123456', contact_type: 'PHONE', is_primary: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseContactListScreen();

    const firstFilterId = result.current.filters[0].id;

    act(() => {
      result.current.onFilterFieldChange(firstFilterId, 'type');
      result.current.onFilterOperatorChange(firstFilterId, 'equals');
      result.current.onFilterValueChange(firstFilterId, 'email');
      result.current.onAddFilter();
    });

    const secondFilterId = result.current.filters[1].id;
    act(() => {
      result.current.onFilterFieldChange(secondFilterId, 'primary');
      result.current.onFilterOperatorChange(secondFilterId, 'is');
      result.current.onFilterValueChange(secondFilterId, 'secondary');
      result.current.onFilterLogicChange('OR');
    });

    expect(result.current.items.map((contact) => contact.id)).toEqual([
      'contact-3',
      'contact-1',
      'contact-2',
    ]);
  });

  it('tenant-scoped admin fetches contacts for own tenant context', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = await renderUseContactListScreen();

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(result.current.canViewTechnicalIds).toBe(false);
    expect(typeof result.current.onAdd).toBe('function');
  });

  it('persists updated table preferences', async () => {
    asyncStorage.getItem.mockResolvedValue({
      pageSize: 20,
      density: 'comfortable',
      columnOrder: ['primary', 'tenant', 'type', 'value'],
      visibleColumns: ['primary', 'value'],
      searchScope: 'primary',
      filterLogic: 'OR',
      filters: [{ id: 'stored-filter', field: 'primary', operator: 'is', value: 'primary' }],
    });

    const { result } = await renderUseContactListScreen();

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.density).toBe('comfortable');
      expect(result.current.searchScope).toBe('primary');
    });

    act(() => {
      result.current.onDensityChange('compact');
    });

    await waitFor(() => {
      expect(asyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('redirects unauthorized users to settings after roles resolve', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUseContactListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUseContactListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('onDelete is blocked when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    mockRemove.mockResolvedValue({ id: 'contact-1' });

    const { result } = await renderUseContactListScreen();
    await act(async () => {
      await result.current.onDelete('contact-1');
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('uses cached contacts when offline and live list data is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useContact.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockReset,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.contacts.list.cache')) {
        return [{
          id: 'contact-cached-1',
          value: 'cached@acme.org',
          contact_type: 'EMAIL',
          is_primary: true,
        }];
      }
      return null;
    });

    const { result } = await renderUseContactListScreen();

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('contact-cached-1');
    });
  });

  it('refreshes contact list automatically when connection is restored', async () => {
    const networkState = { isOffline: true };
    useNetwork.mockImplementation(() => networkState);

    const { rerender } = await renderUseContactListScreen();

    expect(mockList).not.toHaveBeenCalled();

    networkState.isOffline = false;
    rerender();

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });
  });

  it('prevents tenant-scoped users from opening contacts outside tenant scope', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useContact.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'contact-2',
          tenant_id: 'tenant-2',
          value: 'external@acme.org',
          contact_type: 'EMAIL',
          is_primary: true,
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseContactListScreen();

    act(() => {
      result.current.onContactPress('contact-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/contacts?notice=accessDenied');
  });

  it('prevents tenant-scoped users from opening contacts missing from the scoped list', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useContact.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [{
          id: 'contact-1',
          tenant_id: 'tenant-1',
          value: 'tenant@acme.org',
          contact_type: 'EMAIL',
          is_primary: true,
        }],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = await renderUseContactListScreen();

    act(() => {
      result.current.onContactPress('missing-contact-id');
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/contacts?notice=accessDenied');
  });

  it('bulk delete removes selected contacts when confirmed', async () => {
    useContact.mockReturnValue({
      list: mockList,
      remove: mockRemove,
      data: {
        items: [
          { id: 'contact-1', value: 'one@acme.org', contact_type: 'EMAIL', is_primary: true },
          { id: 'contact-2', value: '+256700999111', contact_type: 'PHONE', is_primary: false },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    mockRemove.mockResolvedValue({ ok: true });

    const { result } = await renderUseContactListScreen();

    act(() => {
      result.current.onToggleContactSelection('contact-1');
      result.current.onToggleContactSelection('contact-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(mockRemove).toHaveBeenNthCalledWith(1, 'contact-1');
    expect(mockRemove).toHaveBeenNthCalledWith(2, 'contact-2');
  });
});
