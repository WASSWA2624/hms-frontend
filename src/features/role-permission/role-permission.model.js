/**
 * Role Permission Model
 * File: role-permission.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeRolePermission = (value) => normalize(value);
const normalizeRolePermissionList = (value) => normalizeList(value);

export { normalizeRolePermission, normalizeRolePermissionList };
