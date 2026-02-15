/**
 * Sync Manager Tests
 * File: sync.manager.test.js
 */
import { handleError } from '@errors';
import { apiClient } from '@services/api';
import { getQueue, removeFromQueue } from '@offline/queue';
import { getIsOnline, subscribe } from '@offline/network.listener';
import { isQueueableRequest, sanitizeQueueRequest } from '@offline/request.contract';
import store from '@store';
import { actions as networkActions } from '@store/slices/network.slice';
import { __unsafeResetForTests, processQueue, startSync } from '@offline/sync.manager';

jest.mock('@offline/queue', () => ({
  getQueue: jest.fn(),
  removeFromQueue: jest.fn(),
}));

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
}));

jest.mock('@offline/network.listener', () => ({
  getIsOnline: jest.fn(),
  subscribe: jest.fn(),
}));

jest.mock('@offline/request.contract', () => ({
  isQueueableRequest: jest.fn(),
  sanitizeQueueRequest: jest.fn(),
}));

jest.mock('@store', () => ({
  dispatch: jest.fn(),
}));

jest.mock('@store/slices/network.slice', () => ({
  actions: {
    setSyncing: jest.fn((value) => ({ type: 'network/setSyncing', payload: value })),
  },
}));

jest.mock('@errors', () => ({
  handleError: jest.fn(),
}));

describe('Sync Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __unsafeResetForTests();

    getIsOnline.mockReturnValue(true);
    getQueue.mockResolvedValue([]);
    removeFromQueue.mockResolvedValue(true);
    apiClient.mockResolvedValue({ data: {}, status: 200 });
    isQueueableRequest.mockReturnValue(true);
    sanitizeQueueRequest.mockImplementation((request) => request);
  });

  describe('processQueue', () => {
    it('skips queue processing when offline', async () => {
      getIsOnline.mockReturnValue(false);

      const result = await processQueue();

      expect(result).toEqual({ processed: 0, failed: 0, discarded: 0 });
      expect(getQueue).not.toHaveBeenCalled();
      expect(apiClient).not.toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(networkActions.setSyncing(false));
    });

    it('sets syncing state while processing queue', async () => {
      getQueue.mockResolvedValue([{ id: '1', url: '/x', method: 'POST' }]);

      await processQueue();

      expect(store.dispatch).toHaveBeenCalledWith(networkActions.setSyncing(true));
      expect(store.dispatch).toHaveBeenCalledWith(networkActions.setSyncing(false));
    });

    it('returns early when queue is empty', async () => {
      getQueue.mockResolvedValue([]);

      const result = await processQueue();

      expect(result).toEqual({ processed: 0, failed: 0, discarded: 0 });
      expect(apiClient).not.toHaveBeenCalled();
    });

    it('processes queue items when online', async () => {
      const queue = [
        { id: '1', url: '/api/test1', method: 'POST' },
        { id: '2', url: '/api/test2', method: 'PATCH' },
      ];
      getQueue.mockResolvedValue(queue);

      await processQueue();

      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(apiClient).toHaveBeenCalledWith(queue[0]);
      expect(apiClient).toHaveBeenCalledWith(queue[1]);
    });

    it('removes item from queue after successful processing', async () => {
      const queue = [{ id: '1', url: '/api/test', method: 'POST' }];
      getQueue.mockResolvedValue(queue);

      const result = await processQueue();

      expect(result).toEqual({ processed: 1, failed: 0, discarded: 0 });
      expect(removeFromQueue).toHaveBeenCalledWith('1');
      expect(handleError).not.toHaveBeenCalled();
    });

    it('keeps item in queue on api failure and reports via handleError', async () => {
      const queue = [{ id: '1', url: '/api/test', method: 'POST' }];
      getQueue.mockResolvedValue(queue);
      apiClient.mockRejectedValue(new Error('API Error'));

      const result = await processQueue();

      expect(result).toEqual({ processed: 0, failed: 1, discarded: 0 });
      expect(removeFromQueue).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
    });

    it('discards invalid queue entries and keeps processing', async () => {
      const queue = [
        { id: '1', url: '/api/test1', method: 'POST' },
        { id: '2', url: '/api/not-mounted', method: 'POST' },
        { id: '3', url: '/api/test3', method: 'PATCH' },
      ];

      getQueue.mockResolvedValue(queue);
      isQueueableRequest.mockImplementation((item) => item?.id !== '2');

      const result = await processQueue();

      expect(result).toEqual({ processed: 2, failed: 0, discarded: 1 });
      expect(removeFromQueue).toHaveBeenCalledWith('1');
      expect(removeFromQueue).toHaveBeenCalledWith('2');
      expect(removeFromQueue).toHaveBeenCalledWith('3');
      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(handleError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          scope: 'offline.sync.manager',
          op: 'discardInvalidQueueItem',
          id: '2',
        })
      );
    });

    it('continues processing after single item failure', async () => {
      const queue = [
        { id: '1', url: '/api/test1', method: 'POST' },
        { id: '2', url: '/api/test2', method: 'PATCH' },
      ];
      getQueue.mockResolvedValue(queue);
      apiClient
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({ data: {}, status: 200 });

      const result = await processQueue();

      expect(result).toEqual({ processed: 1, failed: 1, discarded: 0 });
      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(removeFromQueue).toHaveBeenCalledTimes(1);
      expect(removeFromQueue).toHaveBeenCalledWith('2');
    });
  });

  describe('startSync', () => {
    it('subscribes once and returns unsubscribe function', () => {
      const unsubscribe = jest.fn();
      subscribe.mockReturnValue(unsubscribe);

      const a = startSync();
      const b = startSync();

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(a).toBe(unsubscribe);
      expect(b).toBe(unsubscribe);
    });

    it('triggers queue processing when network comes online', async () => {
      let onChange;
      subscribe.mockImplementation((fn) => {
        onChange = fn;
        return jest.fn();
      });

      getQueue.mockResolvedValue([{ id: '1', url: '/api/test', method: 'POST' }]);
      apiClient.mockResolvedValue({ data: {}, status: 200 });

      startSync();
      onChange({ isOnline: true });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(apiClient).toHaveBeenCalledTimes(1);
      expect(removeFromQueue).toHaveBeenCalledWith('1');
    });
  });
});
