const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockParams = {};

const mockIdentify = jest.fn();
const mockForgotPassword = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: (key, params = {}) => {
      if (typeof params.index === 'number') return `${key} ${params.index}`;
      return key;
    },
  })),
  useAuth: jest.fn(),
}));

jest.mock('@navigation/registrationContext', () => ({
  readRegistrationContext: jest.fn(),
}));

const { useAuth } = require('@hooks');
const { readRegistrationContext } = require('@navigation/registrationContext');
const useForgotPasswordScreen =
  require('@platform/screens/auth/ForgotPasswordScreen/useForgotPasswordScreen').default;

const waitForHydration = async (result) => {
  await waitFor(() => expect(result.current.isHydrating).toBe(false));
};

describe('useForgotPasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    readRegistrationContext.mockResolvedValue(null);
    useAuth.mockReturnValue({
      identify: mockIdentify,
      forgotPassword: mockForgotPassword,
    });
  });

  it('auto-submits forgot-password when exactly one tenant is resolved', async () => {
    mockIdentify.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: {
        users: [
          {
            tenant_id: '11111111-1111-4111-8111-111111111111',
            tenant_name: 'Alpha Health',
            status: 'ACTIVE',
          },
        ],
      },
    });
    mockForgotPassword.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: { message: 'ok' },
    });

    const { result } = renderHook(() => useForgotPasswordScreen());
    await waitForHydration(result);

    act(() => {
      result.current.setFieldValue('email', 'owner@alpha.health');
    });

    let submitResult = false;
    await act(async () => {
      submitResult = await result.current.handleSubmit();
    });

    expect(submitResult).toBe(true);
    expect(mockIdentify).toHaveBeenCalledWith({ identifier: 'owner@alpha.health' });
    expect(mockForgotPassword).toHaveBeenCalledWith({
      email: 'owner@alpha.health',
      tenant_id: '11111111-1111-4111-8111-111111111111',
    });
    expect(result.current.isSubmitted).toBe(true);
  });

  it('requires a readable tenant selection when multiple tenants are found', async () => {
    mockIdentify.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: {
        users: [
          {
            tenant_id: '11111111-1111-4111-8111-111111111111',
            tenant_name: 'Alpha Health',
            status: 'ACTIVE',
          },
          {
            tenant_id: '22222222-2222-4222-8222-222222222222',
            tenant_name: 'Beta Clinic',
            status: 'ACTIVE',
          },
        ],
      },
    });
    mockForgotPassword.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: { message: 'ok' },
    });

    const { result } = renderHook(() => useForgotPasswordScreen());
    await waitForHydration(result);

    act(() => {
      result.current.setFieldValue('email', 'operator@beta.health');
    });

    let firstSubmit = true;
    await act(async () => {
      firstSubmit = await result.current.handleSubmit();
    });

    expect(firstSubmit).toBe(false);
    expect(result.current.tenantOptions).toHaveLength(2);
    expect(result.current.errors.tenant_id).toBe('auth.forgotPassword.validation.tenantRequired');
    expect(mockForgotPassword).not.toHaveBeenCalled();

    act(() => {
      result.current.setFieldValue('tenant_id', '22222222-2222-4222-8222-222222222222');
    });

    let secondSubmit = false;
    await act(async () => {
      secondSubmit = await result.current.handleSubmit();
    });

    expect(secondSubmit).toBe(true);
    expect(mockForgotPassword).toHaveBeenCalledWith({
      email: 'operator@beta.health',
      tenant_id: '22222222-2222-4222-8222-222222222222',
    });
    expect(result.current.isSubmitted).toBe(true);
  });

  it('keeps response generic when no tenant account is found', async () => {
    mockIdentify.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: { users: [] },
    });

    const { result } = renderHook(() => useForgotPasswordScreen());
    await waitForHydration(result);

    act(() => {
      result.current.setFieldValue('email', 'unknown@tenant.com');
    });

    let submitResult = false;
    await act(async () => {
      submitResult = await result.current.handleSubmit();
    });

    expect(submitResult).toBe(true);
    expect(mockForgotPassword).not.toHaveBeenCalled();
    expect(result.current.isSubmitted).toBe(true);
  });

  it('surfaces identify lookup failure before submit', async () => {
    mockIdentify.mockResolvedValue({
      meta: { requestStatus: 'rejected' },
      payload: {
        code: 'NETWORK_ERROR',
        message: 'Network connection error',
      },
    });

    const { result } = renderHook(() => useForgotPasswordScreen());
    await waitForHydration(result);

    act(() => {
      result.current.setFieldValue('email', 'user@example.com');
    });

    let submitResult = true;
    await act(async () => {
      submitResult = await result.current.handleSubmit();
    });

    expect(submitResult).toBe(false);
    expect(mockForgotPassword).not.toHaveBeenCalled();
    expect(result.current.submitError).toEqual({
      code: 'NETWORK_ERROR',
      message: 'Network connection error',
    });
  });
});
