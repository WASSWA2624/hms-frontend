/**
 * Equipment Service Provider API
 * File: equipment-service-provider.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentServiceProviderApi = createCrudApi(endpoints.EQUIPMENT_SERVICE_PROVIDERS);

export { equipmentServiceProviderApi };
