/**
 * Shared logic for patient resource list screens.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useI18n, useNetwork, usePatientAccess } from '@hooks';
import { async as asyncStorage } from '@services/storage';
import { confirmAction, humanizeDisplayText } from '@utils';
import {
  getPatientResourceConfig,
  normalizeSearchParam,
  PATIENT_ROUTE_ROOT,
  sanitizeString,
  withPatientContext,
} from '../patientResourceConfigs';
import usePatientResourceCrud from '../usePatientResourceCrud';
import {
  buildNoticeMessage,
  isAccessDeniedError,
  normalizeNoticeValue,
  normalizePatientContextId,
  resolveErrorMessage,
} from '../patientScreenUtils';

const TABLE_MODE_BREAKPOINT = 768;
const PREFS_STORAGE_PREFIX = 'hms.patients.resources.list.preferences';
const MAX_FETCH_LIMIT = 100;
const DEFAULT_FETCH_PAGE = 1;
const DEFAULT_FETCH_LIMIT = 100;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);
const DEFAULT_DENSITY = 'compact';
const DENSITY_OPTIONS = Object.freeze(['compact', 'comfortable']);
const FILTER_LOGICS = Object.freeze(['AND', 'OR']);
const TEXT_OPERATORS = Object.freeze(['contains', 'equals', 'startsWith']);
const BOOLEAN_OPERATORS = Object.freeze(['is']);
const TABLE_COLUMNS = Object.freeze(['title', 'subtitle', 'updatedAt', 'createdAt']);
const DEFAULT_COLUMN_ORDER = Object.freeze([...TABLE_COLUMNS]);
const DEFAULT_VISIBLE_COLUMNS = Object.freeze(['title', 'subtitle', 'updatedAt']);
const STATUS_FIELDS = new Set(['is_active', 'is_primary']);

const normalizeValue = (value) => sanitizeString(value);
const normalizeLower = (value) => normalizeValue(value).toLowerCase();

const normalizeFetchPage = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_PAGE;
  return Math.max(DEFAULT_FETCH_PAGE, Math.trunc(numeric));
};

const normalizeFetchLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_FETCH_LIMIT;
  return Math.min(MAX_FETCH_LIMIT, Math.max(1, Math.trunc(numeric)));
};

const resolveListItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const isBooleanField = (field) => field?.type === 'switch' || STATUS_FIELDS.has(field?.name);

const sanitizeSortDirection = (value) => (value === 'desc' ? 'desc' : 'asc');

const sanitizeSortField = (value) => (
  TABLE_COLUMNS.includes(value) ? value : 'updatedAt'
);

const sanitizeDensity = (value) => (
  DENSITY_OPTIONS.includes(value) ? value : DEFAULT_DENSITY
);

const sanitizePageSize = (value) => (
  PAGE_SIZE_OPTIONS.includes(Number(value)) ? Number(value) : DEFAULT_PAGE_SIZE
);

const sanitizeColumns = (values, fallback) => {
  if (!Array.isArray(values)) return [...fallback];
  const normalized = values.filter((value) => TABLE_COLUMNS.includes(value));
  if (normalized.length === 0) return [...fallback];
  return [...new Set(normalized)];
};

const sanitizeFilterLogic = (value) => (
  FILTER_LOGICS.includes(value) ? value : 'AND'
);

const getDefaultOperator = (fieldType) => (
  fieldType === 'boolean' ? BOOLEAN_OPERATORS[0] : TEXT_OPERATORS[0]
);

const sanitizeFilterOperator = (fieldType, value) => {
  const allowedOperators = fieldType === 'boolean' ? BOOLEAN_OPERATORS : TEXT_OPERATORS;
  if (allowedOperators.includes(value)) return value;
  return allowedOperators[0];
};

const stableSort = (items, compareFn) => items
  .map((item, index) => ({ item, index }))
  .sort((left, right) => {
    const result = compareFn(left.item, right.item);
    if (result !== 0) return result;
    return left.index - right.index;
  })
  .map((entry) => entry.item);

const compareText = (left, right) => String(left || '').localeCompare(
  String(right || ''),
  undefined,
  { sensitivity: 'base', numeric: true }
);

const resolveBooleanSearchValue = (value) => {
  const normalized = normalizeLower(value);
  if (!normalized) return '';
  if (['on', 'active', 'enabled', 'yes', 'true', '1'].includes(normalized)) return 'on';
  if (['off', 'inactive', 'disabled', 'no', 'false', '0'].includes(normalized)) return 'off';
  return normalized;
};

const matchesTextOperator = (fieldValue, operator, needle) => {
  const normalizedValue = normalizeLower(fieldValue);
  const normalizedNeedle = normalizeLower(needle);
  if (!normalizedNeedle) return true;
  if (operator === 'equals') return normalizedValue === normalizedNeedle;
  if (operator === 'startsWith') return normalizedValue.startsWith(normalizedNeedle);
  return normalizedValue.includes(normalizedNeedle);
};

const matchesBooleanOperator = (fieldValue, operator, needle) => {
  if (operator !== 'is') return true;
  const normalizedNeedle = resolveBooleanSearchValue(needle);
  if (!normalizedNeedle) return true;
  return resolveBooleanSearchValue(fieldValue) === normalizedNeedle;
};

const normalizeSearchFieldOptions = (fields) => {
  const normalized = Array.isArray(fields) ? fields : [];
  const filtered = normalized.filter((field) => field?.id && field?.label);
  return filtered.length > 0 ? filtered : [{ id: 'title', label: 'Title', type: 'text' }];
};
