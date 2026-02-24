/**
 * Dashboard Widget Rules
 * File: dashboard-widget.rules.js
 */
import { z } from 'zod';
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const dashboardSummaryParamsSchema = z.object({
  tenant_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional(),
  branch_id: z.string().uuid().optional(),
  days: z.coerce.number().int().min(1).max(30).default(7),
});

const parseDashboardWidgetId = (value) => parseId(value);
const parseDashboardWidgetPayload = (value) => parsePayload(value);
const parseDashboardWidgetListParams = (value) => parseListParams(value);
const parseDashboardSummaryParams = (value) => dashboardSummaryParamsSchema.parse(value ?? {});

export {
  parseDashboardWidgetId,
  parseDashboardWidgetPayload,
  parseDashboardWidgetListParams,
  parseDashboardSummaryParams,
};
