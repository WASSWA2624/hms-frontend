/**
 * System Change Log API
 * File: system-change-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const systemChangeLogApi = createCrudApi(endpoints.SYSTEM_CHANGE_LOGS);

export { systemChangeLogApi };
