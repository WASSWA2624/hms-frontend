/**
 * Equipment Recall Notice Rules Tests
 * File: equipment-recall-notice.rules.test.js
 */
import {
  parseEquipmentRecallNoticeId,
  parseEquipmentRecallNoticeListParams,
  parseEquipmentRecallNoticePayload,
} from '@features/equipment-recall-notice';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-recall-notice.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentRecallNoticeId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentRecallNoticePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentRecallNoticeListParams);
  });
});
