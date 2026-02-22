/**
 * Integration Usecase Tests
 * File: integration.usecase.test.js
 */
import {
  listIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegrationConnection,
  syncIntegrationNow,
} from '@features/integration';
import { endpoints } from '@config/endpoints';
import { integrationApi } from '@features/integration/integration.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/integration/integration.api', () => ({
  integrationApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    testConnection: jest.fn(),
    syncNow: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('integration.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    integrationApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    integrationApi.get.mockResolvedValue({ data: { id: '1' } });
    integrationApi.create.mockResolvedValue({ data: { id: '1' } });
    integrationApi.update.mockResolvedValue({ data: { id: '1' } });
    integrationApi.remove.mockResolvedValue({ data: { id: '1' } });
    integrationApi.testConnection.mockResolvedValue({ data: { id: '1', status: 'ok' } });
    integrationApi.syncNow.mockResolvedValue({ data: { id: '1', sync_status: 'completed' } });
  });

  runCrudUsecaseTests(
    {
      list: listIntegrations,
      get: getIntegration,
      create: createIntegration,
      update: updateIntegration,
      remove: deleteIntegration,
    },
    { queueRequestIfOffline }
  );

  it('tests integration connection online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      testIntegrationConnection('1', { mode: 'ping' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'ok',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INTEGRATIONS.TEST_CONNECTION('1'),
      method: 'POST',
      body: { mode: 'ping' },
    });
    expect(integrationApi.testConnection).toHaveBeenCalledWith('1', {
      mode: 'ping',
    });
  });

  it('syncs integration immediately online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(syncIntegrationNow('1', { scope: 'full' })).resolves.toMatchObject({
      id: '1',
      sync_status: 'completed',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INTEGRATIONS.SYNC_NOW('1'),
      method: 'POST',
      body: { scope: 'full' },
    });
    expect(integrationApi.syncNow).toHaveBeenCalledWith('1', {
      scope: 'full',
    });
  });

  it('queues integration connection test and sync actions when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(testIntegrationConnection('1', { mode: 'ping' })).resolves.toEqual({
      id: '1',
      mode: 'ping',
    });
    await expect(syncIntegrationNow('1', { scope: 'full' })).resolves.toEqual({
      id: '1',
      scope: 'full',
    });

    expect(integrationApi.testConnection).not.toHaveBeenCalled();
    expect(integrationApi.syncNow).not.toHaveBeenCalled();
  });

  it('supports default payload for action endpoints', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(testIntegrationConnection('1')).resolves.toMatchObject({
      id: '1',
      status: 'ok',
    });
    await expect(syncIntegrationNow('1')).resolves.toMatchObject({
      id: '1',
      sync_status: 'completed',
    });
    expect(integrationApi.testConnection).toHaveBeenCalledWith('1', {});
    expect(integrationApi.syncNow).toHaveBeenCalledWith('1', {});
  });

  it('rejects invalid ids for integration action endpoints', async () => {
    await expect(testIntegrationConnection(null)).rejects.toBeDefined();
    await expect(syncIntegrationNow(null)).rejects.toBeDefined();
  });
});
