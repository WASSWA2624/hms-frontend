import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { shiftTemplateApi } from './shift-template.api';
import { normalizeShiftTemplate, normalizeShiftTemplateList } from './shift-template.model';
import { parseShiftTemplateId, parseShiftTemplateListParams, parseShiftTemplatePayload } from './shift-template.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const getPayload = (r) => (r?.data?.data !== undefined ? r.data.data : r?.data);

export const listShiftTemplates = async (params = {}) =>
  execute(async () => {
    const parsed = parseShiftTemplateListParams(params);
    const res = await shiftTemplateApi.list(parsed);
    return normalizeShiftTemplateList(getPayload(res) ?? []);
  });

export const getShiftTemplate = async (id) =>
  execute(async () => {
    const res = await shiftTemplateApi.get(parseShiftTemplateId(id));
    return normalizeShiftTemplate(getPayload(res));
  });

export const createShiftTemplate = async (payload) =>
  execute(async () => {
    const parsed = parseShiftTemplatePayload(payload);
    const queued = await queueRequestIfOffline({ url: endpoints.SHIFT_TEMPLATES.CREATE, method: 'POST', body: parsed });
    if (queued) return normalizeShiftTemplate(parsed);
    const res = await shiftTemplateApi.create(parsed);
    return normalizeShiftTemplate(getPayload(res));
  });

export const updateShiftTemplate = async (id, payload) =>
  execute(async () => {
    const pid = parseShiftTemplateId(id);
    const parsed = parseShiftTemplatePayload(payload);
    const queued = await queueRequestIfOffline({ url: endpoints.SHIFT_TEMPLATES.UPDATE(pid), method: 'PUT', body: parsed });
    if (queued) return normalizeShiftTemplate({ id: pid, ...parsed });
    const res = await shiftTemplateApi.update(pid, parsed);
    return normalizeShiftTemplate(getPayload(res));
  });

export const deleteShiftTemplate = async (id) =>
  execute(async () => {
    const pid = parseShiftTemplateId(id);
    const queued = await queueRequestIfOffline({ url: endpoints.SHIFT_TEMPLATES.DELETE(pid), method: 'DELETE' });
    if (queued) return normalizeShiftTemplate({ id: pid });
    await shiftTemplateApi.remove(pid);
    return normalizeShiftTemplate({ id: pid });
  });
