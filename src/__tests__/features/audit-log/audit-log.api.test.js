/**
 * Audit Log API Tests
 * File: audit-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { auditLogApi } from '@features/audit-log/audit-log.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('audit-log.api', () => {
  it('lists audit logs with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await auditLogApi.list({ page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.AUDIT_LOGS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets an audit log by id', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await auditLogApi.get('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.AUDIT_LOGS.GET('1'),
      method: 'GET',
    });
  });
});
