/**
 * Equipment Maintenance Plan Model Tests
 * File: equipment-maintenance-plan.model.test.js
 */
import {
  normalizeEquipmentMaintenancePlan,
  normalizeEquipmentMaintenancePlanList,
} from '@features/equipment-maintenance-plan';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-maintenance-plan.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentMaintenancePlan, normalizeEquipmentMaintenancePlanList);
  });
});
