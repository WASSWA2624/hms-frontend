/**
 * User Session API Tests
 * File: user-session.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import {
  listUserSessionsApi,
  getUserSessionApi,
  deleteUserSessionApi,
} from '@features/user-session/user-session.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('user-session.api', () => {
  it('lists user sessions with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await listUserSessionsApi({ page: 1 });
    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.USER_SESSIONS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets a user session', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await getUserSessionApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.USER_SESSIONS.GET('1'),
      method: 'GET',
    });
  });

  it('deletes a user session', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await deleteUserSessionApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.USER_SESSIONS.DELETE('1'),
      method: 'DELETE',
    });
  });
});
