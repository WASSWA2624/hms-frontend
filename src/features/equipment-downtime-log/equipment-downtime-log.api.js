/**
 * Equipment Downtime Log API
 * File: equipment-downtime-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentDowntimeLogApi = createCrudApi(endpoints.EQUIPMENT_DOWNTIME_LOGS);

export { equipmentDowntimeLogApi };
