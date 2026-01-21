/**
 * Permission Model
 * File: permission.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePermission = (value) => normalize(value);
const normalizePermissionList = (value) => normalizeList(value);

export { normalizePermission, normalizePermissionList };
