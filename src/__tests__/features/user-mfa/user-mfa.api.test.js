/**
 * User MFA API Tests
 * File: user-mfa.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { userMfaApi, verifyUserMfaApi, enableUserMfaApi, disableUserMfaApi } from '@features/user-mfa/user-mfa.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('user-mfa.api', () => {
  it('creates crud api with user mfa endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.USER_MFAS);
    expect(userMfaApi).toBeDefined();
  });

  it('posts mfa verify/enable/disable', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await verifyUserMfaApi('1', { code: '123456' });
    await enableUserMfaApi('1', { enabled: true });
    await disableUserMfaApi('1', { enabled: false });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.USER_MFAS.VERIFY('1'),
      method: 'POST',
      body: { code: '123456' },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.USER_MFAS.ENABLE('1'),
      method: 'POST',
      body: { enabled: true },
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.USER_MFAS.DISABLE('1'),
      method: 'POST',
      body: { enabled: false },
    });
  });
});
