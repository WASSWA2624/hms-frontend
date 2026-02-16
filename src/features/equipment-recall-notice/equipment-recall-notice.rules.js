/**
 * Equipment Recall Notice Rules
 * File: equipment-recall-notice.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentRecallNoticeId = (value) => parseId(value);
const parseEquipmentRecallNoticePayload = (value) => parsePayload(value);
const parseEquipmentRecallNoticeListParams = (value) => parseListParams(value);

export {
  parseEquipmentRecallNoticeId,
  parseEquipmentRecallNoticePayload,
  parseEquipmentRecallNoticeListParams,
};
