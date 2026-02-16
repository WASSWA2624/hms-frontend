/**
 * Equipment Incident Report API
 * File: equipment-incident-report.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentIncidentReportApi = createCrudApi(endpoints.EQUIPMENT_INCIDENT_REPORTS);

export { equipmentIncidentReportApi };
