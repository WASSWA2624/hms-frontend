/**
 * UserProfileFormScreen Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/settings/UserProfileFormScreen/useUserProfileFormScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useUserProfileFormScreen = require('@platform/screens/settings/UserProfileFormScreen/useUserProfileFormScreen').default;
const UserProfileFormScreenWeb = require('@platform/screens/settings/UserProfileFormScreen/UserProfileFormScreen.web').default;
const UserProfileFormScreenAndroid = require('@platform/screens/settings/UserProfileFormScreen/UserProfileFormScreen.android').default;
const UserProfileFormScreenIOS = require('@platform/screens/settings/UserProfileFormScreen/UserProfileFormScreen.ios').default;
const UserProfileFormScreenIndex = require('@platform/screens/settings/UserProfileFormScreen/index.js');

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

const mockT = (key) => {
  const dictionary = {
    'userProfile.form.createTitle': 'Add User Profile',
    'userProfile.form.editTitle': 'Edit User Profile',
    'userProfile.form.loadError': 'Failed to load user profile for editing',
    'userProfile.form.submitErrorTitle': 'Unable to save user profile',
    'userProfile.form.cancel': 'Cancel',
    'userProfile.form.cancelHint': 'Return without saving',
    'userProfile.form.submitCreate': 'Create Profile',
    'userProfile.form.submitEdit': 'Save Changes',
    'userProfile.form.blockedMessage': 'Create a user to continue.',
    'userProfile.form.userLabel': 'User',
    'userProfile.form.userHint': 'Required for new profiles',
    'userProfile.form.userPlaceholder': 'Select user',
    'userProfile.form.userLockedHint': 'User cannot be changed after creation',
    'userProfile.form.userLoadErrorTitle': 'Unable to load users',
    'userProfile.form.noUsersMessage': 'No users are available yet.',
    'userProfile.form.createUserFirst': 'Create a user first to add profiles.',
    'userProfile.form.goToUsers': 'Go to users',
    'userProfile.form.goToUsersHint': 'Open user settings',
    'userProfile.form.facilityLabel': 'Facility',
    'userProfile.form.facilityHint': 'Optional facility assignment',
    'userProfile.form.facilityPlaceholder': 'Select facility',
    'userProfile.form.facilityLoadErrorTitle': 'Unable to load facilities',
    'userProfile.form.noFacilitiesMessage': 'No facilities are available yet.',
    'userProfile.form.goToFacilities': 'Go to facilities',
    'userProfile.form.goToFacilitiesHint': 'Open facility settings',
    'userProfile.form.firstNameLabel': 'First name',
    'userProfile.form.firstNameHint': 'Required',
    'userProfile.form.firstNamePlaceholder': 'e.g. Jane',
    'userProfile.form.middleNameLabel': 'Middle name',
    'userProfile.form.middleNameHint': 'Optional',
    'userProfile.form.middleNamePlaceholder': 'Optional',
    'userProfile.form.lastNameLabel': 'Last name',
    'userProfile.form.lastNameHint': 'Optional',
    'userProfile.form.lastNamePlaceholder': 'Optional',
    'userProfile.form.genderLabel': 'Gender',
    'userProfile.form.genderHint': 'Optional',
    'userProfile.form.genderPlaceholder': 'Select gender',
    'userProfile.form.dobLabel': 'Date of birth',
    'userProfile.form.dobHint': 'Optional',
    'userProfile.form.dobPlaceholder': 'YYYY-MM-DD',
    'common.loading': 'Loading',
    'common.back': 'Back',
    'common.retry': 'Retry',
    'common.retryHint': 'Try again',
    'shell.banners.offline.title': 'Offline',
    'shell.banners.offline.message': 'No connection',
  };
  return dictionary[key] || key;
};

const baseHook = {
  isEdit: false,
  userId: '',
  userDisplayLabel: 'user@acme.org',
  setUserId: jest.fn(),
  facilityId: '',
  setFacilityId: jest.fn(),
  firstName: '',
  setFirstName: jest.fn(),
  middleName: '',
  setMiddleName: jest.fn(),
  lastName: '',
  setLastName: jest.fn(),
  gender: '',
  setGender: jest.fn(),
  genderOptions: [{ value: 'FEMALE', label: 'Female' }],
  dateOfBirth: '',
  setDateOfBirth: jest.fn(),
  userOptions: [{ value: 'u-1', label: 'user@acme.org' }],
  userListLoading: false,
  userListError: false,
  userErrorMessage: null,
  facilityOptions: [{ value: 'f-1', label: 'Main Facility' }],
  facilityListLoading: false,
  facilityListError: false,
  facilityErrorMessage: null,
  hasUsers: true,
  hasFacilities: true,
  isCreateBlocked: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isOffline: false,
  profile: null,
  userError: null,
  firstNameError: null,
  middleNameError: null,
  lastNameError: null,
  dateOfBirthError: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  onGoToUsers: jest.fn(),
  onGoToFacilities: jest.fn(),
  onRetryUsers: jest.fn(),
  onRetryFacilities: jest.fn(),
  isSubmitDisabled: false,
};

describe('UserProfileFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useUserProfileFormScreen.mockReturnValue({ ...baseHook });
  });

  it('renders web/android/ios variants', () => {
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-card')).toBeTruthy();
    expect(renderWithTheme(<UserProfileFormScreenAndroid />).getByTestId('user-profile-form-card')).toBeTruthy();
    expect(renderWithTheme(<UserProfileFormScreenIOS />).getByTestId('user-profile-form-card')).toBeTruthy();
  });

  it('shows loading and load-error states in edit mode', () => {
    useUserProfileFormScreen.mockReturnValue({ ...baseHook, isEdit: true, isLoading: true, profile: null });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-loading')).toBeTruthy();

    useUserProfileFormScreen.mockReturnValue({ ...baseHook, isEdit: true, hasError: true, profile: null });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-load-error')).toBeTruthy();
  });

  it('shows inline offline and submit-error states', () => {
    useUserProfileFormScreen.mockReturnValue({ ...baseHook, isOffline: true });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-offline')).toBeTruthy();

    useUserProfileFormScreen.mockReturnValue({
      ...baseHook,
      hasError: true,
      errorMessage: 'submit failed',
      profile: { id: 'profile-1', user_id: 'u-1' },
      isEdit: true,
    });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-submit-error')).toBeTruthy();
  });

  it('shows user and facility load errors', () => {
    useUserProfileFormScreen.mockReturnValue({
      ...baseHook,
      userListError: true,
      userErrorMessage: 'user load failed',
    });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-user-error')).toBeTruthy();

    useUserProfileFormScreen.mockReturnValue({
      ...baseHook,
      facilityListError: true,
      facilityErrorMessage: 'facility load failed',
    });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-facility-error')).toBeTruthy();
  });

  it('calls submit and cancel handlers', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    useUserProfileFormScreen.mockReturnValue({ ...baseHook, onSubmit, onCancel });

    const screen = renderWithTheme(<UserProfileFormScreenWeb />);
    fireEvent.press(screen.getByTestId('user-profile-form-submit'));
    fireEvent.press(screen.getByTestId('user-profile-form-cancel'));
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders readonly user display in edit mode', () => {
    useUserProfileFormScreen.mockReturnValue({
      ...baseHook,
      isEdit: true,
      profile: { id: 'profile-1', user_id: 'u-1' },
      userDisplayLabel: 'jane@acme.org',
    });
    expect(renderWithTheme(<UserProfileFormScreenWeb />).getByTestId('user-profile-form-user-readonly')).toBeTruthy();
  });

  it('exports component and hook from index', () => {
    expect(UserProfileFormScreenIndex.default).toBeDefined();
    expect(UserProfileFormScreenIndex.useUserProfileFormScreen).toBeDefined();
  });
});
