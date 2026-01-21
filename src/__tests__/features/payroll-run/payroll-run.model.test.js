/**
 * Payroll Run Model Tests
 * File: payroll-run.model.test.js
 */
import { normalizePayrollRun, normalizePayrollRunList } from '@features/payroll-run';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('payroll-run.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePayrollRun, normalizePayrollRunList);
  });
});
