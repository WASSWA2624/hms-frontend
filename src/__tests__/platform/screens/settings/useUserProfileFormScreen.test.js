/**
 * useUserProfileFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useUserProfileFormScreen = require('@platform/screens/settings/UserProfileFormScreen/useUserProfileFormScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useUserProfile: jest.fn(),
  useUser: jest.fn(),
  useFacility: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useUserProfile,
  useUser,
  useFacility,
  useTenantAccess,
} = require('@hooks');

describe('useUserProfileFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListUsers = jest.fn();
  const mockResetUsers = jest.fn();
  const mockListFacilities = jest.fn();
  const mockResetFacilities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useUserProfile.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'u-1', email: 'user@acme.org' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });
    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'f-1', name: 'Main Facility' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
  });

  it('returns initial create state', () => {
    const { result } = renderHook(() => useUserProfileFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.userId).toBe('u-1');
    expect(result.current.facilityId).toBe('f-1');
    expect(result.current.firstName).toBe('');
    expect(result.current.profile).toBeNull();
  });

  it('loads users and facilities with capped list limits', () => {
    renderHook(() => useUserProfileFormScreen());
    expect(mockListUsers).toHaveBeenCalledWith({ page: 1, limit: 100 });
    expect(mockListFacilities).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('hydrates edit mode and fetches detail by id', () => {
    mockParams = { id: 'profile-1' };
    useUserProfile.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'profile-1',
        user_id: 'u-1',
        facility_id: 'f-1',
        first_name: 'Jane',
        middle_name: 'A',
        last_name: 'Doe',
        gender: 'FEMALE',
        date_of_birth: '1990-01-01',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserProfileFormScreen());
    expect(mockGet).toHaveBeenCalledWith('profile-1');
    expect(result.current.userId).toBe('u-1');
    expect(result.current.firstName).toBe('Jane');
  });

  it('submits create payload and navigates with created notice', async () => {
    mockCreate.mockResolvedValue({ id: 'profile-1' });
    const { result } = renderHook(() => useUserProfileFormScreen());

    act(() => {
      result.current.setUserId(' u-1 ');
      result.current.setFacilityId(' f-1 ');
      result.current.setFirstName(' Jane ');
      result.current.setMiddleName(' A ');
      result.current.setLastName(' Doe ');
      result.current.setGender(' FEMALE ');
      result.current.setDateOfBirth('1990-01-01');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      user_id: 'u-1',
      facility_id: 'f-1',
      first_name: 'Jane',
      middle_name: 'A',
      last_name: 'Doe',
      gender: 'FEMALE',
      date_of_birth: '1990-01-01T00:00:00.000Z',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-profiles?notice=created');
  });

  it('submits edit payload and clears optional fields when blank', async () => {
    mockParams = { id: 'profile-1' };
    mockUpdate.mockResolvedValue({ id: 'profile-1' });
    useUserProfile.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'profile-1',
        user_id: 'u-1',
        facility_id: 'f-1',
        first_name: 'Jane',
        middle_name: 'A',
        last_name: 'Doe',
        gender: 'FEMALE',
        date_of_birth: '1990-01-01',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useUserProfileFormScreen());
    act(() => {
      result.current.setFirstName('Jane');
      result.current.setFacilityId('');
      result.current.setMiddleName('');
      result.current.setLastName('');
      result.current.setGender('');
      result.current.setDateOfBirth('');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('profile-1', {
      first_name: 'Jane',
      facility_id: null,
      middle_name: null,
      last_name: null,
      gender: null,
      date_of_birth: null,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/user-profiles?notice=updated');
  });

  it('builds readable locked-user display and avoids raw id for non-privileged users', () => {
    mockParams = { id: 'profile-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useUserProfile.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'profile-1',
        user_id: 'u-1',
        first_name: 'Jane',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'u-1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => useUserProfileFormScreen());
    expect(result.current.userDisplayLabel).toBe('userProfile.form.userOptionFallback');
    expect(result.current.userDisplayLabel).not.toBe('u-1');
  });
});
