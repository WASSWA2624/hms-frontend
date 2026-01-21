/**
 * Payroll Run API
 * File: payroll-run.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const payrollRunApi = createCrudApi(endpoints.PAYROLL_RUNS);

export { payrollRunApi };
