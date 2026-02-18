/**
 * useUserProfileListScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const ReactNative = require('react-native');

const mockUseWindowDimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};
const mockTranslate = (key, values) => {
  if (key === 'userProfile.list.bulkDeleteConfirm') return `Confirm ${values?.count || 0}`;
  return key;
};

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: mockTranslate,
  })),
  useAuth: jest.fn(),
  useNetwork: jest.fn(),
  useUser: jest.fn(),
  useFacility: jest.fn(),
  useUserProfile: jest.fn(),
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

const useUserProfileListScreen = require('@platform/screens/settings/UserProfileListScreen/useUserProfileListScreen').default;
const {
  useAuth,
  useNetwork,
  useUser,
  useFacility,
  useUserProfile,
  useTenantAccess,
} = require('@hooks');
const { async: asyncStorage } = require('@services/storage');
const { confirmAction } = require('@utils');

describe('useUserProfileListScreen', () => {
  const mockListProfiles = jest.fn();
  const mockRemoveProfile = jest.fn();
  const mockResetProfiles = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  const renderUseUserProfileListScreen = async () => {
    const rendered = renderHook(() => useUserProfileListScreen());
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
    useUserProfile.mockReturnValue({
      list: mockListProfiles,
      remove: mockRemoveProfile,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetProfiles,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      reset: mockResetUsers,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [] },
      reset: mockResetFacilities,
    });
    asyncStorage.getItem.mockResolvedValue(null);
    asyncStorage.setItem.mockResolvedValue(true);
  });

  it('loads profile, user, and facility lists with capped limits for global admins', async () => {
    const { result } = await renderUseUserProfileListScreen();

    expect(mockResetProfiles).toHaveBeenCalled();
    expect(mockListProfiles).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(result.current.isTableMode).toBe(true);
    expect(result.current.canViewTechnicalIds).toBe(true);
  });

  it('tenant-scoped admins keep profile list unscoped while lookups stay tenant-scoped', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    await renderUseUserProfileListScreen();

    expect(mockListProfiles).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100, tenant_id: 'tenant-1' });
  });

  it('supports scoped search and gender filter', async () => {
    useUserProfile.mockReturnValue({
      list: mockListProfiles,
      remove: mockRemoveProfile,
      data: {
        items: [
          { id: 'profile-1', first_name: 'Jane', user_id: 'u-1', gender: 'FEMALE' },
          { id: 'profile-2', first_name: 'John', user_id: 'u-2', gender: 'MALE' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockResetProfiles,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: {
        items: [
          { id: 'u-1', email: 'jane@acme.org' },
          { id: 'u-2', email: 'john@acme.org' },
        ],
      },
      reset: mockResetUsers,
    });

    const { result } = await renderUseUserProfileListScreen();

    act(() => {
      result.current.onSearchScopeChange('profile');
      result.current.onSearch('john');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['profile-2']);

    const filterId = result.current.filters[0].id;
    act(() => {
      result.current.onSearch('');
      result.current.onFilterFieldChange(filterId, 'gender');
      result.current.onFilterOperatorChange(filterId, 'is');
      result.current.onFilterValueChange(filterId, 'female');
    });
    expect(result.current.items.map((item) => item.id)).toEqual(['profile-1']);
  });

  it('uses cached profile records when offline and live payload is unavailable', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useUserProfile.mockReturnValue({
      list: mockListProfiles,
      remove: mockRemoveProfile,
      data: null,
      isLoading: false,
      errorCode: 'NETWORK_ERROR',
      reset: mockResetProfiles,
    });
    asyncStorage.getItem.mockImplementation(async (key) => {
      if (String(key).includes('hms.settings.userProfiles.list.cache')) {
        return [{ id: 'cached-1', first_name: 'Cached', user_id: 'u-1', gender: 'UNKNOWN' }];
      }
      return null;
    });

    const { result } = await renderUseUserProfileListScreen();

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('cached-1');
    });
  });

  it('bulk delete removes selected profiles when confirmed', async () => {
    useUserProfile.mockReturnValue({
      list: mockListProfiles,
      remove: mockRemoveProfile,
      data: {
        items: [
          { id: 'profile-1', first_name: 'One', user_id: 'u-1' },
          { id: 'profile-2', first_name: 'Two', user_id: 'u-2' },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockResetProfiles,
    });
    mockRemoveProfile.mockResolvedValue({ ok: true });

    const { result } = await renderUseUserProfileListScreen();

    act(() => {
      result.current.onToggleProfileSelection('profile-1');
      result.current.onToggleProfileSelection('profile-2');
    });

    await act(async () => {
      await result.current.onBulkDelete();
    });

    expect(confirmAction).toHaveBeenCalledWith('Confirm 2');
    expect(mockRemoveProfile).toHaveBeenNthCalledWith(1, 'profile-1');
    expect(mockRemoveProfile).toHaveBeenNthCalledWith(2, 'profile-2');
  });

  it('redirects unauthorized users to settings', async () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    await renderUseUserProfileListScreen();

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });
});
