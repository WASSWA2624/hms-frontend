/**
 * Visit Queue API
 * File: visit-queue.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const visitQueueApi = createCrudApi(endpoints.VISIT_QUEUES);
visitQueueApi.prioritize = (id, payload = {}) =>
  apiClient({
    url: endpoints.VISIT_QUEUES.PRIORITIZE(id),
    method: 'POST',
    body: payload,
  });

export { visitQueueApi };
