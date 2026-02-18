/**
 * Tenant Rules
 * File: tenant.rules.js
 */
import { z } from 'zod';
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const NAME_MAX_LENGTH = 255;
const SLUG_MAX_LENGTH = 191;

const parseTrimmedString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

const nameSchema = z.preprocess(
  parseTrimmedString,
  z.string().min(1).max(NAME_MAX_LENGTH)
);

const createSlugSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed || undefined;
  },
  z.string().min(1).max(SLUG_MAX_LENGTH).optional()
);

const updateSlugSchema = z.preprocess(
  (value) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed || null;
  },
  z.string().min(1).max(SLUG_MAX_LENGTH).nullable().optional()
);

const createTenantPayloadSchema = z.object({
  name: nameSchema,
  slug: createSlugSchema,
  is_active: z.boolean().optional(),
});

const updateTenantPayloadSchema = z.object({
  name: nameSchema.optional(),
  slug: updateSlugSchema,
  is_active: z.boolean().optional(),
});

const normalizeListFilters = (value) => {
  const parsed = parseListParams(value);
  const normalized = { ...parsed };

  if (typeof normalized.search === 'string') {
    const trimmedSearch = normalized.search.trim();
    if (!trimmedSearch) {
      delete normalized.search;
    } else {
      normalized.search = trimmedSearch;
    }
  }

  if (typeof normalized.is_active === 'boolean') {
    normalized.is_active = normalized.is_active ? 'true' : 'false';
  }

  return normalized;
};

const parseTenantId = (value) => parseId(value);
const parseTenantPayload = (value) => parsePayload(value);
const parseTenantCreatePayload = (value) => createTenantPayloadSchema.parse(value ?? {});
const parseTenantUpdatePayload = (value) => updateTenantPayloadSchema.parse(value ?? {});
const parseTenantListParams = (value) => normalizeListFilters(value ?? {});

export {
  parseTenantId,
  parseTenantPayload,
  parseTenantCreatePayload,
  parseTenantUpdatePayload,
  parseTenantListParams,
};
