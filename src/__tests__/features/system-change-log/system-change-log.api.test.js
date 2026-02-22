/**
 * System Change Log API Tests
 * File: system-change-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { systemChangeLogApi } from '@features/system-change-log/system-change-log.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('system-change-log.api', () => {
  it('lists system change logs with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await systemChangeLogApi.list({ page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.SYSTEM_CHANGE_LOGS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets a system change log by id', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await systemChangeLogApi.get('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.GET('1'),
      method: 'GET',
    });
  });

  it('creates a system change log', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await systemChangeLogApi.create({ title: 'Change request' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.CREATE,
      method: 'POST',
      body: { title: 'Change request' },
    });
  });

  it('updates a system change log', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await systemChangeLogApi.update('1', { status: 'PENDING' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.UPDATE('1'),
      method: 'PUT',
      body: { status: 'PENDING' },
    });
  });

  it('approves a system change log', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await systemChangeLogApi.approve('1', { note: 'Approved' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.APPROVE('1'),
      method: 'POST',
      body: { note: 'Approved' },
    });
  });

  it('implements a system change log', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await systemChangeLogApi.implement('1', { note: 'Implemented' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.IMPLEMENT('1'),
      method: 'POST',
      body: { note: 'Implemented' },
    });
  });
});
