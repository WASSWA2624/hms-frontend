/**
 * Equipment Maintenance Plan Rules Tests
 * File: equipment-maintenance-plan.rules.test.js
 */
import {
  parseEquipmentMaintenancePlanId,
  parseEquipmentMaintenancePlanListParams,
  parseEquipmentMaintenancePlanPayload,
} from '@features/equipment-maintenance-plan';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-maintenance-plan.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentMaintenancePlanId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentMaintenancePlanPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentMaintenancePlanListParams);
  });
});
