/**
 * Equipment Safety Test Log Model Tests
 * File: equipment-safety-test-log.model.test.js
 */
import {
  normalizeEquipmentSafetyTestLog,
  normalizeEquipmentSafetyTestLogList,
} from '@features/equipment-safety-test-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-safety-test-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentSafetyTestLog, normalizeEquipmentSafetyTestLogList);
  });
});
