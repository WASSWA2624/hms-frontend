/**
 * Ward Usecase Tests
 * File: ward.usecase.test.js
 */
import {
  listWards,
  getWard,
  createWard,
  updateWard,
  deleteWard,
  listWardBeds,
} from '@features/ward';
import { wardApi, getWardBedsApi } from '@features/ward/ward.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/ward/ward.api', () => ({
  wardApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  getWardBedsApi: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('ward.usecase', () => {
  beforeEach(() => {
    wardApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    wardApi.get.mockResolvedValue({ data: { id: '1' } });
    wardApi.create.mockResolvedValue({ data: { id: '1' } });
    wardApi.update.mockResolvedValue({ data: { id: '1' } });
    wardApi.remove.mockResolvedValue({ data: { id: '1' } });
    getWardBedsApi.mockResolvedValue({ data: [{ id: '1' }] });
  });

  runCrudUsecaseTests(
    {
      list: listWards,
      get: getWard,
      create: createWard,
      update: updateWard,
      remove: deleteWard,
      extraActions: [{ fn: listWardBeds, args: ['1'] }],
    },
    { queueRequestIfOffline }
  );
});
