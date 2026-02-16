/**
 * useEquipmentMaintenancePlan Hook
 * File: useEquipmentMaintenancePlan.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentMaintenancePlans,
  getEquipmentMaintenancePlan,
  createEquipmentMaintenancePlan,
  updateEquipmentMaintenancePlan,
  deleteEquipmentMaintenancePlan
} from '@features/equipment-maintenance-plan';

const useEquipmentMaintenancePlan = () =>
  useCrud({
    list: listEquipmentMaintenancePlans,
    get: getEquipmentMaintenancePlan,
    create: createEquipmentMaintenancePlan,
    update: updateEquipmentMaintenancePlan,
    remove: deleteEquipmentMaintenancePlan,
  });

export default useEquipmentMaintenancePlan;
