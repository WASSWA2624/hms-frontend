/**
 * Availability Slot Use Cases
 * File: availability-slot.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { availabilitySlotApi } from './availability-slot.api';
import { normalizeAvailabilitySlot, normalizeAvailabilitySlotList } from './availability-slot.model';
import {
  parseAvailabilitySlotId,
  parseAvailabilitySlotListParams,
  parseAvailabilitySlotPayload,
} from './availability-slot.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAvailabilitySlots = async (params = {}) =>
  execute(async () => {
    const parsed = parseAvailabilitySlotListParams(params);
    const response = await availabilitySlotApi.list(parsed);
    return normalizeAvailabilitySlotList(response.data);
  });

const getAvailabilitySlot = async (id) =>
  execute(async () => {
    const parsedId = parseAvailabilitySlotId(id);
    const response = await availabilitySlotApi.get(parsedId);
    return normalizeAvailabilitySlot(response.data);
  });

const createAvailabilitySlot = async (payload) =>
  execute(async () => {
    const parsed = parseAvailabilitySlotPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AVAILABILITY_SLOTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAvailabilitySlot(parsed);
    }
    const response = await availabilitySlotApi.create(parsed);
    return normalizeAvailabilitySlot(response.data);
  });

const updateAvailabilitySlot = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAvailabilitySlotId(id);
    const parsed = parseAvailabilitySlotPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.AVAILABILITY_SLOTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAvailabilitySlot({ id: parsedId, ...parsed });
    }
    const response = await availabilitySlotApi.update(parsedId, parsed);
    return normalizeAvailabilitySlot(response.data);
  });

const deleteAvailabilitySlot = async (id) =>
  execute(async () => {
    const parsedId = parseAvailabilitySlotId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.AVAILABILITY_SLOTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAvailabilitySlot({ id: parsedId });
    }
    const response = await availabilitySlotApi.remove(parsedId);
    return normalizeAvailabilitySlot(response.data);
  });

export {
  listAvailabilitySlots,
  getAvailabilitySlot,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
};
