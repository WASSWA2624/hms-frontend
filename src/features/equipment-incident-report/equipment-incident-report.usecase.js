/**
 * Equipment Incident Report Use Cases
 * File: equipment-incident-report.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentIncidentReportApi } from './equipment-incident-report.api';
import { normalizeEquipmentIncidentReport, normalizeEquipmentIncidentReportList } from './equipment-incident-report.model';
import {
  parseEquipmentIncidentReportId,
  parseEquipmentIncidentReportListParams,
  parseEquipmentIncidentReportPayload,
} from './equipment-incident-report.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentIncidentReports = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentIncidentReportListParams(params);
    const response = await equipmentIncidentReportApi.list(parsed);
    return normalizeEquipmentIncidentReportList(response.data);
  });

const getEquipmentIncidentReport = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentIncidentReportId(id);
    const response = await equipmentIncidentReportApi.get(parsedId);
    return normalizeEquipmentIncidentReport(response.data);
  });

const createEquipmentIncidentReport = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentIncidentReportPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_INCIDENT_REPORTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentIncidentReport(parsed);
    }
    const response = await equipmentIncidentReportApi.create(parsed);
    return normalizeEquipmentIncidentReport(response.data);
  });

const updateEquipmentIncidentReport = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentIncidentReportId(id);
    const parsed = parseEquipmentIncidentReportPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_INCIDENT_REPORTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentIncidentReport({ id: parsedId, ...parsed });
    }
    const response = await equipmentIncidentReportApi.update(parsedId, parsed);
    return normalizeEquipmentIncidentReport(response.data);
  });

const deleteEquipmentIncidentReport = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentIncidentReportId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_INCIDENT_REPORTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentIncidentReport({ id: parsedId });
    }
    const response = await equipmentIncidentReportApi.remove(parsedId);
    return normalizeEquipmentIncidentReport(response.data);
  });

export {
  listEquipmentIncidentReports,
  getEquipmentIncidentReport,
  createEquipmentIncidentReport,
  updateEquipmentIncidentReport,
  deleteEquipmentIncidentReport,
};
