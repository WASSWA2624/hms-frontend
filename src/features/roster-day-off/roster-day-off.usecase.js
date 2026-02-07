import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { rosterDayOffApi } from './roster-day-off.api';
import { normalizeRosterDayOff, normalizeRosterDayOffList } from './roster-day-off.model';
import { parseRosterDayOffId, parseRosterDayOffListParams, parseRosterDayOffPayload } from './roster-day-off.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const getPayload = (r) => (r?.data?.data !== undefined ? r.data.data : r?.data);

export const listRosterDayOffs = async (params = {}) =>
  execute(async () => {
    const res = await rosterDayOffApi.list(parseRosterDayOffListParams(params));
    return normalizeRosterDayOffList(getPayload(res) ?? []);
  });

export const getRosterDayOff = async (id) =>
  execute(async () => {
    const res = await rosterDayOffApi.get(parseRosterDayOffId(id));
    return normalizeRosterDayOff(getPayload(res));
  });

export const createRosterDayOff = async (payload) =>
  execute(async () => {
    const parsed = parseRosterDayOffPayload(payload);
    const queued = await queueRequestIfOffline({ url: endpoints.ROSTER_DAY_OFFS.CREATE, method: 'POST', body: parsed });
    if (queued) return normalizeRosterDayOff(parsed);
    const res = await rosterDayOffApi.create(parsed);
    return normalizeRosterDayOff(getPayload(res));
  });

export const updateRosterDayOff = async (id, payload) =>
  execute(async () => {
    const pid = parseRosterDayOffId(id);
    const parsed = parseRosterDayOffPayload(payload);
    const queued = await queueRequestIfOffline({ url: endpoints.ROSTER_DAY_OFFS.UPDATE(pid), method: 'PUT', body: parsed });
    if (queued) return normalizeRosterDayOff({ id: pid, ...parsed });
    const res = await rosterDayOffApi.update(pid, parsed);
    return normalizeRosterDayOff(getPayload(res));
  });

export const deleteRosterDayOff = async (id) =>
  execute(async () => {
    const pid = parseRosterDayOffId(id);
    const queued = await queueRequestIfOffline({ url: endpoints.ROSTER_DAY_OFFS.DELETE(pid), method: 'DELETE' });
    if (queued) return normalizeRosterDayOff({ id: pid });
    await rosterDayOffApi.remove(pid);
    return normalizeRosterDayOff({ id: pid });
  });
