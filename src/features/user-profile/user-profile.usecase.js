/**
 * User Profile Use Cases
 * File: user-profile.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { userProfileApi } from './user-profile.api';
import { normalizeUserProfile, normalizeUserProfileList } from './user-profile.model';
import {
  parseUserProfileId,
  parseUserProfileListParams,
  parseUserProfilePayload,
} from './user-profile.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

/** Backend response-format.mdc: success body is { status, message, data, meta }. Unwrap payload. */
const getPayload = (response) =>
  (response?.data?.data !== undefined ? response.data.data : response?.data);

const listUserProfiles = async (params = {}) =>
  execute(async () => {
    const parsed = parseUserProfileListParams(params);
    const response = await userProfileApi.list(parsed);
    const payload = getPayload(response);
    return normalizeUserProfileList(Array.isArray(payload) ? payload : []);
  });

const getUserProfile = async (id) =>
  execute(async () => {
    const parsedId = parseUserProfileId(id);
    const response = await userProfileApi.get(parsedId);
    return normalizeUserProfile(getPayload(response));
  });

const createUserProfile = async (payload) =>
  execute(async () => {
    const parsed = parseUserProfilePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_PROFILES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUserProfile(parsed);
    }
    const response = await userProfileApi.create(parsed);
    return normalizeUserProfile(getPayload(response));
  });

const updateUserProfile = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserProfileId(id);
    const parsed = parseUserProfilePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_PROFILES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeUserProfile({ id: parsedId, ...parsed });
    }
    const response = await userProfileApi.update(parsedId, parsed);
    return normalizeUserProfile(getPayload(response));
  });

const deleteUserProfile = async (id) =>
  execute(async () => {
    const parsedId = parseUserProfileId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_PROFILES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeUserProfile({ id: parsedId });
    }
    await userProfileApi.remove(parsedId);
    return normalizeUserProfile({ id: parsedId });
  });

export {
  listUserProfiles,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
