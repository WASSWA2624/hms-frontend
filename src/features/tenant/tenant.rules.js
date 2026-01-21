/**
 * Tenant Rules
 * File: tenant.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseTenantId = (value) => parseId(value);
const parseTenantPayload = (value) => parsePayload(value);
const parseTenantListParams = (value) => parseListParams(value);

export { parseTenantId, parseTenantPayload, parseTenantListParams };
