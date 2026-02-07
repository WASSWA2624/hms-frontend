import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { staffAvailabilityApi } from './staff-availability.api';
import { normalizeStaffAvailability, normalizeStaffAvailabilityList } from './staff-availability.model';
import { parseStaffAvailabilityId, parseStaffAvailabilityListParams, parseStaffAvailabilityPayload } from './staff-availability.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const getPayload = (r) => (r?.data?.data !== undefined ? r.data.data : r?.data);

export const listStaffAvailabilities = async (params = {}) =>
  execute(async () => {
    const res = await staffAvailabilityApi.list(parseStaffAvailabilityListParams(params));
    return normalizeStaffAvailabilityList(getPayload(res) ?? []);
  });

export const getStaffAvailability = async (id) =>
  execute(async () => {
    const res = await staffAvailabilityApi.get(parseStaffAvailabilityId(id));
    return normalizeStaffAvailability(getPayload(res));
  });

export const createStaffAvailability = async (payload) =>
  execute(async () => {
    const parsed = parseStaffAvailabilityPayload(payload);
    const queued = await queueRequestIfOffline({ url: endpoints.STAFF_AVAILABILITIES.CREATE, method: 'POST', body: parsed });
    if (queued) return normalizeStaffAvailability(parsed);
    const res = await staffAvailabilityApi.create(parsed);
    return normalizeStaffAvailability(getPayload(res));
  });

export const updateStaffAvailability = async (id, payload) =>
  execute(async () => {
    const pid = parseStaffAvailabilityId(id);
    const parsed = parseStaffAvailabilityPayload(payload);
    const queued = await queueRequestIfOffline({ url: endpoints.STAFF_AVAILABILITIES.UPDATE(pid), method: 'PUT', body: parsed });
    if (queued) return normalizeStaffAvailability({ id: pid, ...parsed });
    const res = await staffAvailabilityApi.update(pid, parsed);
    return normalizeStaffAvailability(getPayload(res));
  });

export const deleteStaffAvailability = async (id) =>
  execute(async () => {
    const pid = parseStaffAvailabilityId(id);
    const queued = await queueRequestIfOffline({ url: endpoints.STAFF_AVAILABILITIES.DELETE(pid), method: 'DELETE' });
    if (queued) return normalizeStaffAvailability({ id: pid });
    await staffAvailabilityApi.remove(pid);
    return normalizeStaffAvailability({ id: pid });
  });
