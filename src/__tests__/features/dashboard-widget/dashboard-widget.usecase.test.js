/**
 * Dashboard Widget Usecase Tests
 * File: dashboard-widget.usecase.test.js
 */
import {
  getDashboardSummary,
  listDashboardWidgets,
  getDashboardWidget,
  createDashboardWidget,
  updateDashboardWidget,
  deleteDashboardWidget,
} from '@features/dashboard-widget';
import { dashboardWidgetApi } from '@features/dashboard-widget/dashboard-widget.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/dashboard-widget/dashboard-widget.api', () => ({
  dashboardWidgetApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    summary: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('dashboard-widget.usecase', () => {
  beforeEach(() => {
    dashboardWidgetApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    dashboardWidgetApi.get.mockResolvedValue({ data: { id: '1' } });
    dashboardWidgetApi.create.mockResolvedValue({ data: { id: '1' } });
    dashboardWidgetApi.update.mockResolvedValue({ data: { id: '1' } });
    dashboardWidgetApi.remove.mockResolvedValue({ data: { id: '1' } });
    dashboardWidgetApi.summary.mockResolvedValue({
      data: {
        roleProfile: { id: 'tenant_admin', role: 'TENANT_ADMIN', pack: 'admin' },
        summaryCards: [],
        trend: { title: '', subtitle: '', points: [] },
        distribution: { title: '', subtitle: '', total: 0, segments: [] },
        highlights: [],
        queue: [],
        alerts: [],
        activity: [],
        hasLiveData: false,
        generatedAt: '2026-02-24T00:00:00.000Z',
        scope: { tenant_id: null, facility_id: null, branch_id: null, days: 7 },
      },
    });
  });

  runCrudUsecaseTests(
    {
      list: listDashboardWidgets,
      get: getDashboardWidget,
      create: createDashboardWidget,
      update: updateDashboardWidget,
      remove: deleteDashboardWidget,
    },
    { queueRequestIfOffline }
  );

  it('requests and normalizes dashboard summary', async () => {
    const result = await getDashboardSummary({
      tenant_id: '660e8400-e29b-41d4-a716-446655440000',
      days: 7,
    });

    expect(dashboardWidgetApi.summary).toHaveBeenCalledWith({
      tenant_id: '660e8400-e29b-41d4-a716-446655440000',
      days: 7,
    });
    expect(result).toEqual(
      expect.objectContaining({
        roleProfile: expect.objectContaining({ id: 'tenant_admin' }),
        summaryCards: expect.any(Array),
        trend: expect.any(Object),
        distribution: expect.any(Object),
        highlights: expect.any(Array),
        queue: expect.any(Array),
        alerts: expect.any(Array),
        activity: expect.any(Array),
      })
    );
  });

  it('preserves status code for summary validation failures', async () => {
    dashboardWidgetApi.summary.mockRejectedValue({
      status: 422,
      message: 'errors.validation.field.required',
    });

    await expect(getDashboardSummary({ days: 7 })).rejects.toMatchObject({
      status: 422,
      statusCode: 422,
    });
  });
});
