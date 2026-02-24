/**
 * Dashboard Widget Model Tests
 * File: dashboard-widget.model.test.js
 */
import {
  normalizeDashboardSummary,
  normalizeDashboardWidget,
  normalizeDashboardWidgetList,
} from '@features/dashboard-widget';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('dashboard-widget.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeDashboardWidget, normalizeDashboardWidgetList);
  });

  it('normalizes summary payload to aggregate contract', () => {
    const result = normalizeDashboardSummary({
      roleProfile: { id: 'doctor', role: 'DOCTOR', pack: 'doctor', ignored: true },
      summaryCards: [{ id: 'assigned', label: 'Assigned', value: '12', debug: 'x' }],
      trend: { title: 'Trend', subtitle: 'Sub', points: [{ id: 'd1', date: '2026-02-24', value: '2', raw: true }] },
      distribution: {
        title: 'Dist',
        subtitle: 'Sub',
        total: '3',
        segments: [{ id: 'pending', label: 'Pending', value: '3', color: '#2563eb', raw: true }],
      },
      highlights: [{ id: 'h1', label: 'L', value: '1', context: 'C', variant: 'primary', hidden: true }],
      queue: [{ id: 'q1', title: 'Q', meta: '1 item', statusLabel: 'Now', statusVariant: 'warning', hidden: true }],
      alerts: [{ id: 'a1', title: 'A', meta: '1 signal', severityLabel: 'Watch', severityVariant: 'error', hidden: true }],
      activity: [{ id: 'ac1', title: 'T', meta: 'M', timeLabel: 'now', hidden: true }],
      hasLiveData: true,
      generatedAt: '2026-02-24T00:00:00.000Z',
      scope: { tenant_id: 'tenant-1', facility_id: 'facility-1', branch_id: 'branch-1', days: '7' },
    });

    expect(result).toEqual(
      expect.objectContaining({
        roleProfile: { id: 'doctor', role: 'DOCTOR', pack: 'doctor' },
        hasLiveData: true,
      })
    );
    expect(result.summaryCards[0]).toEqual({ id: 'assigned', label: 'Assigned', value: 12 });
    expect(result.trend.points[0]).toEqual({ id: 'd1', date: '2026-02-24', value: 2 });
    expect(result.distribution.segments[0]).toEqual({
      id: 'pending',
      label: 'Pending',
      value: 3,
      color: '#2563eb',
    });
    expect(result.scope).toEqual({
      tenant_id: 'tenant-1',
      facility_id: 'facility-1',
      branch_id: 'branch-1',
      days: 7,
    });
  });
});
