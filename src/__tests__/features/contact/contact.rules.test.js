/**
 * Contact Rules Tests
 * File: contact.rules.test.js
 */
import { parseContactId, parseContactListParams, parseContactPayload } from '@features/contact';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('contact.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseContactId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseContactPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseContactListParams);
  });
});
