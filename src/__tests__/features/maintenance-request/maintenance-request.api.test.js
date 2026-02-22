/**
 * Maintenance Request API Tests
 * File: maintenance-request.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { maintenanceRequestApi } from '@features/maintenance-request/maintenance-request.api';

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

describe('maintenance-request.api', () => {
  it('creates crud api with maintenance request endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.MAINTENANCE_REQUESTS);
    expect(maintenanceRequestApi).toBeDefined();
  });

  it('posts maintenance request triage action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'IN_PROGRESS' } });
    await maintenanceRequestApi.triage('1', { assigned_engineer: 'eng-1' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.MAINTENANCE_REQUESTS.TRIAGE('1'),
      method: 'POST',
      body: { assigned_engineer: 'eng-1' },
    });
  });

  it('posts maintenance request triage action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'IN_PROGRESS' } });
    await maintenanceRequestApi.triage('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.MAINTENANCE_REQUESTS.TRIAGE('1'),
      method: 'POST',
      body: {},
    });
  });
});
