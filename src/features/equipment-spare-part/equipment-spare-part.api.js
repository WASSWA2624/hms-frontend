/**
 * Equipment Spare Part API
 * File: equipment-spare-part.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentSparePartApi = createCrudApi(endpoints.EQUIPMENT_SPARE_PARTS);

export { equipmentSparePartApi };
