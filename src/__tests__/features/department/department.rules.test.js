/**
 * Department Rules Tests
 * File: department.rules.test.js
 */
import { parseDepartmentId, parseDepartmentListParams, parseDepartmentPayload } from '@features/department';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('department.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseDepartmentId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseDepartmentPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseDepartmentListParams);
  });
});
