/**
 * Payroll Run Model
 * File: payroll-run.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePayrollRun = (value) => normalize(value);
const normalizePayrollRunList = (value) => normalizeList(value);

export { normalizePayrollRun, normalizePayrollRunList };
