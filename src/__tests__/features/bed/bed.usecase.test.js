/**
 * Bed Usecase Tests
 * File: bed.usecase.test.js
 */
import { listBeds, getBed, createBed, updateBed, deleteBed } from '@features/bed';
import { bedApi } from '@features/bed/bed.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/bed/bed.api', () => ({
  bedApi: {
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

describe('bed.usecase', () => {
  beforeEach(() => {
    bedApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    bedApi.get.mockResolvedValue({ data: { id: '1' } });
    bedApi.create.mockResolvedValue({ data: { id: '1' } });
    bedApi.update.mockResolvedValue({ data: { id: '1' } });
    bedApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listBeds,
      get: getBed,
      create: createBed,
      update: updateBed,
      remove: deleteBed,
    },
    { queueRequestIfOffline }
  );
});
