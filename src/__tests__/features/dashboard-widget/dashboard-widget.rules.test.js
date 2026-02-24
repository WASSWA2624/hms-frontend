/**
 * Dashboard Widget Rules Tests
 * File: dashboard-widget.rules.test.js
 */
import {
  parseDashboardSummaryParams,
  parseDashboardWidgetId,
  parseDashboardWidgetListParams,
  parseDashboardWidgetPayload,
} from '@features/dashboard-widget';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('dashboard-widget.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseDashboardWidgetId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseDashboardWidgetPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseDashboardWidgetListParams);
  });

  it('parses summary params with bounds', () => {
    expect(parseDashboardSummaryParams()).toEqual({ days: 7 });
    expect(
      parseDashboardSummaryParams({
        tenant_id: '660e8400-e29b-41d4-a716-446655440000',
        facility_id: '770e8400-e29b-41d4-a716-446655440000',
        branch_id: '880e8400-e29b-41d4-a716-446655440000',
        days: '14',
      })
    ).toEqual({
      tenant_id: '660e8400-e29b-41d4-a716-446655440000',
      facility_id: '770e8400-e29b-41d4-a716-446655440000',
      branch_id: '880e8400-e29b-41d4-a716-446655440000',
      days: 14,
    });
    expect(() => parseDashboardSummaryParams({ days: 31 })).toThrow();
  });
});
