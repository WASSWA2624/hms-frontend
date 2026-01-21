/**
 * Staff Profile Use Cases
 * File: staff-profile.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { staffProfileApi } from './staff-profile.api';
import { normalizeStaffProfile, normalizeStaffProfileList } from './staff-profile.model';
import {
  parseStaffProfileId,
  parseStaffProfileListParams,
  parseStaffProfilePayload,
} from './staff-profile.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listStaffProfiles = async (params = {}) =>
  execute(async () => {
    const parsed = parseStaffProfileListParams(params);
    const response = await staffProfileApi.list(parsed);
    return normalizeStaffProfileList(response.data);
  });

const getStaffProfile = async (id) =>
  execute(async () => {
    const parsedId = parseStaffProfileId(id);
    const response = await staffProfileApi.get(parsedId);
    return normalizeStaffProfile(response.data);
  });

const createStaffProfile = async (payload) =>
  execute(async () => {
    const parsed = parseStaffProfilePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_PROFILES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffProfile(parsed);
    }
    const response = await staffProfileApi.create(parsed);
    return normalizeStaffProfile(response.data);
  });

const updateStaffProfile = async (id, payload) =>
  execute(async () => {
    const parsedId = parseStaffProfileId(id);
    const parsed = parseStaffProfilePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_PROFILES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeStaffProfile({ id: parsedId, ...parsed });
    }
    const response = await staffProfileApi.update(parsedId, parsed);
    return normalizeStaffProfile(response.data);
  });

const deleteStaffProfile = async (id) =>
  execute(async () => {
    const parsedId = parseStaffProfileId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.STAFF_PROFILES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeStaffProfile({ id: parsedId });
    }
    const response = await staffProfileApi.remove(parsedId);
    return normalizeStaffProfile(response.data);
  });

export {
  listStaffProfiles,
  getStaffProfile,
  createStaffProfile,
  updateStaffProfile,
  deleteStaffProfile,
};
