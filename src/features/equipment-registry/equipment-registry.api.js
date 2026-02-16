/**
 * Equipment Registry API
 * File: equipment-registry.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentRegistryApi = createCrudApi(endpoints.EQUIPMENT_REGISTRIES);

export { equipmentRegistryApi };
