/**
 * Payroll Item Model Tests
 * File: payroll-item.model.test.js
 */
import { normalizePayrollItem, normalizePayrollItemList } from '@features/payroll-item';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('payroll-item.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePayrollItem, normalizePayrollItemList);
  });
});
