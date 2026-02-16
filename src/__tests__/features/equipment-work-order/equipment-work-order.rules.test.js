/**
 * Equipment Work Order Rules Tests
 * File: equipment-work-order.rules.test.js
 */
import {
  parseEquipmentWorkOrderId,
  parseEquipmentWorkOrderListParams,
  parseEquipmentWorkOrderPayload,
} from '@features/equipment-work-order';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-work-order.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentWorkOrderId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentWorkOrderPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentWorkOrderListParams);
  });
});
