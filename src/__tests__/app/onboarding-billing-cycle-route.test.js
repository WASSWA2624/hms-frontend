const React = require('react');
const { fireEvent, render, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseAuth = jest.fn();
const mockReadOnboardingProgress = jest.fn();
const mockReadRegistrationContext = jest.fn();
const mockSaveAuthResumeContext = jest.fn();
const mockSaveOnboardingStep = jest.fn();
const mockMergeOnboardingContext = jest.fn();
const mockListSubscriptionPlans = jest.fn();
const mockUpdateSubscription = jest.fn();
const mockTranslate = (key) => key;

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: mockTranslate }),
  useAuth: () => mockUseAuth(),
}));

jest.mock('@features/subscription-plan', () => ({
  listSubscriptionPlans: (...args) => mockListSubscriptionPlans(...args),
}));

jest.mock('@features/subscription', () => ({
  updateSubscription: (...args) => mockUpdateSubscription(...args),
}));

jest.mock('@navigation', () => ({
  readOnboardingProgress: (...args) => mockReadOnboardingProgress(...args),
  readRegistrationContext: (...args) => mockReadRegistrationContext(...args),
  saveAuthResumeContext: (...args) => mockSaveAuthResumeContext(...args),
  saveOnboardingStep: (...args) => mockSaveOnboardingStep(...args),
  mergeOnboardingContext: (...args) => mockMergeOnboardingContext(...args),
}));

jest.mock('../../app/shared/withRouteTermsAcceptance', () => ({
  __esModule: true,
  default: (Component) => Component,
}));

jest.mock('@platform/components', () => {
  const ReactLocal = require('react');
  const { Pressable, Text: RNText, View } = require('react-native');

  const Wrapper = ({ children, testID }) => <View testID={testID}>{children}</View>;

  return {
    Button: ({ children, onPress, testID, disabled }) => (
      <Pressable testID={testID} onPress={onPress} disabled={disabled}>
        {typeof children === 'string' ? <RNText>{children}</RNText> : children}
      </Pressable>
    ),
    Card: Wrapper,
    Container: Wrapper,
    ErrorState: ({ title, description, testID }) => (
      <View testID={testID}>
        <RNText>{title}</RNText>
        <RNText>{description}</RNText>
      </View>
    ),
    ErrorStateSizes: { SMALL: 'small' },
    LoadingSpinner: ({ testID }) => <View testID={testID || 'loading-spinner'} />,
    Stack: Wrapper,
    Text: ({ children, testID }) => <RNText testID={testID}>{children}</RNText>,
  };
});

describe('Onboarding Billing Cycle Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'owner@example.com' },
    });
    mockReadRegistrationContext.mockResolvedValue({
      email: 'owner@example.com',
    });
    mockReadOnboardingProgress.mockResolvedValue({
      context: {
        billing_cycle: 'MONTHLY',
        subscription_plan_id: 'plan-monthly',
        subscription_id: 'sub-1',
      },
    });
    mockSaveAuthResumeContext.mockResolvedValue(true);
    mockSaveOnboardingStep.mockResolvedValue(true);
    mockMergeOnboardingContext.mockResolvedValue(true);
    mockListSubscriptionPlans.mockResolvedValue([
      { id: 'plan-monthly', name: 'Starter', billing_cycle: 'MONTHLY' },
      { id: 'plan-yearly', name: 'Starter', billing_cycle: 'YEARLY' },
    ]);
    mockUpdateSubscription.mockResolvedValue({ id: 'sub-1' });
  });

  test('blocks continue when no plan is selected in progress context', async () => {
    mockReadOnboardingProgress.mockResolvedValue({
      context: {
        billing_cycle: 'MONTHLY',
        subscription_plan_id: '',
        subscription_id: 'sub-1',
      },
    });

    const Route = require('../../app/(onboarding)/billing-cycle').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-billing-cycle-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-billing-cycle-continue'));

    await waitFor(() => {
      expect(getByTestId('onboarding-billing-cycle-error')).toBeTruthy();
    });
    expect(mockPush).not.toHaveBeenCalledWith('/payment');
    expect(mockUpdateSubscription).not.toHaveBeenCalled();
  });

  test('blocks continue when subscription context is missing', async () => {
    mockReadOnboardingProgress.mockResolvedValue({
      context: {
        billing_cycle: 'MONTHLY',
        subscription_plan_id: 'plan-monthly',
        subscription_id: '',
      },
    });

    const Route = require('../../app/(onboarding)/billing-cycle').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-billing-cycle-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-billing-cycle-continue'));

    await waitFor(() => {
      expect(getByTestId('onboarding-billing-cycle-error')).toBeTruthy();
    });
    expect(mockPush).not.toHaveBeenCalledWith('/payment');
    expect(mockUpdateSubscription).not.toHaveBeenCalled();
  });

  test('updates subscription plan and proceeds to payment for selected cycle', async () => {
    const Route = require('../../app/(onboarding)/billing-cycle').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-billing-cycle-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-billing-cycle-select-yearly'));
    fireEvent.press(getByTestId('onboarding-billing-cycle-continue'));

    await waitFor(() => {
      expect(mockUpdateSubscription).toHaveBeenCalledWith('sub-1', { plan_id: 'plan-yearly' });
    });
    expect(mockMergeOnboardingContext).toHaveBeenCalledWith({
      billing_cycle: 'YEARLY',
      subscription_plan_id: 'plan-yearly',
      subscription_id: 'sub-1',
    });
    expect(mockSaveOnboardingStep).toHaveBeenCalledWith('payment', {
      billing_cycle: 'YEARLY',
      subscription_plan_id: 'plan-yearly',
      subscription_id: 'sub-1',
    });
    expect(mockPush).toHaveBeenCalledWith('/payment');
  });
});
