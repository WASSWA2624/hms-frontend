/**
 * PHI Access Log Usecase Tests
 * File: phi-access-log.usecase.test.js
 */
import {
  listPhiAccessLogs,
  getPhiAccessLog,
  createPhiAccessLog,
  updatePhiAccessLog,
  deletePhiAccessLog,
} from '@features/phi-access-log';
import { phiAccessLogApi } from '@features/phi-access-log/phi-access-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/phi-access-log/phi-access-log.api', () => ({
  phiAccessLogApi: {
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

describe('phi-access-log.usecase', () => {
  beforeEach(() => {
    phiAccessLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    phiAccessLogApi.get.mockResolvedValue({ data: { id: '1' } });
    phiAccessLogApi.create.mockResolvedValue({ data: { id: '1' } });
    phiAccessLogApi.update.mockResolvedValue({ data: { id: '1' } });
    phiAccessLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPhiAccessLogs,
      get: getPhiAccessLog,
      create: createPhiAccessLog,
      update: updatePhiAccessLog,
      remove: deletePhiAccessLog,
    },
    { queueRequestIfOffline }
  );
});
