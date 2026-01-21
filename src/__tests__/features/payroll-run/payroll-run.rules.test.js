/**
 * Payroll Run Rules Tests
 * File: payroll-run.rules.test.js
 */
import { parsePayrollRunId, parsePayrollRunListParams, parsePayrollRunPayload } from '@features/payroll-run';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('payroll-run.rules', () => {
  it('parses ids', () => {
    expectIdParser(parsePayrollRunId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parsePayrollRunPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parsePayrollRunListParams);
  });
});
