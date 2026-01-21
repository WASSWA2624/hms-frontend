/**
 * Branch Rules Tests
 * File: branch.rules.test.js
 */
import { parseBranchId, parseBranchListParams, parseBranchPayload } from '@features/branch';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('branch.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseBranchId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseBranchPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseBranchListParams);
  });
});
