/**
 * Equipment Incident Report Usecase Tests
 * File: equipment-incident-report.usecase.test.js
 */
import {
  listEquipmentIncidentReports,
  getEquipmentIncidentReport,
  createEquipmentIncidentReport,
  updateEquipmentIncidentReport,
  deleteEquipmentIncidentReport,
} from '@features/equipment-incident-report';
import { equipmentIncidentReportApi } from '@features/equipment-incident-report/equipment-incident-report.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-incident-report/equipment-incident-report.api', () => ({
  equipmentIncidentReportApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('equipment-incident-report.usecase', () => {
  beforeEach(() => {
    equipmentIncidentReportApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentIncidentReportApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentIncidentReportApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentIncidentReportApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentIncidentReportApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentIncidentReports,
      get: getEquipmentIncidentReport,
      create: createEquipmentIncidentReport,
      update: updateEquipmentIncidentReport,
      remove: deleteEquipmentIncidentReport,
    },
    { queueRequestIfOffline }
  );
});
