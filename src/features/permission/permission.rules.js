/**
 * Permission Rules
 * File: permission.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePermissionId = (value) => parseId(value);
const parsePermissionPayload = (value) => parsePayload(value);
const parsePermissionListParams = (value) => parseListParams(value);

export { parsePermissionId, parsePermissionPayload, parsePermissionListParams };
