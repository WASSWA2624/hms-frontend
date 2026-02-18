/**
 * UserProfileDetailScreen Component Tests
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserProfileDetailScreen/useUserProfileDetailScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserProfileDetailScreen = require('@platform/screens/settings/UserProfileDetailScreen/useUserProfileDetailScreen').default;
const UserProfileDetailScreenWeb = require('@platform/screens/settings/UserProfileDetailScreen/UserProfileDetailScreen.web').default;
const UserProfileDetailScreenAndroid = require('@platform/screens/settings/UserProfileDetailScreen/UserProfileDetailScreen.android').default;
const UserProfileDetailScreenIOS = require('@platform/screens/settings/UserProfileDetailScreen/UserProfileDetailScreen.ios').default;
const UserProfileDetailScreenIndex = require('@platform/screens/settings/UserProfileDetailScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const mockT = (key) => {
  const dictionary = {
    'userProfile.detail.title': 'User Profile Details',
    'userProfile.detail.idLabel': 'Profile ID',
    'userProfile.detail.profileNameLabel': 'Profile name',
    'userProfile.detail.userLabel': 'User',
    'userProfile.detail.facilityLabel': 'Facility',
    'userProfile.detail.firstNameLabel': 'First name',
    'userProfile.detail.middleNameLabel': 'Middle name',
    'userProfile.detail.lastNameLabel': 'Last name',
    'userProfile.detail.genderLabel': 'Gender',
    'userProfile.detail.dobLabel': 'Date of birth',
    'userProfile.detail.createdLabel': 'Created',
    'userProfile.detail.updatedLabel': 'Updated',
    'userProfile.detail.errorTitle': 'Failed to load user profile',
    'userProfile.detail.notFoundTitle': 'User profile not found',
    'userProfile.detail.notFoundMessage': 'This user profile may have been deleted.',
    'userProfile.detail.backHint': 'Return to user profiles list',
    'userProfile.detail.delete': 'Delete user profile',
    'userProfile.detail.deleteHint': 'Delete this user profile',
    'userProfile.detail.edit': 'Edit user profile',
    'userProfile.detail.editHint': 'Edit this user profile',
    'common.loading': 'Loading',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'common.back': 'Back',
    'common.remove': 'Remove',
    'shell.banners.offline.title': 'Offline',
    'shell.banners.offline.message': 'No connection',
  };
  return dictionary[key] || key;
};

const baseHook = {
  id: 'profile-1',
  profile: null,
  profileDisplayName: 'Jane Doe',
  profileUserDisplay: 'jane@acme.org',
  profileFacilityDisplay: 'Main Facility',
  profileGenderDisplay: 'Female',
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  canViewTechnicalIds: false,
  onRetry: jest.fn(),
  onBack: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('UserProfileDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en-US' });
    useUserProfileDetailScreen.mockReturnValue({ ...baseHook });
  });

  it('renders base states across platforms', () => {
    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-not-found')).toBeTruthy();
    expect(renderWithTheme(<UserProfileDetailScreenAndroid />).getByTestId('user-profile-detail-not-found')).toBeTruthy();
    expect(renderWithTheme(<UserProfileDetailScreenIOS />).getByTestId('user-profile-detail-not-found')).toBeTruthy();
  });

  it('shows loading/error/offline states on web', () => {
    useUserProfileDetailScreen.mockReturnValue({ ...baseHook, isLoading: true });
    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-loading')).toBeTruthy();

    useUserProfileDetailScreen.mockReturnValue({ ...baseHook, hasError: true, errorMessage: 'failed' });
    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-error')).toBeTruthy();

    useUserProfileDetailScreen.mockReturnValue({ ...baseHook, isOffline: true });
    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-offline')).toBeTruthy();
  });

  it('renders human-readable context by default and hides technical ID', () => {
    useUserProfileDetailScreen.mockReturnValue({
      ...baseHook,
      profile: {
        id: 'profile-1',
        first_name: 'Jane',
        last_name: 'Doe',
        date_of_birth: '1990-01-01',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      canViewTechnicalIds: false,
    });

    const { getByTestId, queryByTestId } = renderWithTheme(<UserProfileDetailScreenWeb />);
    expect(getByTestId('user-profile-detail-profile-name')).toBeTruthy();
    expect(getByTestId('user-profile-detail-user')).toBeTruthy();
    expect(getByTestId('user-profile-detail-facility')).toBeTruthy();
    expect(queryByTestId('user-profile-detail-id')).toBeNull();
  });

  it('shows technical ID for privileged users', () => {
    useUserProfileDetailScreen.mockReturnValue({
      ...baseHook,
      canViewTechnicalIds: true,
      profile: { id: 'profile-1', first_name: 'Jane', created_at: '2025-01-01T00:00:00Z' },
    });

    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-id')).toBeTruthy();
  });

  it('shows inline banners when data exists but state is degraded', () => {
    useUserProfileDetailScreen.mockReturnValue({
      ...baseHook,
      profile: { id: 'profile-1', first_name: 'Jane', created_at: '2025-01-01T00:00:00Z' },
      hasError: true,
      errorMessage: 'failed',
    });
    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-error-banner')).toBeTruthy();

    useUserProfileDetailScreen.mockReturnValue({
      ...baseHook,
      profile: { id: 'profile-1', first_name: 'Jane', created_at: '2025-01-01T00:00:00Z' },
      isOffline: true,
    });
    expect(renderWithTheme(<UserProfileDetailScreenWeb />).getByTestId('user-profile-detail-offline-banner')).toBeTruthy();
  });

  it('exports component and hook from index', () => {
    expect(UserProfileDetailScreenIndex.default).toBeDefined();
    expect(UserProfileDetailScreenIndex.useUserProfileDetailScreen).toBeDefined();
  });
});
