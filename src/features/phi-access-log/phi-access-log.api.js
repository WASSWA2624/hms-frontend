/**
 * PHI Access Log API
 * File: phi-access-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const phiAccessLogApi = createCrudApi(endpoints.PHI_ACCESS_LOGS);

export { phiAccessLogApi };
