/**
 * Dashboard Widget Model
 * File: dashboard-widget.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const pickFields = (value, keys = []) => {
  const source = value && typeof value === 'object' ? value : {};
  return keys.reduce((acc, key) => {
    if (source[key] !== undefined) {
      acc[key] = source[key];
    }
    return acc;
  }, {});
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeCollection = (value, keys) =>
  (Array.isArray(value) ? value : []).map((item) => pickFields(item, keys));

const normalizeDashboardSummary = (value) => {
  const source = value && typeof value === 'object' ? value : {};
  const summaryCards = normalizeCollection(source.summaryCards, ['id', 'label', 'value', 'format']).map((item) => ({
    ...item,
    value: toNumber(item.value),
  }));
  const trendPoints = normalizeCollection(source?.trend?.points, ['id', 'date', 'value']).map((item) => ({
    ...item,
    value: toNumber(item.value),
  }));
  const distributionSegments = normalizeCollection(source?.distribution?.segments, ['id', 'label', 'value', 'color']).map(
    (item) => ({
      ...item,
      value: toNumber(item.value),
    })
  );
  const highlights = normalizeCollection(source.highlights, ['id', 'label', 'value', 'context', 'variant']);
  const queue = normalizeCollection(source.queue, ['id', 'title', 'meta', 'statusLabel', 'statusVariant']);
  const alerts = normalizeCollection(source.alerts, ['id', 'title', 'meta', 'severityLabel', 'severityVariant']);
  const activity = normalizeCollection(source.activity, ['id', 'title', 'meta', 'timeLabel']);

  const distributionTotal = toNumber(source?.distribution?.total);
  const computedHasLiveData =
    summaryCards.some((item) => toNumber(item.value) > 0) ||
    trendPoints.some((item) => toNumber(item.value) > 0) ||
    distributionTotal > 0;

  return {
    roleProfile: pickFields(source.roleProfile, ['id', 'role', 'pack']),
    summaryCards,
    trend: {
      title: String(source?.trend?.title || ''),
      subtitle: String(source?.trend?.subtitle || ''),
      points: trendPoints,
    },
    distribution: {
      title: String(source?.distribution?.title || ''),
      subtitle: String(source?.distribution?.subtitle || ''),
      total: distributionTotal,
      segments: distributionSegments,
    },
    highlights,
    queue,
    alerts,
    activity,
    hasLiveData: Boolean(source.hasLiveData || computedHasLiveData),
    generatedAt: String(source.generatedAt || new Date().toISOString()),
    scope: {
      tenant_id: source?.scope?.tenant_id || null,
      facility_id: source?.scope?.facility_id || null,
      branch_id: source?.scope?.branch_id || null,
      days: toNumber(source?.scope?.days || 7),
    },
  };
};

const normalizeDashboardWidget = (value) => normalize(value);
const normalizeDashboardWidgetList = (value) => normalizeList(value);

export { normalizeDashboardWidget, normalizeDashboardWidgetList, normalizeDashboardSummary };
