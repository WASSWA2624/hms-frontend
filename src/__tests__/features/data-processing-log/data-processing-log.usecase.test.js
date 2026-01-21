/**
 * Data Processing Log Usecase Tests
 * File: data-processing-log.usecase.test.js
 */
import {
  listDataProcessingLogs,
  getDataProcessingLog,
  createDataProcessingLog,
  updateDataProcessingLog,
  deleteDataProcessingLog,
} from '@features/data-processing-log';
import { dataProcessingLogApi } from '@features/data-processing-log/data-processing-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/data-processing-log/data-processing-log.api', () => ({
  dataProcessingLogApi: {
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

describe('data-processing-log.usecase', () => {
  beforeEach(() => {
    dataProcessingLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    dataProcessingLogApi.get.mockResolvedValue({ data: { id: '1' } });
    dataProcessingLogApi.create.mockResolvedValue({ data: { id: '1' } });
    dataProcessingLogApi.update.mockResolvedValue({ data: { id: '1' } });
    dataProcessingLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listDataProcessingLogs,
      get: getDataProcessingLog,
      create: createDataProcessingLog,
      update: updateDataProcessingLog,
      remove: deleteDataProcessingLog,
    },
    { queueRequestIfOffline }
  );
});
