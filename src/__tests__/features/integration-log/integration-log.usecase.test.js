/**
 * Integration Log Usecase Tests
 * File: integration-log.usecase.test.js
 */
import {
  listIntegrationLogs,
  getIntegrationLog,
  listIntegrationLogsByIntegration,
  replayIntegrationLog,
} from '@features/integration-log';
import { endpoints } from '@config/endpoints';
import { integrationLogApi } from '@features/integration-log/integration-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/integration-log/integration-log.api', () => ({
  integrationLogApi: {
    list: jest.fn(),
    get: jest.fn(),
    listByIntegration: jest.fn(),
    replay: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('integration-log.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    integrationLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    integrationLogApi.get.mockResolvedValue({ data: { id: '1' } });
    integrationLogApi.listByIntegration.mockResolvedValue({ data: [{ id: '1' }] });
    integrationLogApi.replay.mockResolvedValue({ data: { id: '1', status: 'queued' } });
  });

  runCrudUsecaseTests(
    {
      list: listIntegrationLogs,
      get: getIntegrationLog,
      extraActions: [
        {
          fn: listIntegrationLogsByIntegration,
          args: ['integration-1', { page: 1 }],
        },
      ],
    },
    { queueRequestIfOffline }
  );

  it('lists integration logs for a specific integration', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      listIntegrationLogsByIntegration('integration-1', { page: 1 })
    ).resolves.toEqual([{ id: '1' }]);
    expect(integrationLogApi.listByIntegration).toHaveBeenCalledWith(
      'integration-1',
      { page: 1 }
    );
  });

  it('replays integration log online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      replayIntegrationLog('1', { reason: 'manual_retry' })
    ).resolves.toEqual({
      id: '1',
      status: 'queued',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INTEGRATION_LOGS.REPLAY('1'),
      method: 'POST',
      body: { reason: 'manual_retry' },
    });
    expect(integrationLogApi.replay).toHaveBeenCalledWith('1', {
      reason: 'manual_retry',
    });
  });

  it('replays integration log online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(replayIntegrationLog('1')).resolves.toEqual({
      id: '1',
      status: 'queued',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INTEGRATION_LOGS.REPLAY('1'),
      method: 'POST',
      body: {},
    });
    expect(integrationLogApi.replay).toHaveBeenCalledWith('1', {});
  });

  it('queues replay action when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      replayIntegrationLog('1', { reason: 'manual_retry' })
    ).resolves.toEqual({
      id: '1',
      reason: 'manual_retry',
    });
    expect(integrationLogApi.replay).not.toHaveBeenCalled();
  });

  it('rejects invalid ids for integration log mounted actions', async () => {
    await expect(listIntegrationLogsByIntegration(null)).rejects.toBeDefined();
    await expect(replayIntegrationLog(null)).rejects.toBeDefined();
  });
});
