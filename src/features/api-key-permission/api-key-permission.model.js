/**
 * API Key Permission Model
 * File: api-key-permission.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeApiKeyPermission = (value) => normalize(value);
const normalizeApiKeyPermissionList = (value) => normalizeList(value);

export { normalizeApiKeyPermission, normalizeApiKeyPermissionList };
