const React = require('react');
const { fireEvent, render, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseAuth = jest.fn();
const mockCreateInvoice = jest.fn();
const mockCreatePayment = jest.fn();
const mockCreateSubscriptionInvoice = jest.fn();
const mockListSubscriptionInvoices = jest.fn();
const mockListSubscriptionPlans = jest.fn();
const mockUpdateInvoice = jest.fn();
const mockUpdateSubscription = jest.fn();
const mockMergeOnboardingContext = jest.fn();
const mockReadOnboardingProgress = jest.fn();
const mockReadRegistrationContext = jest.fn();
const mockSaveAuthResumeContext = jest.fn();
const mockSaveOnboardingStep = jest.fn();
const mockTranslate = (key) => key;

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: mockTranslate }),
  useAuth: () => mockUseAuth(),
}));

jest.mock('@features/invoice', () => ({
  createInvoice: (...args) => mockCreateInvoice(...args),
  updateInvoice: (...args) => mockUpdateInvoice(...args),
}));

jest.mock('@features/payment', () => ({
  createPayment: (...args) => mockCreatePayment(...args),
}));

jest.mock('@features/subscription-invoice', () => ({
  createSubscriptionInvoice: (...args) => mockCreateSubscriptionInvoice(...args),
  listSubscriptionInvoices: (...args) => mockListSubscriptionInvoices(...args),
}));

jest.mock('@features/subscription-plan', () => ({
  listSubscriptionPlans: (...args) => mockListSubscriptionPlans(...args),
}));

jest.mock('@features/subscription', () => ({
  updateSubscription: (...args) => mockUpdateSubscription(...args),
}));

jest.mock('@navigation', () => ({
  mergeOnboardingContext: (...args) => mockMergeOnboardingContext(...args),
  readOnboardingProgress: (...args) => mockReadOnboardingProgress(...args),
  readRegistrationContext: (...args) => mockReadRegistrationContext(...args),
  saveAuthResumeContext: (...args) => mockSaveAuthResumeContext(...args),
  saveOnboardingStep: (...args) => mockSaveOnboardingStep(...args),
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

describe('Onboarding Payment Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        email: 'owner@example.com',
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
      },
    });
    mockReadRegistrationContext.mockResolvedValue({
      email: 'owner@example.com',
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
    });
    mockReadOnboardingProgress.mockResolvedValue({
      context: {
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
        subscription_id: 'sub-1',
        subscription_plan_id: 'plan-1',
        billing_cycle: 'MONTHLY',
        payment_amount: '25.00',
        payment_currency: 'USD',
      },
    });
    mockSaveAuthResumeContext.mockResolvedValue(true);
    mockSaveOnboardingStep.mockResolvedValue(true);
    mockMergeOnboardingContext.mockResolvedValue(true);
    mockListSubscriptionPlans.mockResolvedValue([
      { id: 'plan-1', price: 25 },
    ]);
    mockCreateInvoice.mockResolvedValue({ id: 'inv-1' });
    mockListSubscriptionInvoices.mockResolvedValue([{ id: 'link-1', subscription_id: 'sub-1', invoice_id: 'inv-1' }]);
    mockCreateSubscriptionInvoice.mockResolvedValue({ id: 'link-1' });
    mockCreatePayment.mockResolvedValue({ id: 'pay-1' });
    mockUpdateInvoice.mockResolvedValue({ id: 'inv-1' });
    mockUpdateSubscription.mockResolvedValue({ id: 'sub-1', status: 'ACTIVE' });
  });

  test('persists invoice id for recovery when checkout fails after invoice creation', async () => {
    mockListSubscriptionInvoices.mockRejectedValue(new Error('LINK_FAILED'));

    const Route = require('../../app/(onboarding)/payment').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-payment-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-payment-pay'));

    await waitFor(() => {
      expect(mockCreateInvoice).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockMergeOnboardingContext).toHaveBeenCalledWith(expect.objectContaining({
        invoice_id: 'inv-1',
        payment_method: 'MOBILE_MONEY',
      }));
    });
    await waitFor(() => {
      expect(getByTestId('onboarding-payment-error')).toBeTruthy();
    });
    expect(mockReplace).not.toHaveBeenCalledWith('/payment-success');
  });

  test('reuses existing payment context and avoids duplicate payment creation', async () => {
    mockReadOnboardingProgress.mockResolvedValue({
      context: {
        tenant_id: 'tenant-1',
        facility_id: 'facility-1',
        subscription_id: 'sub-1',
        subscription_plan_id: 'plan-1',
        invoice_id: 'inv-1',
        payment_id: 'pay-1',
        billing_cycle: 'MONTHLY',
        payment_amount: '25.00',
        payment_currency: 'USD',
      },
    });

    const Route = require('../../app/(onboarding)/payment').default;
    const { getByTestId } = render(React.createElement(Route));

    await waitFor(() => {
      expect(getByTestId('onboarding-payment-screen')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-payment-pay'));

    await waitFor(() => {
      expect(mockUpdateSubscription).toHaveBeenCalledWith('sub-1', { status: 'ACTIVE' });
    });
    expect(mockCreatePayment).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/payment-success');
  });
});
