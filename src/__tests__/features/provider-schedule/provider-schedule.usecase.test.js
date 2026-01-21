/**
 * Provider Schedule Usecase Tests
 * File: provider-schedule.usecase.test.js
 */
import {
  listProviderSchedules,
  getProviderSchedule,
  createProviderSchedule,
  updateProviderSchedule,
  deleteProviderSchedule,
} from '@features/provider-schedule';
import { providerScheduleApi } from '@features/provider-schedule/provider-schedule.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/provider-schedule/provider-schedule.api', () => ({
  providerScheduleApi: {
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

describe('provider-schedule.usecase', () => {
  beforeEach(() => {
    providerScheduleApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    providerScheduleApi.get.mockResolvedValue({ data: { id: '1' } });
    providerScheduleApi.create.mockResolvedValue({ data: { id: '1' } });
    providerScheduleApi.update.mockResolvedValue({ data: { id: '1' } });
    providerScheduleApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listProviderSchedules,
      get: getProviderSchedule,
      create: createProviderSchedule,
      update: updateProviderSchedule,
      remove: deleteProviderSchedule,
    },
    { queueRequestIfOffline }
  );
});
