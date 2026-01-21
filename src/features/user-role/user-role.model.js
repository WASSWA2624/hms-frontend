/**
 * User Role Model
 * File: user-role.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeUserRole = (value) => normalize(value);
const normalizeUserRoleList = (value) => normalizeList(value);

export { normalizeUserRole, normalizeUserRoleList };
