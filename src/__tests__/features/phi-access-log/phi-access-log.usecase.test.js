/**
 * PHI Access Log Usecase Tests
 * File: phi-access-log.usecase.test.js
 */
import {
  listPhiAccessLogs,
  getPhiAccessLog,
  createPhiAccessLog,
  listPhiAccessLogsByUser,
} from '@features/phi-access-log';
import { phiAccessLogApi } from '@features/phi-access-log/phi-access-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/phi-access-log/phi-access-log.api', () => ({
  phiAccessLogApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    listByUser: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('phi-access-log.usecase', () => {
  beforeEach(() => {
    phiAccessLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    phiAccessLogApi.get.mockResolvedValue({ data: { id: '1' } });
    phiAccessLogApi.create.mockResolvedValue({ data: { id: '1' } });
    phiAccessLogApi.listByUser.mockResolvedValue({ data: [{ id: '1' }] });
  });

  runCrudUsecaseTests(
    {
      list: listPhiAccessLogs,
      get: getPhiAccessLog,
      create: createPhiAccessLog,
      extraActions: [{ fn: listPhiAccessLogsByUser, args: ['user-1', { page: 1 }] }],
    },
    { queueRequestIfOffline }
  );

  it('lists phi access logs for a user', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(listPhiAccessLogsByUser('user-1', { page: 1 })).resolves.toEqual([{ id: '1' }]);
    expect(phiAccessLogApi.listByUser).toHaveBeenCalledWith('user-1', { page: 1 });
  });

  it('rejects invalid user id for user-scoped log lookup', async () => {
    await expect(listPhiAccessLogsByUser(null)).rejects.toBeDefined();
  });
});
