/**
 * Auth Use Case Tests
 * File: auth.usecase.test.js
 */
import {
  changePasswordUseCase,
  forgotPasswordUseCase,
  identifyUseCase,
  loadCurrentUserUseCase,
  loginUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  registerUseCase,
  resendVerificationUseCase,
  resetPasswordUseCase,
  verifyEmailUseCase,
  verifyPhoneUseCase,
} from '@features/auth';
import { tokenManager } from '@security';
import { clearCsrfToken } from '@services/csrf';
import {
  changePasswordApi,
  forgotPasswordApi,
  getCurrentUserApi,
  identifyApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  resendVerificationApi,
  resetPasswordApi,
  verifyEmailApi,
  verifyPhoneApi,
} from '@features/auth/auth.api';

jest.mock('@features/auth/auth.api', () => ({
  identifyApi: jest.fn(),
  loginApi: jest.fn(),
  logoutApi: jest.fn(),
  refreshApi: jest.fn(),
  registerApi: jest.fn(),
  getCurrentUserApi: jest.fn(),
  verifyEmailApi: jest.fn(),
  verifyPhoneApi: jest.fn(),
  resendVerificationApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  changePasswordApi: jest.fn(),
}));

jest.mock('@security', () => ({
  tokenManager: {
    setTokens: jest.fn(),
    clearTokens: jest.fn(),
    getRefreshToken: jest.fn(),
    shouldPersistTokens: jest.fn(),
  },
}));

jest.mock('@services/csrf', () => ({
  clearCsrfToken: jest.fn(),
}));

describe('auth.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    identifyApi.mockResolvedValue({ data: { users: [{ id: '1' }] } });
    loginApi.mockResolvedValue({ data: { user: { id: '1' }, tokens: { accessToken: 'a', refreshToken: 'b' } } });
    registerApi.mockResolvedValue({ data: { user: { id: '2' } } });
    logoutApi.mockResolvedValue({ data: {} });
    refreshApi.mockResolvedValue({ data: { tokens: { accessToken: 'a', refreshToken: 'b' } } });
    getCurrentUserApi.mockResolvedValue({ data: { user: { id: '3' } } });
    verifyEmailApi.mockResolvedValue({ data: { ok: true } });
    verifyPhoneApi.mockResolvedValue({ data: { ok: true } });
    resendVerificationApi.mockResolvedValue({ data: { ok: true } });
    forgotPasswordApi.mockResolvedValue({ data: { ok: true } });
    resetPasswordApi.mockResolvedValue({ data: { ok: true } });
    changePasswordApi.mockResolvedValue({ data: { ok: true } });
    tokenManager.setTokens.mockResolvedValue(true);
    tokenManager.clearTokens.mockResolvedValue(true);
    tokenManager.getRefreshToken.mockResolvedValue('refresh');
    tokenManager.shouldPersistTokens.mockResolvedValue(true);
  });

  it('identifies users and falls back to empty users array', async () => {
    await expect(identifyUseCase({})).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });

    const identified = await identifyUseCase({ identifier: 'user@example.com' });
    expect(identified).toEqual({ users: [{ id: '1' }] });
    expect(identifyApi).toHaveBeenCalledWith({ identifier: 'user@example.com' });

    identifyApi.mockResolvedValueOnce({ data: { data: { hint: 'no-users' } } });
    await expect(identifyUseCase({ identifier: 'user@example.com' })).resolves.toEqual({ users: [] });
  });

  it('logs in and stores tokens', async () => {
    const user = await loginUseCase({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000'
    });
    expect(user).toEqual({ id: '1' });
    expect(tokenManager.setTokens).toHaveBeenCalledWith('a', 'b', { persist: false });
  });

  it('returns facility selection payload when required', async () => {
    loginApi.mockResolvedValueOnce({
      data: {
        requires_facility_selection: true,
        facilities: [{ id: 'f1' }],
        tenant_id: 'tenant-1',
      },
    });

    await expect(
      loginUseCase({ email: 'user@example.com', password: 'pass' })
    ).resolves.toEqual({
      requiresFacilitySelection: true,
      facilities: [{ id: 'f1' }],
      tenantId: 'tenant-1',
      identifier: 'user@example.com',
      password: 'pass',
    });
    expect(tokenManager.setTokens).not.toHaveBeenCalled();
  });

  it('uses phone identifier and empty facilities fallback for facility selection', async () => {
    loginApi.mockResolvedValueOnce({
      data: {
        requires_facility_selection: true,
        tenant_id: 'tenant-2',
      },
    });

    await expect(
      loginUseCase({ phone: '256701234567', password: 'pass' })
    ).resolves.toEqual({
      requiresFacilitySelection: true,
      facilities: [],
      tenantId: 'tenant-2',
      identifier: '256701234567',
      password: 'pass',
    });
  });

  it('supports remember session and rejects invalid login response', async () => {
    await loginUseCase({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      remember_me: true,
    });
    expect(tokenManager.setTokens).toHaveBeenCalledWith('a', 'b', { persist: true });

    loginApi.mockResolvedValueOnce({ data: null });
    await expect(
      loginUseCase({
        email: 'user@example.com',
        password: 'pass',
        tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });

    loginApi.mockResolvedValueOnce({
      data: {
        user: { id: 'no-token-user' },
        tokens: { accessToken: 'only-access' },
      },
    });
    await expect(
      loginUseCase({
        email: 'user@example.com',
        password: 'pass',
        tenant_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).resolves.toEqual({ id: 'no-token-user' });
  });

  it('registers without auto-authenticating when no tokens are returned', async () => {
    const result = await registerUseCase({ email: 'user' });
    expect(result).toEqual({ user: { id: '2' }, hasSession: false, verification: null });
    const current = await loadCurrentUserUseCase();
    expect(current).toEqual({ id: '3' });
  });

  it('registers and persists session tokens when returned', async () => {
    registerApi.mockResolvedValueOnce({
      data: {
        data: {
          user: { id: '20' },
          tokens: { accessToken: 'ra', refreshToken: 'rb' },
          verification: { channel: 'email' },
        },
      },
    });

    await expect(registerUseCase({ email: 'user' })).resolves.toEqual({
      user: { id: '20' },
      hasSession: true,
      verification: { channel: 'email' },
    });
    expect(tokenManager.setTokens).toHaveBeenCalledWith('ra', 'rb');
  });

  it('refreshes session and logs out', async () => {
    const tokens = await refreshSessionUseCase();
    expect(tokens).toEqual({ accessToken: 'a', refreshToken: 'b' });
    expect(tokenManager.setTokens).toHaveBeenCalledWith('a', 'b', { persist: true });
    await logoutUseCase();
    expect(logoutApi).toHaveBeenCalledWith({ refresh_token: 'refresh' });
    expect(tokenManager.clearTokens).toHaveBeenCalled();
    expect(clearCsrfToken).toHaveBeenCalled();
  });

  it('supports refresh fallback and resilient logout cleanup', async () => {
    tokenManager.shouldPersistTokens.mockResolvedValueOnce(false);
    await refreshSessionUseCase();
    expect(tokenManager.setTokens).toHaveBeenCalledWith('a', 'b', { persist: false });

    refreshApi.mockResolvedValueOnce({ data: { data: {} } });
    await expect(refreshSessionUseCase()).resolves.toBeNull();

    tokenManager.getRefreshToken.mockResolvedValueOnce(null);
    await logoutUseCase();
    expect(logoutApi).toHaveBeenCalledWith(undefined);

    logoutApi.mockRejectedValueOnce(new Error('network down'));
    await expect(logoutUseCase()).resolves.toBe(true);
    expect(tokenManager.clearTokens).toHaveBeenCalled();
    expect(clearCsrfToken).toHaveBeenCalled();
  });

  it('executes verification and password recovery use cases', async () => {
    await expect(verifyEmailUseCase({ token: 't' })).resolves.toEqual({ ok: true });
    await expect(verifyPhoneUseCase({ token: 't' })).resolves.toEqual({ ok: true });
    await expect(resendVerificationUseCase({ email: 'u@example.com' })).resolves.toEqual({ ok: true });
    await expect(forgotPasswordUseCase({ email: 'u@example.com' })).resolves.toEqual({ ok: true });
    await expect(resetPasswordUseCase({ token: 't' })).resolves.toEqual({ ok: true });
    await expect(changePasswordUseCase({ currentPassword: 'old', newPassword: 'new' })).resolves.toEqual({ ok: true });

    verifyEmailApi.mockResolvedValueOnce({ data: null });
    await expect(verifyEmailUseCase({ token: 't' })).resolves.toBeNull();

    verifyPhoneApi.mockResolvedValueOnce({ data: null });
    resendVerificationApi.mockResolvedValueOnce({ data: null });
    forgotPasswordApi.mockResolvedValueOnce({ data: null });
    resetPasswordApi.mockResolvedValueOnce({ data: null });
    changePasswordApi.mockResolvedValueOnce({ data: null });
    await expect(verifyPhoneUseCase({ token: 't' })).resolves.toBeNull();
    await expect(resendVerificationUseCase({ email: 'u@example.com' })).resolves.toBeNull();
    await expect(forgotPasswordUseCase({ email: 'u@example.com' })).resolves.toBeNull();
    await expect(resetPasswordUseCase({ token: 't' })).resolves.toBeNull();
    await expect(changePasswordUseCase({ currentPassword: 'old', newPassword: 'new' })).resolves.toBeNull();
  });

  it('throws normalized errors', async () => {
    loginApi.mockRejectedValueOnce({ code: 'UNAUTHORIZED' });
    await expect(loginUseCase({
      email: 'user@example.com',
      password: 'pass',
      tenant_id: '550e8400-e29b-41d4-a716-446655440000'
    })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });
});
