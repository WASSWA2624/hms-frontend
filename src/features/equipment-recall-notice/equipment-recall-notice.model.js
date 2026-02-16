/**
 * Equipment Recall Notice Model
 * File: equipment-recall-notice.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentRecallNotice = (value) => normalize(value);
const normalizeEquipmentRecallNoticeList = (value) => normalizeList(value);

export { normalizeEquipmentRecallNotice, normalizeEquipmentRecallNoticeList };
