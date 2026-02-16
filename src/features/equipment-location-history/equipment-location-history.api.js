/**
 * Equipment Location History API
 * File: equipment-location-history.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentLocationHistoryApi = createCrudApi(endpoints.EQUIPMENT_LOCATION_HISTORIES);

export { equipmentLocationHistoryApi };
