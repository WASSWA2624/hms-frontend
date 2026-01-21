/**
 * Payroll Run Use Cases
 * File: payroll-run.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { payrollRunApi } from './payroll-run.api';
import { normalizePayrollRun, normalizePayrollRunList } from './payroll-run.model';
import { parsePayrollRunId, parsePayrollRunListParams, parsePayrollRunPayload } from './payroll-run.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPayrollRuns = async (params = {}) =>
  execute(async () => {
    const parsed = parsePayrollRunListParams(params);
    const response = await payrollRunApi.list(parsed);
    return normalizePayrollRunList(response.data);
  });

const getPayrollRun = async (id) =>
  execute(async () => {
    const parsedId = parsePayrollRunId(id);
    const response = await payrollRunApi.get(parsedId);
    return normalizePayrollRun(response.data);
  });

const createPayrollRun = async (payload) =>
  execute(async () => {
    const parsed = parsePayrollRunPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYROLL_RUNS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePayrollRun(parsed);
    }
    const response = await payrollRunApi.create(parsed);
    return normalizePayrollRun(response.data);
  });

const updatePayrollRun = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePayrollRunId(id);
    const parsed = parsePayrollRunPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYROLL_RUNS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePayrollRun({ id: parsedId, ...parsed });
    }
    const response = await payrollRunApi.update(parsedId, parsed);
    return normalizePayrollRun(response.data);
  });

const deletePayrollRun = async (id) =>
  execute(async () => {
    const parsedId = parsePayrollRunId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PAYROLL_RUNS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePayrollRun({ id: parsedId });
    }
    const response = await payrollRunApi.remove(parsedId);
    return normalizePayrollRun(response.data);
  });

export { listPayrollRuns, getPayrollRun, createPayrollRun, updatePayrollRun, deletePayrollRun };
