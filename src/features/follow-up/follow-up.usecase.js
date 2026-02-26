/**
 * Follow Up Use Cases
 * File: follow-up.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { followUpApi } from './follow-up.api';
import { normalizeFollowUp, normalizeFollowUpList } from './follow-up.model';
import { parseFollowUpId, parseFollowUpListParams, parseFollowUpPayload } from './follow-up.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listFollowUps = async (params = {}) =>
  execute(async () => {
    const parsed = parseFollowUpListParams(params);
    const response = await followUpApi.list(parsed);
    return normalizeFollowUpList(response.data);
  });

const getFollowUp = async (id) =>
  execute(async () => {
    const parsedId = parseFollowUpId(id);
    const response = await followUpApi.get(parsedId);
    return normalizeFollowUp(response.data);
  });

const createFollowUp = async (payload) =>
  execute(async () => {
    const parsed = parseFollowUpPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FOLLOW_UPS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeFollowUp(parsed);
    }
    const response = await followUpApi.create(parsed);
    return normalizeFollowUp(response.data);
  });

const updateFollowUp = async (id, payload) =>
  execute(async () => {
    const parsedId = parseFollowUpId(id);
    const parsed = parseFollowUpPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FOLLOW_UPS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeFollowUp({ id: parsedId, ...parsed });
    }
    const response = await followUpApi.update(parsedId, parsed);
    return normalizeFollowUp(response.data);
  });

const deleteFollowUp = async (id) =>
  execute(async () => {
    const parsedId = parseFollowUpId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.FOLLOW_UPS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeFollowUp({ id: parsedId });
    }
    const response = await followUpApi.remove(parsedId);
    return normalizeFollowUp(response.data);
  });

const completeFollowUp = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseFollowUpId(id);
    const parsed = parseFollowUpPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FOLLOW_UPS.COMPLETE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeFollowUp({ id: parsedId, ...parsed, status: 'COMPLETED' });
    }
    const response = await followUpApi.complete(parsedId, parsed);
    return normalizeFollowUp(response.data);
  });

const cancelFollowUpAction = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseFollowUpId(id);
    const parsed = parseFollowUpPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.FOLLOW_UPS.CANCEL(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeFollowUp({ id: parsedId, ...parsed, status: 'CANCELLED' });
    }
    const response = await followUpApi.cancel(parsedId, parsed);
    return normalizeFollowUp(response.data);
  });

const dispatchFollowUpReminders = async (payload = {}) =>
  execute(async () => {
    const parsed = parseFollowUpPayload(payload);
    const response = await followUpApi.dispatchReminders(parsed);
    return response.data || {};
  });

const getFollowUpReminderDueSummary = async (params = {}) =>
  execute(async () => {
    const parsed = parseFollowUpListParams(params);
    const response = await followUpApi.getReminderDueSummary(parsed);
    return response.data || {};
  });

export {
  listFollowUps,
  getFollowUp,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
  completeFollowUp,
  cancelFollowUpAction,
  dispatchFollowUpReminders,
  getFollowUpReminderDueSummary,
};
