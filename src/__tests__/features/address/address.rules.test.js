/**
 * Address Rules Tests
 * File: address.rules.test.js
 */
import { parseAddressId, parseAddressListParams, parseAddressPayload } from '@features/address';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('address.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAddressId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAddressPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAddressListParams);
  });
});
