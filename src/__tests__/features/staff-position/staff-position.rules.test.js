/**
 * Staff Position Rules Tests
 * File: staff-position.rules.test.js
 */
import {
  parseStaffPositionId,
  parseStaffPositionListParams,
  parseStaffPositionPayload,
} from '@features/staff-position';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('staff-position.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseStaffPositionId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseStaffPositionPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseStaffPositionListParams);
  });
});

