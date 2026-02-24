/**
 * Dashboard Widget Use Cases
 * File: dashboard-widget.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { dashboardWidgetApi } from './dashboard-widget.api';
import {
  normalizeDashboardSummary,
  normalizeDashboardWidget,
  normalizeDashboardWidgetList,
} from './dashboard-widget.model';
import {
  parseDashboardWidgetId,
  parseDashboardWidgetListParams,
  parseDashboardWidgetPayload,
  parseDashboardSummaryParams,
} from './dashboard-widget.rules';

const getPayload = (response) =>
  (response?.data?.data !== undefined ? response.data.data : response?.data);

const normalizeUsecaseError = (error) => {
  const normalized = handleError(error);
  const status = Number(error?.status || error?.statusCode || 0);
  if (status > 0) {
    return { ...normalized, status, statusCode: status };
  }
  return normalized;
};

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw normalizeUsecaseError(error);
  }
};

const listDashboardWidgets = async (params = {}) =>
  execute(async () => {
    const parsed = parseDashboardWidgetListParams(params);
    const response = await dashboardWidgetApi.list(parsed);
    const payload = getPayload(response);
    return normalizeDashboardWidgetList(Array.isArray(payload) ? payload : []);
  });

const getDashboardWidget = async (id) =>
  execute(async () => {
    const parsedId = parseDashboardWidgetId(id);
    const response = await dashboardWidgetApi.get(parsedId);
    return normalizeDashboardWidget(getPayload(response));
  });

const createDashboardWidget = async (payload) =>
  execute(async () => {
    const parsed = parseDashboardWidgetPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DASHBOARD_WIDGETS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDashboardWidget(parsed);
    }
    const response = await dashboardWidgetApi.create(parsed);
    return normalizeDashboardWidget(getPayload(response));
  });

const updateDashboardWidget = async (id, payload) =>
  execute(async () => {
    const parsedId = parseDashboardWidgetId(id);
    const parsed = parseDashboardWidgetPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DASHBOARD_WIDGETS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeDashboardWidget({ id: parsedId, ...parsed });
    }
    const response = await dashboardWidgetApi.update(parsedId, parsed);
    return normalizeDashboardWidget(getPayload(response));
  });

const deleteDashboardWidget = async (id) =>
  execute(async () => {
    const parsedId = parseDashboardWidgetId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.DASHBOARD_WIDGETS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeDashboardWidget({ id: parsedId });
    }
    const response = await dashboardWidgetApi.remove(parsedId);
    return normalizeDashboardWidget(getPayload(response));
  });

const getDashboardSummary = async (params = {}) =>
  execute(async () => {
    const parsed = parseDashboardSummaryParams(params);
    const response = await dashboardWidgetApi.summary(parsed);
    return normalizeDashboardSummary(getPayload(response));
  });

export {
  listDashboardWidgets,
  getDashboardWidget,
  createDashboardWidget,
  updateDashboardWidget,
  deleteDashboardWidget,
  getDashboardSummary,
};
