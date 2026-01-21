/**
 * Visit Queue Usecase Tests
 * File: visit-queue.usecase.test.js
 */
import { listVisitQueues, getVisitQueue, createVisitQueue, updateVisitQueue, deleteVisitQueue } from '@features/visit-queue';
import { visitQueueApi } from '@features/visit-queue/visit-queue.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/visit-queue/visit-queue.api', () => ({
  visitQueueApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('visit-queue.usecase', () => {
  beforeEach(() => {
    visitQueueApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    visitQueueApi.get.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.create.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.update.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listVisitQueues,
      get: getVisitQueue,
      create: createVisitQueue,
      update: updateVisitQueue,
      remove: deleteVisitQueue,
    },
    { queueRequestIfOffline }
  );
});
