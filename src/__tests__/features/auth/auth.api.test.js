/**
 * Auth API Tests
 * File: auth.api.test.js
 */
import { apiClient } from '@services/api';
import { endpoints } from '@config/endpoints';
import {
  identifyApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  verifyEmailApi,
  verifyPhoneApi,
  resendVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  getCurrentUserApi,
} from '@features/auth';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
}));

describe('auth.api', () => {
  beforeEach(() => {
    apiClient.mockClear();
  });

  it('calls auth endpoints', async () => {
    await identifyApi({ identifier: 'user@example.com' });
    await loginApi({ email: 'user', password: 'pass' });
    await logoutApi();
    await logoutApi({ refresh_token: 'token' });
    await refreshApi({ refresh_token: 'token' });
    await registerApi({ email: 'user' });
    await verifyEmailApi({ token: 't' });
    await verifyPhoneApi({ token: 't' });
    await resendVerificationApi({ email: 'user' });
    await forgotPasswordApi({ email: 'user' });
    await resetPasswordApi({ token: 't' });
    await changePasswordApi({ currentPassword: 'old', newPassword: 'new' });
    await getCurrentUserApi();

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.IDENTIFY,
      method: 'POST',
      body: { identifier: 'user@example.com' },
      skipAuthRefresh: true,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.LOGIN,
      method: 'POST',
      body: { email: 'user', password: 'pass' },
      skipAuthRefresh: true,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.LOGOUT,
      method: 'POST',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.LOGOUT,
      method: 'POST',
      body: { refresh_token: 'token' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.REFRESH,
      method: 'POST',
      body: { refresh_token: 'token' },
      skipAuthRefresh: true,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.REGISTER,
      method: 'POST',
      body: { email: 'user' },
      skipAuthRefresh: true,
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUTH.ME,
      method: 'GET',
    });
  });
});
