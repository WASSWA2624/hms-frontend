/**
 * Equipment Incident Report Rules Tests
 * File: equipment-incident-report.rules.test.js
 */
import {
  parseEquipmentIncidentReportId,
  parseEquipmentIncidentReportListParams,
  parseEquipmentIncidentReportPayload,
} from '@features/equipment-incident-report';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-incident-report.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentIncidentReportId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentIncidentReportPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentIncidentReportListParams);
  });
});
