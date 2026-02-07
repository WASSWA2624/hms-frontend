/**
 * Nurse Roster Rules Tests
 * File: nurse-roster.rules.test.js
 */
import {
  parseNurseRosterId,
  parseNurseRosterListParams,
  parseNurseRosterPayload,
} from '@features/nurse-roster';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('nurse-roster.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseNurseRosterId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseNurseRosterPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseNurseRosterListParams);
  });
});
