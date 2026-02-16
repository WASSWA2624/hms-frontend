/**
 * Equipment Service Provider Rules Tests
 * File: equipment-service-provider.rules.test.js
 */
import {
  parseEquipmentServiceProviderId,
  parseEquipmentServiceProviderListParams,
  parseEquipmentServiceProviderPayload,
} from '@features/equipment-service-provider';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-service-provider.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentServiceProviderId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentServiceProviderPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentServiceProviderListParams);
  });
});
