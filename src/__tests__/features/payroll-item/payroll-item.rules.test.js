/**
 * Payroll Item Rules Tests
 * File: payroll-item.rules.test.js
 */
import { parsePayrollItemId, parsePayrollItemListParams, parsePayrollItemPayload } from '@features/payroll-item';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('payroll-item.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePayrollItemId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePayrollItemPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePayrollItemListParams);
  });
});
