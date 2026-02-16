/**
 * Equipment Incident Report API Tests
 * File: equipment-incident-report.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentIncidentReportApi } from '@features/equipment-incident-report/equipment-incident-report.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-incident-report.api', () => {
  it('creates crud api with Equipment Incident Report endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_INCIDENT_REPORTS);
    expect(equipmentIncidentReportApi).toBeDefined();
  });
});
