/**
 * Offline Request Helpers
 * File: request.js
 */
import { addToQueue } from './queue';
import { getIsOnline } from './network.listener';
import { isQueueableRequest, sanitizeQueueRequest } from './request.contract';

const OFFLINE_QUEUE_FAILED = 'OFFLINE_QUEUE_FAILED';
const OFFLINE_REQUEST_NOT_ALLOWED = 'OFFLINE_REQUEST_NOT_ALLOWED';

const queueRequestIfOffline = async (request) => {
  if (getIsOnline()) return false;

  if (!isQueueableRequest(request)) {
    throw new Error(OFFLINE_REQUEST_NOT_ALLOWED);
  }

  const queued = await addToQueue(sanitizeQueueRequest(request));
  if (!queued) {
    throw new Error(OFFLINE_QUEUE_FAILED);
  }
  return true;
};

export { queueRequestIfOffline, OFFLINE_QUEUE_FAILED, OFFLINE_REQUEST_NOT_ALLOWED };
