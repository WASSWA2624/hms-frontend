/**
 * Payroll Item Use Cases
 * File: payroll-item.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { payrollItemApi } from './payroll-item.api';
import { normalizePayrollItem, normalizePayrollItemList } from './payroll-item.model';
import { parsePayrollItemId, parsePayrollItemListParams, parsePayrollItemPayload } from './payroll-item.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPayrollItems = async (params = {}) =>
  execute(async () => {
    const parsed = parsePayrollItemListParams(params);
    const response = await payrollItemApi.list(parsed);
    return normalizePayrollItemList(response.data);
  });

const getPayrollItem = async (id) =>
  execute(async () => {
    const parsedId = parsePayrollItemId(id);
    const response = await payrollItemApi.get(parsedId);
    return normalizePayrollItem(response.data);
  });

const createPayrollItem = async (payload) =>
  execute(async () => {
    const parsed = parsePayrollItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYROLL_ITEMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePayrollItem(parsed);
    }
    const response = await payrollItemApi.create(parsed);
    return normalizePayrollItem(response.data);
  });

const updatePayrollItem = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePayrollItemId(id);
    const parsed = parsePayrollItemPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYROLL_ITEMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePayrollItem({ id: parsedId, ...parsed });
    }
    const response = await payrollItemApi.update(parsedId, parsed);
    return normalizePayrollItem(response.data);
  });

const deletePayrollItem = async (id) =>
  execute(async () => {
    const parsedId = parsePayrollItemId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYROLL_ITEMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePayrollItem({ id: parsedId });
    }
    const response = await payrollItemApi.remove(parsedId);
    return normalizePayrollItem(response.data);
  });

export { listPayrollItems, getPayrollItem, createPayrollItem, updatePayrollItem, deletePayrollItem };
