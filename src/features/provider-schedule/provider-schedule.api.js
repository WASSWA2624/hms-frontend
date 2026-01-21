/**
 * Provider Schedule API
 * File: provider-schedule.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const providerScheduleApi = createCrudApi(endpoints.PROVIDER_SCHEDULES);

export { providerScheduleApi };
