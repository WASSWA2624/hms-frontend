/**
 * Branch Usecase Tests
 * File: branch.usecase.test.js
 */
import { listBranches, getBranch, createBranch, updateBranch, deleteBranch } from '@features/branch';
import { branchApi } from '@features/branch/branch.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/branch/branch.api', () => ({
  branchApi: {
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

describe('branch.usecase', () => {
  beforeEach(() => {
    branchApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    branchApi.get.mockResolvedValue({ data: { id: '1' } });
    branchApi.create.mockResolvedValue({ data: { id: '1' } });
    branchApi.update.mockResolvedValue({ data: { id: '1' } });
    branchApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listBranches,
      get: getBranch,
      create: createBranch,
      update: updateBranch,
      remove: deleteBranch,
    },
    { queueRequestIfOffline }
  );
});
