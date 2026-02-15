/**
 * Sync Manager
 * Orchestrates queue execution
 * File: sync.manager.js
 */
import { handleError } from '@errors';
import { apiClient } from '@services/api';
import store from '@store';
import { actions as networkActions } from '@store/slices/network.slice';
import { getQueue, removeFromQueue } from '@offline/queue';
import { getIsOnline, subscribe } from '@offline/network.listener';
import { isQueueableRequest, sanitizeQueueRequest } from '@offline/request.contract';

let unsubscribeSync = null;

const setSyncing = (value) => {
  store.dispatch(networkActions.setSyncing(Boolean(value)));
};

export const processQueue = async () => {
  const result = {
    processed: 0,
    failed: 0,
    discarded: 0,
  };

  if (!getIsOnline()) {
    setSyncing(false);
    return result;
  }

  setSyncing(true);

  try {
    const queue = await getQueue();
    if (!Array.isArray(queue) || queue.length === 0) {
      return result;
    }

    for (const item of queue) {
      if (!isQueueableRequest(item)) {
        result.discarded += 1;
        await removeFromQueue(item?.id);
        handleError(new Error('OFFLINE_REQUEST_NOT_ALLOWED'), {
          scope: 'offline.sync.manager',
          op: 'discardInvalidQueueItem',
          id: item?.id || null,
        });
        continue;
      }

      try {
        await apiClient(sanitizeQueueRequest(item));
        await removeFromQueue(item.id);
        result.processed += 1;
      } catch (error) {
        result.failed += 1;
        handleError(error, {
          scope: 'offline.sync.manager',
          op: 'processQueueItem',
          id: item?.id,
        });
        // Keep in queue for retry
      }
    }

    return result;
  } catch (error) {
    result.failed += 1;
    handleError(error, {
      scope: 'offline.sync.manager',
      op: 'processQueue',
    });
    return result;
  } finally {
    setSyncing(false);
  }
};

/**
 * Start syncing on network reconnect.
 * Idempotent: repeated calls return the same unsubscribe function.
 */
export const startSync = () => {
  if (unsubscribeSync) return unsubscribeSync;

  unsubscribeSync = subscribe((snapshot) => {
    if (snapshot?.isOnline) {
      // Fire-and-forget; offline sync must not block UI thread.
      processQueue().catch((error) => {
        handleError(error, {
          scope: 'offline.sync.manager',
          op: 'startSync',
        });
      });
    }
  });

  return unsubscribeSync;
};

export const stopSync = () => {
  if (!unsubscribeSync) return;
  try {
    unsubscribeSync();
  } finally {
    unsubscribeSync = null;
  }
};

/**
 * Testing-only reset helper to avoid state leaking across unit tests.
 * @private
 */
export const __unsafeResetForTests = () => {
  stopSync();
};

export default {
  processQueue,
  startSync,
  stopSync,
};

