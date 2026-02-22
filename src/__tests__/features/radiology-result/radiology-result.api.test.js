/**
 * Radiology Result API Tests
 * File: radiology-result.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { radiologyResultApi } from '@features/radiology-result/radiology-result.api';

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

describe('radiology-result.api', () => {
  it('creates crud api with radiology result endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.RADIOLOGY_RESULTS);
    expect(radiologyResultApi).toBeDefined();
  });

  it('posts radiology result sign-off action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'FINAL' } });
    await radiologyResultApi.signOff('1', { notes: 'Signed off by radiologist' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_RESULTS.SIGN_OFF('1'),
      method: 'POST',
      body: { notes: 'Signed off by radiologist' },
    });
  });

  it('posts radiology result sign-off action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'FINAL' } });
    await radiologyResultApi.signOff('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_RESULTS.SIGN_OFF('1'),
      method: 'POST',
      body: {},
    });
  });
});
