/**
 * Equipment Safety Test Log API
 * File: equipment-safety-test-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentSafetyTestLogApi = createCrudApi(endpoints.EQUIPMENT_SAFETY_TEST_LOGS);

export { equipmentSafetyTestLogApi };
