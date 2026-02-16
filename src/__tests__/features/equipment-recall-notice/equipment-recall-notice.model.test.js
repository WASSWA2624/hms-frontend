/**
 * Equipment Recall Notice Model Tests
 * File: equipment-recall-notice.model.test.js
 */
import {
  normalizeEquipmentRecallNotice,
  normalizeEquipmentRecallNoticeList,
} from '@features/equipment-recall-notice';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-recall-notice.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentRecallNotice, normalizeEquipmentRecallNoticeList);
  });
});
