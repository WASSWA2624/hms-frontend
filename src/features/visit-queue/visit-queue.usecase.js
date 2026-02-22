/**
 * Visit Queue Use Cases
 * File: visit-queue.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { visitQueueApi } from './visit-queue.api';
import { normalizeVisitQueue, normalizeVisitQueueList } from './visit-queue.model';
import { parseVisitQueueId, parseVisitQueueListParams, parseVisitQueuePayload } from './visit-queue.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listVisitQueues = async (params = {}) =>
  execute(async () => {
    const parsed = parseVisitQueueListParams(params);
    const response = await visitQueueApi.list(parsed);
    return normalizeVisitQueueList(response.data);
  });

const getVisitQueue = async (id) =>
  execute(async () => {
    const parsedId = parseVisitQueueId(id);
    const response = await visitQueueApi.get(parsedId);
    return normalizeVisitQueue(response.data);
  });

const createVisitQueue = async (payload) =>
  execute(async () => {
    const parsed = parseVisitQueuePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.VISIT_QUEUES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeVisitQueue(parsed);
    }
    const response = await visitQueueApi.create(parsed);
    return normalizeVisitQueue(response.data);
  });

const updateVisitQueue = async (id, payload) =>
  execute(async () => {
    const parsedId = parseVisitQueueId(id);
    const parsed = parseVisitQueuePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.VISIT_QUEUES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeVisitQueue({ id: parsedId, ...parsed });
    }
    const response = await visitQueueApi.update(parsedId, parsed);
    return normalizeVisitQueue(response.data);
  });

const deleteVisitQueue = async (id) =>
  execute(async () => {
    const parsedId = parseVisitQueueId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.VISIT_QUEUES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeVisitQueue({ id: parsedId });
    }
    await visitQueueApi.remove(parsedId);
    return { id: parsedId };
  });

const prioritizeVisitQueue = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseVisitQueueId(id);
    const parsed = parseVisitQueuePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.VISIT_QUEUES.PRIORITIZE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeVisitQueue({ id: parsedId, ...parsed });
    }
    const response = await visitQueueApi.prioritize(parsedId, parsed);
    return normalizeVisitQueue(response.data);
  });

export {
  listVisitQueues,
  getVisitQueue,
  createVisitQueue,
  updateVisitQueue,
  deleteVisitQueue,
  prioritizeVisitQueue,
};
