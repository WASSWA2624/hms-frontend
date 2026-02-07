/**
 * Nurse Roster Use Cases
 * File: nurse-roster.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { nurseRosterApi, publishNurseRosterApi } from './nurse-roster.api';
import {
  normalizeNurseRoster,
  normalizeNurseRosterList,
} from './nurse-roster.model';
import {
  parseNurseRosterId,
  parseNurseRosterListParams,
  parseNurseRosterPayload,
} from './nurse-roster.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const getPayload = (response) =>
  (response?.data?.data !== undefined ? response.data.data : response?.data);

const listNurseRosters = async (params = {}) =>
  execute(async () => {
    const parsed = parseNurseRosterListParams(params);
    const response = await nurseRosterApi.list(parsed);
    return normalizeNurseRosterList(getPayload(response) ?? []);
  });

const getNurseRoster = async (id) =>
  execute(async () => {
    const parsedId = parseNurseRosterId(id);
    const response = await nurseRosterApi.get(parsedId);
    return normalizeNurseRoster(getPayload(response));
  });

const createNurseRoster = async (payload) =>
  execute(async () => {
    const parsed = parseNurseRosterPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.NURSE_ROSTERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeNurseRoster(parsed);
    }
    const response = await nurseRosterApi.create(parsed);
    return normalizeNurseRoster(getPayload(response));
  });

const updateNurseRoster = async (id, payload) =>
  execute(async () => {
    const parsedId = parseNurseRosterId(id);
    const parsed = parseNurseRosterPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.NURSE_ROSTERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeNurseRoster({ id: parsedId, ...parsed });
    }
    const response = await nurseRosterApi.update(parsedId, parsed);
    return normalizeNurseRoster(getPayload(response));
  });

const deleteNurseRoster = async (id) =>
  execute(async () => {
    const parsedId = parseNurseRosterId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.NURSE_ROSTERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeNurseRoster({ id: parsedId });
    }
    const response = await nurseRosterApi.remove(parsedId);
    return normalizeNurseRoster(getPayload(response));
  });

const publishNurseRoster = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseNurseRosterId(id);
    const response = await publishNurseRosterApi(parsedId, payload);
    return normalizeNurseRoster(getPayload(response));
  });

export {
  listNurseRosters,
  getNurseRoster,
  createNurseRoster,
  updateNurseRoster,
  deleteNurseRoster,
  publishNurseRoster,
};
