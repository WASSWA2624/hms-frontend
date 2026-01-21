/**
 * Branch Use Cases
 * File: branch.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { branchApi } from './branch.api';
import { normalizeBranch, normalizeBranchList } from './branch.model';
import { parseBranchId, parseBranchListParams, parseBranchPayload } from './branch.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listBranches = async (params = {}) =>
  execute(async () => {
    const parsed = parseBranchListParams(params);
    const response = await branchApi.list(parsed);
    return normalizeBranchList(response.data);
  });

const getBranch = async (id) =>
  execute(async () => {
    const parsedId = parseBranchId(id);
    const response = await branchApi.get(parsedId);
    return normalizeBranch(response.data);
  });

const createBranch = async (payload) =>
  execute(async () => {
    const parsed = parseBranchPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.BRANCHES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeBranch(parsed);
    }
    const response = await branchApi.create(parsed);
    return normalizeBranch(response.data);
  });

const updateBranch = async (id, payload) =>
  execute(async () => {
    const parsedId = parseBranchId(id);
    const parsed = parseBranchPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.BRANCHES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeBranch({ id: parsedId, ...parsed });
    }
    const response = await branchApi.update(parsedId, parsed);
    return normalizeBranch(response.data);
  });

const deleteBranch = async (id) =>
  execute(async () => {
    const parsedId = parseBranchId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.BRANCHES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeBranch({ id: parsedId });
    }
    const response = await branchApi.remove(parsedId);
    return normalizeBranch(response.data);
  });

export { listBranches, getBranch, createBranch, updateBranch, deleteBranch };
