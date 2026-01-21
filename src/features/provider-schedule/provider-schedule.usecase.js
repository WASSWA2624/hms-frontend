/**
 * Provider Schedule Use Cases
 * File: provider-schedule.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { providerScheduleApi } from './provider-schedule.api';
import { normalizeProviderSchedule, normalizeProviderScheduleList } from './provider-schedule.model';
import {
  parseProviderScheduleId,
  parseProviderScheduleListParams,
  parseProviderSchedulePayload,
} from './provider-schedule.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listProviderSchedules = async (params = {}) =>
  execute(async () => {
    const parsed = parseProviderScheduleListParams(params);
    const response = await providerScheduleApi.list(parsed);
    return normalizeProviderScheduleList(response.data);
  });

const getProviderSchedule = async (id) =>
  execute(async () => {
    const parsedId = parseProviderScheduleId(id);
    const response = await providerScheduleApi.get(parsedId);
    return normalizeProviderSchedule(response.data);
  });

const createProviderSchedule = async (payload) =>
  execute(async () => {
    const parsed = parseProviderSchedulePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PROVIDER_SCHEDULES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeProviderSchedule(parsed);
    }
    const response = await providerScheduleApi.create(parsed);
    return normalizeProviderSchedule(response.data);
  });

const updateProviderSchedule = async (id, payload) =>
  execute(async () => {
    const parsedId = parseProviderScheduleId(id);
    const parsed = parseProviderSchedulePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PROVIDER_SCHEDULES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeProviderSchedule({ id: parsedId, ...parsed });
    }
    const response = await providerScheduleApi.update(parsedId, parsed);
    return normalizeProviderSchedule(response.data);
  });

const deleteProviderSchedule = async (id) =>
  execute(async () => {
    const parsedId = parseProviderScheduleId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PROVIDER_SCHEDULES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeProviderSchedule({ id: parsedId });
    }
    const response = await providerScheduleApi.remove(parsedId);
    return normalizeProviderSchedule(response.data);
  });

export {
  listProviderSchedules,
  getProviderSchedule,
  createProviderSchedule,
  updateProviderSchedule,
  deleteProviderSchedule,
};
