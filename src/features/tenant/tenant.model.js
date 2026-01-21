/**
 * Tenant Model
 * File: tenant.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeTenant = (value) => normalize(value);
const normalizeTenantList = (value) => normalizeList(value);

export { normalizeTenant, normalizeTenantList };
