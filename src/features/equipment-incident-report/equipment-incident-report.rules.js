/**
 * Equipment Incident Report Rules
 * File: equipment-incident-report.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentIncidentReportId = (value) => parseId(value);
const parseEquipmentIncidentReportPayload = (value) => parsePayload(value);
const parseEquipmentIncidentReportListParams = (value) => parseListParams(value);

export {
  parseEquipmentIncidentReportId,
  parseEquipmentIncidentReportPayload,
  parseEquipmentIncidentReportListParams,
};
