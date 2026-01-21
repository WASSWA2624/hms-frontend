/**
 * Role Model
 * File: role.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeRole = (value) => normalize(value);
const normalizeRoleList = (value) => normalizeList(value);

export { normalizeRole, normalizeRoleList };
