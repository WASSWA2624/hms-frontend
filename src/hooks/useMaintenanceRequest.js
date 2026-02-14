/**
 * useMaintenanceRequest Hook
 * File: useMaintenanceRequest.js
 */
import useCrud from '@hooks/useCrud';
import {
  listMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest
} from '@features/maintenance-request';

const useMaintenanceRequest = () =>
  useCrud({
    list: listMaintenanceRequests,
    get: getMaintenanceRequest,
    create: createMaintenanceRequest,
    update: updateMaintenanceRequest,
    remove: deleteMaintenanceRequest,
  });

export default useMaintenanceRequest;
