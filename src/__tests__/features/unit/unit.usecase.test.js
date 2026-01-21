/**
 * Unit Usecase Tests
 * File: unit.usecase.test.js
 */
import { listUnits, getUnit, createUnit, updateUnit, deleteUnit } from '@features/unit';
import { unitApi } from '@features/unit/unit.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/unit/unit.api', () => ({
  unitApi: {
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

describe('unit.usecase', () => {
  beforeEach(() => {
    unitApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    unitApi.get.mockResolvedValue({ data: { id: '1' } });
    unitApi.create.mockResolvedValue({ data: { id: '1' } });
    unitApi.update.mockResolvedValue({ data: { id: '1' } });
    unitApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listUnits,
      get: getUnit,
      create: createUnit,
      update: updateUnit,
      remove: deleteUnit,
    },
    { queueRequestIfOffline }
  );
});
