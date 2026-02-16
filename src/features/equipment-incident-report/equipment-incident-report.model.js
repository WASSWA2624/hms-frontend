/**
 * Equipment Incident Report Model
 * File: equipment-incident-report.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentIncidentReport = (value) => normalize(value);
const normalizeEquipmentIncidentReportList = (value) => normalizeList(value);

export { normalizeEquipmentIncidentReport, normalizeEquipmentIncidentReportList };
