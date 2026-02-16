/**
 * Equipment Disposal Transfer Rules Tests
 * File: equipment-disposal-transfer.rules.test.js
 */
import {
  parseEquipmentDisposalTransferId,
  parseEquipmentDisposalTransferListParams,
  parseEquipmentDisposalTransferPayload,
} from '@features/equipment-disposal-transfer';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-disposal-transfer.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentDisposalTransferId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentDisposalTransferPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentDisposalTransferListParams);
  });
});
