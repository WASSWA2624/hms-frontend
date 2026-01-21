/**
 * Room Rules Tests
 * File: room.rules.test.js
 */
import { parseRoomId, parseRoomListParams, parseRoomPayload } from '@features/room';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('room.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseRoomId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseRoomPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseRoomListParams);
  });
});
