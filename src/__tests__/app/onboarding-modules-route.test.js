const React = require('react');
const { render, waitFor, fireEvent } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseAuth = jest.fn();
const mockReadRegistrationContext = jest.fn();
const mockReadOnboardingProgress = jest.fn();
const mockReadOnboardingEntry = jest.fn();
const mockSaveOnboardingStep = jest.fn();
const mockMergeOnboardingContext = jest.fn();
const mockSaveAuthResumeContext = jest.fn();
const mockListModules = jest.fn();
const mockListSubscriptions = jest.fn();
const mockListModuleSubscriptions = jest.fn();
const mockCreateModuleSubscription = jest.fn();
const mockUpdateModuleSubscription = jest.fn();
const mockTranslate = (key) => key;

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: mockTranslate }),
  useAuth: () => mockUseAuth(),
}));

jest.mock('@features', () => ({
  listModules: (...args) => mockListModules(...args),
  listSubscriptions: (...args) => mockListSubscriptions(...args),
  listModuleSubscriptions: (...args) => mockListModuleSubscriptions(...args),
  createModuleSubscription: (...args) => mockCreateModuleSubscription(...args),
  updateModuleSubscription: (...args) => mockUpdateModuleSubscription(...args),
}));

jest.mock('@navigation', () => ({
  readRegistrationContext: (...args) => mockReadRegistrationContext(...args),
  readOnboardingProgress: (...args) => mockReadOnboardingProgress(...args),
  readOnboardingEntry: (...args) => mockReadOnboardingEntry(...args),
  saveOnboardingStep: (...args) => mockSaveOnboardingStep(...args),
  mergeOnboardingContext: (...args) => mockMergeOnboardingContext(...args),
  saveAuthResumeContext: (...args) => mockSaveAuthResumeContext(...args),
}));

jest.mock('@platform/components', () => {
  const ReactLocal = require('react');
  const { View, Text: RNText, Pressable } = require('react-native');

  const Wrapper = ({ children, testID }) => <View testID={testID}>{children}</View>;

  return {
    Button: ({ children, onPress, testID, disabled }) => (
      <Pressable testID={testID} onPress={onPress} disabled={disabled}>
        {typeof children === 'string' ? <RNText>{children}</RNText> : children}
      </Pressable>
    ),
    Card: Wrapper,
    Container: Wrapper,
    EmptyState: Wrapper,
    EmptyStateSizes: { SMALL: 'small' },
    ErrorState: Wrapper,
    ErrorStateSizes: { SMALL: 'small' },
    LoadingSpinner: ({ testID }) => <View testID={testID || 'loading-spinner'} />,
    Stack: Wrapper,
    Text: ({ children, testID }) => <RNText testID={testID}>{children}</RNText>,
  };
});

describe('Onboarding Modules Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    mockReadRegistrationContext.mockResolvedValue({
      email: 'owner@example.com',
      facility_type: 'CLINIC',
    });
    mockReadOnboardingProgress.mockResolvedValue({
      context: {
        email: 'owner@example.com',
        facility_type: 'CLINIC',
        selected_module_ids: [],
      },
    });
    mockReadOnboardingEntry.mockResolvedValue({
      facility_type: 'CLINIC',
    });
    mockSaveOnboardingStep.mockResolvedValue(true);
    mockMergeOnboardingContext.mockResolvedValue(true);
    mockSaveAuthResumeContext.mockResolvedValue(true);
    mockListModules.mockResolvedValue([]);
    mockListSubscriptions.mockResolvedValue([]);
    mockListModuleSubscriptions.mockResolvedValue([]);
    mockCreateModuleSubscription.mockResolvedValue({});
    mockUpdateModuleSubscription.mockResolvedValue({});
  });

  test('saves resume context with onboarding email before opening login', async () => {
    const Route = require('../../app/(onboarding)/modules').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-modules-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-modules-login'));

    await waitFor(() => {
      expect(mockSaveAuthResumeContext).toHaveBeenCalledWith({
        identifier: 'owner@example.com',
        next_path: '/modules',
        params: {},
      });
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('continues to trial in read-only mode when unauthenticated', async () => {
    const Route = require('../../app/(onboarding)/modules').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-modules-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-modules-continue'));

    await waitFor(() => {
      expect(mockSaveOnboardingStep).toHaveBeenCalledWith(
        'trial',
        expect.objectContaining({
          facility_type: 'CLINIC',
        })
      );
    });
    expect(mockPush).toHaveBeenCalledWith('/trial');
  });
});
