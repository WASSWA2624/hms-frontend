/**
 * Equipment Downtime Log Model Tests
 * File: equipment-downtime-log.model.test.js
 */
import {
  normalizeEquipmentDowntimeLog,
  normalizeEquipmentDowntimeLogList,
} from '@features/equipment-downtime-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-downtime-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentDowntimeLog, normalizeEquipmentDowntimeLogList);
  });
});
