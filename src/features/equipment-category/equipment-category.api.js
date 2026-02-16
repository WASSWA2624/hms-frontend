/**
 * Equipment Category API
 * File: equipment-category.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentCategoryApi = createCrudApi(endpoints.EQUIPMENT_CATEGORIES);

export { equipmentCategoryApi };
