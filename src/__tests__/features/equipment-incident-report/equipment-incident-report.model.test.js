/**
 * Equipment Incident Report Model Tests
 * File: equipment-incident-report.model.test.js
 */
import {
  normalizeEquipmentIncidentReport,
  normalizeEquipmentIncidentReportList,
} from '@features/equipment-incident-report';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-incident-report.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentIncidentReport, normalizeEquipmentIncidentReportList);
  });
});
