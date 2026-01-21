/**
 * Payroll Item API
 * File: payroll-item.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const payrollItemApi = createCrudApi(endpoints.PAYROLL_ITEMS);

export { payrollItemApi };
