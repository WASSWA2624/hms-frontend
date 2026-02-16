/**
 * useEquipmentIncidentReport Hook
 * File: useEquipmentIncidentReport.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentIncidentReports,
  getEquipmentIncidentReport,
  createEquipmentIncidentReport,
  updateEquipmentIncidentReport,
  deleteEquipmentIncidentReport
} from '@features/equipment-incident-report';

const useEquipmentIncidentReport = () =>
  useCrud({
    list: listEquipmentIncidentReports,
    get: getEquipmentIncidentReport,
    create: createEquipmentIncidentReport,
    update: updateEquipmentIncidentReport,
    remove: deleteEquipmentIncidentReport,
  });

export default useEquipmentIncidentReport;
