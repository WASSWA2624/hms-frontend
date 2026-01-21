/**
 * Department Model
 * File: department.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeDepartment = (value) => normalize(value);
const normalizeDepartmentList = (value) => normalizeList(value);

export { normalizeDepartment, normalizeDepartmentList };
