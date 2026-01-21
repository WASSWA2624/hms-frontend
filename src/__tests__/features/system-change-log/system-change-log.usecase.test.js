/**
 * System Change Log Usecase Tests
 * File: system-change-log.usecase.test.js
 */
import {
  listSystemChangeLogs,
  getSystemChangeLog,
  createSystemChangeLog,
  updateSystemChangeLog,
  deleteSystemChangeLog,
} from '@features/system-change-log';
import { systemChangeLogApi } from '@features/system-change-log/system-change-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/system-change-log/system-change-log.api', () => ({
  systemChangeLogApi: {
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

describe('system-change-log.usecase', () => {
  beforeEach(() => {
    systemChangeLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    systemChangeLogApi.get.mockResolvedValue({ data: { id: '1' } });
    systemChangeLogApi.create.mockResolvedValue({ data: { id: '1' } });
    systemChangeLogApi.update.mockResolvedValue({ data: { id: '1' } });
    systemChangeLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listSystemChangeLogs,
      get: getSystemChangeLog,
      create: createSystemChangeLog,
      update: updateSystemChangeLog,
      remove: deleteSystemChangeLog,
    },
    { queueRequestIfOffline }
  );
});
