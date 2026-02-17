/**
 * Terms Acceptance API Tests
 * File: terms-acceptance.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { termsAcceptanceApi } from '@features/terms-acceptance/terms-acceptance.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('terms-acceptance.api', () => {
  it('lists terms acceptances with default params', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await termsAcceptanceApi.list();
    expect(buildQueryString).toHaveBeenCalledWith({});
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.TERMS_ACCEPTANCES.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('lists terms acceptances with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await termsAcceptanceApi.list({ page: 1 });
    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.TERMS_ACCEPTANCES.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets a terms acceptance item', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await termsAcceptanceApi.get('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.TERMS_ACCEPTANCES.GET('1'),
      method: 'GET',
    });
  });

  it('creates a terms acceptance item', async () => {
    const payload = { version_label: 'v1' };
    apiClient.mockResolvedValue({ data: payload });
    await termsAcceptanceApi.create(payload);
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.TERMS_ACCEPTANCES.CREATE,
      method: 'POST',
      body: payload,
    });
  });

  it('deletes a terms acceptance item', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await termsAcceptanceApi.remove('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.TERMS_ACCEPTANCES.DELETE('1'),
      method: 'DELETE',
    });
  });
});
