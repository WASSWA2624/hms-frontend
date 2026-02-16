/**
 * Equipment Recall Notice API
 * File: equipment-recall-notice.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentRecallNoticeApi = createCrudApi(endpoints.EQUIPMENT_RECALL_NOTICES);

export { equipmentRecallNoticeApi };
