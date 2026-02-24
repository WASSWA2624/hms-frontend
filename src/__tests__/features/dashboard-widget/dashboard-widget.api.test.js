/**
 * Dashboard Widget API Tests
 * File: dashboard-widget.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString, createCrudApi } from '@services/api';
import { dashboardWidgetApi } from '@features/dashboard-widget/dashboard-widget.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => ''),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('dashboard-widget.api', () => {
  it('creates crud api with dashboard widget endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DASHBOARD_WIDGETS);
    expect(dashboardWidgetApi).toBeDefined();
  });

  it('calls summary endpoint with query params', async () => {
    buildQueryString.mockReturnValue('?days=7');
    apiClient.mockResolvedValue({ data: { ok: true } });

    await dashboardWidgetApi.summary({ days: 7 });

    expect(buildQueryString).toHaveBeenCalledWith({ days: 7 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.DASHBOARD_WIDGETS.SUMMARY}?days=7`,
      method: 'GET',
    });
  });
});
