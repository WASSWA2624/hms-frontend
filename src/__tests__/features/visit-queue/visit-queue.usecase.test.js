/**
 * Visit Queue Usecase Tests
 * File: visit-queue.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  listVisitQueues,
  getVisitQueue,
  createVisitQueue,
  updateVisitQueue,
  deleteVisitQueue,
  prioritizeVisitQueue,
} from '@features/visit-queue';
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
    prioritize: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('visit-queue.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visitQueueApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    visitQueueApi.get.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.create.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.update.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.remove.mockResolvedValue({ data: { id: '1' } });
    visitQueueApi.prioritize.mockResolvedValue({ data: { id: '1', status: 'IN_PROGRESS' } });
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

  it('prioritizes visit queue online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(prioritizeVisitQueue('1', { reason: 'Urgent triage' })).resolves.toMatchObject({
      id: '1',
      status: 'IN_PROGRESS',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.VISIT_QUEUES.PRIORITIZE('1'),
      method: 'POST',
      body: { reason: 'Urgent triage' },
    });
    expect(visitQueueApi.prioritize).toHaveBeenCalledWith('1', { reason: 'Urgent triage' });
  });

  it('prioritizes visit queue online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(prioritizeVisitQueue('1')).resolves.toMatchObject({
      id: '1',
      status: 'IN_PROGRESS',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.VISIT_QUEUES.PRIORITIZE('1'),
      method: 'POST',
      body: {},
    });
    expect(visitQueueApi.prioritize).toHaveBeenCalledWith('1', {});
  });

  it('queues visit queue prioritize offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(prioritizeVisitQueue('1', { reason: 'Urgent triage' })).resolves.toMatchObject({
      id: '1',
      reason: 'Urgent triage',
    });
    expect(visitQueueApi.prioritize).not.toHaveBeenCalled();
  });

  it('rejects invalid id for prioritize', async () => {
    await expect(prioritizeVisitQueue(null, { reason: 'Urgent triage' })).rejects.toBeDefined();
  });
});
