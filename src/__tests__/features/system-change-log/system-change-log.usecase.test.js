/**
 * System Change Log Usecase Tests
 * File: system-change-log.usecase.test.js
 */
import {
  listSystemChangeLogs,
  getSystemChangeLog,
  createSystemChangeLog,
  updateSystemChangeLog,
  approveSystemChangeLog,
  implementSystemChangeLog,
} from '@features/system-change-log';
import { endpoints } from '@config/endpoints';
import { systemChangeLogApi } from '@features/system-change-log/system-change-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/system-change-log/system-change-log.api', () => ({
  systemChangeLogApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    approve: jest.fn(),
    implement: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('system-change-log.usecase', () => {
  beforeEach(() => {
    systemChangeLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    systemChangeLogApi.get.mockResolvedValue({ data: { id: '1' } });
    systemChangeLogApi.create.mockResolvedValue({ data: { id: '1' } });
    systemChangeLogApi.update.mockResolvedValue({ data: { id: '1' } });
    systemChangeLogApi.approve.mockResolvedValue({ data: { id: '1', status: 'APPROVED' } });
    systemChangeLogApi.implement.mockResolvedValue({ data: { id: '1', status: 'IMPLEMENTED' } });
  });

  runCrudUsecaseTests(
    {
      list: listSystemChangeLogs,
      get: getSystemChangeLog,
      create: createSystemChangeLog,
      update: updateSystemChangeLog,
    },
    { queueRequestIfOffline }
  );

  it('approves and implements system changes online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      approveSystemChangeLog('1', { note: 'CAB approved' })
    ).resolves.toEqual({
      id: '1',
      status: 'APPROVED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.APPROVE('1'),
      method: 'POST',
      body: { note: 'CAB approved' },
    });
    expect(systemChangeLogApi.approve).toHaveBeenCalledWith('1', {
      note: 'CAB approved',
    });

    await expect(
      implementSystemChangeLog('1', { note: 'Deployed to prod' })
    ).resolves.toEqual({
      id: '1',
      status: 'IMPLEMENTED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SYSTEM_CHANGE_LOGS.IMPLEMENT('1'),
      method: 'POST',
      body: { note: 'Deployed to prod' },
    });
    expect(systemChangeLogApi.implement).toHaveBeenCalledWith('1', {
      note: 'Deployed to prod',
    });
  });

  it('queues approve and implement actions when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);
    systemChangeLogApi.approve.mockClear();
    systemChangeLogApi.implement.mockClear();

    await expect(
      approveSystemChangeLog('1', { note: 'CAB approved' })
    ).resolves.toEqual({
      id: '1',
      status: 'APPROVED',
      note: 'CAB approved',
    });
    await expect(
      implementSystemChangeLog('1', { note: 'Deployed to prod' })
    ).resolves.toEqual({
      id: '1',
      status: 'IMPLEMENTED',
      note: 'Deployed to prod',
    });

    expect(systemChangeLogApi.approve).not.toHaveBeenCalled();
    expect(systemChangeLogApi.implement).not.toHaveBeenCalled();
  });
});
