/**
 * useUserProfileDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserProfileDetailScreen = require('@platform/screens/settings/UserProfileDetailScreen/useUserProfileDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUserProfile: jest.fn(),
  useUser: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
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
  useLocalSearchParams: () => ({ id: 'profile-1' }),
}));

const {
  useUserProfile,
  useUser,
  useFacility,
  useNetwork,
  useTenantAccess,
} = require('@hooks');
const { confirmAction } = require('@utils');

describe('useUserProfileDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useUserProfile.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: {
        id: 'profile-1',
        user_id: 'u-1',
        facility_id: 'f-1',
        first_name: 'Jane',
        gender: 'FEMALE',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'u-1', email: 'jane@acme.org', tenant_id: 'tenant-1' }] },
      reset: mockResetUsers,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'f-1', name: 'Main Facility' }] },
      reset: mockResetFacilities,
    });
  });

  it('returns profile detail and human-readable context for global admins', () => {
    const { result } = renderHook(() => useUserProfileDetailScreen());

    expect(result.current.profile.id).toBe('profile-1');
    expect(result.current.profileUserDisplay).toBe('jane@acme.org');
    expect(result.current.profileFacilityDisplay).toBe('Main Facility');
    expect(result.current.profileDisplayName).toBe('Jane');
    expect(result.current.canViewTechnicalIds).toBe(true);
  });

  it('loads detail and lookup lists with capped limits', () => {
    renderHook(() => useUserProfileDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('profile-1');
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('redirects users without access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useUserProfileDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped admins when linked tenant does not match', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-9',
      isResolved: true,
    });

    renderHook(() => useUserProfileDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/user-profiles?notice=accessDenied');
  });

  it('onDelete navigates with deleted notice on success', async () => {
    mockRemove.mockResolvedValue({ id: 'profile-1' });
    const { result } = renderHook(() => useUserProfileDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('profile-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/user-profiles?notice=deleted');
  });

  it('onDelete navigates with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'profile-1' });
    const { result } = renderHook(() => useUserProfileDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/user-profiles?notice=queued');
  });

  it('onDelete is cancelled when confirmation is declined', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useUserProfileDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
