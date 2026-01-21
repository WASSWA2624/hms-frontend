/**
 * Visit Queue API
 * File: visit-queue.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const visitQueueApi = createCrudApi(endpoints.VISIT_QUEUES);

export { visitQueueApi };
