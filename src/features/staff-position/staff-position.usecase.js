/**
 * Staff Position Use Cases
 * File: staff-position.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { staffPositionApi } from './staff-position.api';
import { normalizeStaffPosition, normalizeStaffPositionList } from './staff-position.model';
import {
  parseStaffPositionId,
  parseStaffPositionListParams,
  parseStaffPositionPayload,
} from './staff-position.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listStaffPositions = async (params = {}) =>
  execute(async () => {
    const parsed = parseStaffPositionListParams(params);
    const response = await staffPositionApi.list(parsed);
    return normalizeStaffPositionList(response.data);
  });

const getStaffPosition = async (id) =>
  execute(async () => {
    const parsedId = parseStaffPositionId(id);
    const response = await staffPositionApi.get(parsedId);
    return normalizeStaffPosition(response.data);
  });

const createStaffPosition = async (payload) =>
  execute(async () => {
    const parsed = parseStaffPositionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_POSITIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffPosition(parsed);
    }
    const response = await staffPositionApi.create(parsed);
    return normalizeStaffPosition(response.data);
  });

const updateStaffPosition = async (id, payload) =>
  execute(async () => {
    const parsedId = parseStaffPositionId(id);
    const parsed = parseStaffPositionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_POSITIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffPosition({ id: parsedId, ...parsed });
    }
    const response = await staffPositionApi.update(parsedId, parsed);
    return normalizeStaffPosition(response.data);
  });

const deleteStaffPosition = async (id) =>
  execute(async () => {
    const parsedId = parseStaffPositionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_POSITIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeStaffPosition({ id: parsedId });
    }
    const response = await staffPositionApi.remove(parsedId);
    return normalizeStaffPosition(response.data);
  });

export {
  listStaffPositions,
  getStaffPosition,
  createStaffPosition,
  updateStaffPosition,
  deleteStaffPosition,
};

