/**
 * Offline Request Tests
 * File: request.test.js
 */
import { addToQueue } from '@offline/queue';
import { getIsOnline } from '@offline/network.listener';
import {
  OFFLINE_QUEUE_FAILED,
  OFFLINE_REQUEST_NOT_ALLOWED,
  queueRequestIfOffline,
} from '@offline/request';

const validMutationRequest = {
  url: 'http://localhost:3000/api/v1/patients',
  method: 'POST',
  body: { name: 'Jane Doe' },
};

jest.mock('@offline/queue', () => ({
  addToQueue: jest.fn(),
}));

jest.mock('@offline/network.listener', () => ({
  getIsOnline: jest.fn(),
}));

describe('queueRequestIfOffline', () => {
  beforeEach(() => {
    addToQueue.mockReset();
    getIsOnline.mockReset();
  });

  it('returns false when online', async () => {
    getIsOnline.mockReturnValue(true);
    await expect(queueRequestIfOffline(validMutationRequest)).resolves.toBe(false);
    expect(addToQueue).not.toHaveBeenCalled();
  });

  it('queues when offline', async () => {
    getIsOnline.mockReturnValue(false);
    addToQueue.mockResolvedValue(true);
    await expect(queueRequestIfOffline(validMutationRequest)).resolves.toBe(true);
    expect(addToQueue).toHaveBeenCalledWith(validMutationRequest);
  });

  it('rejects non-mutation requests while offline', async () => {
    getIsOnline.mockReturnValue(false);

    await expect(
      queueRequestIfOffline({
        url: 'http://localhost:3000/api/v1/patients',
        method: 'GET',
      })
    ).rejects.toThrow(OFFLINE_REQUEST_NOT_ALLOWED);
  });

  it('rejects requests targeting unmounted routes while offline', async () => {
    getIsOnline.mockReturnValue(false);

    await expect(
      queueRequestIfOffline({
        url: 'http://localhost:3000/api/v1/not-a-real-module',
        method: 'POST',
      })
    ).rejects.toThrow(OFFLINE_REQUEST_NOT_ALLOWED);
  });

  it('throws when queue fails', async () => {
    getIsOnline.mockReturnValue(false);
    addToQueue.mockResolvedValue(false);
    await expect(queueRequestIfOffline(validMutationRequest)).rejects.toThrow(
      OFFLINE_QUEUE_FAILED
    );
  });
});
