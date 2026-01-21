/**
 * Payroll Item Model
 * File: payroll-item.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePayrollItem = (value) => normalize(value);
const normalizePayrollItemList = (value) => normalizeList(value);

export { normalizePayrollItem, normalizePayrollItemList };
