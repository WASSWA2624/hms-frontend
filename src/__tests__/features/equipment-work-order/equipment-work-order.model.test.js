/**
 * Equipment Work Order Model Tests
 * File: equipment-work-order.model.test.js
 */
import {
  normalizeEquipmentWorkOrder,
  normalizeEquipmentWorkOrderList,
} from '@features/equipment-work-order';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-work-order.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentWorkOrder, normalizeEquipmentWorkOrderList);
  });
});
