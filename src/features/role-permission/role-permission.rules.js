/**
 * Role Permission Rules
 * File: role-permission.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseRolePermissionId = (value) => parseId(value);
const parseRolePermissionPayload = (value) => parsePayload(value);
const parseRolePermissionListParams = (value) => parseListParams(value);

export { parseRolePermissionId, parseRolePermissionPayload, parseRolePermissionListParams };
