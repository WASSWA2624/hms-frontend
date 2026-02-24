/**
 * Dashboard Widget API
 * File: dashboard-widget.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString, createCrudApi } from '@services/api';

const baseApi = createCrudApi(endpoints.DASHBOARD_WIDGETS);

const dashboardWidgetApi = {
  ...baseApi,
  summary: (params = {}) =>
    apiClient({
      url: `${endpoints.DASHBOARD_WIDGETS.SUMMARY}${buildQueryString(params)}`,
      method: 'GET',
    }),
};

export { dashboardWidgetApi };
