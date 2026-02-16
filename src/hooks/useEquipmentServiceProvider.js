/**
 * useEquipmentServiceProvider Hook
 * File: useEquipmentServiceProvider.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentServiceProviders,
  getEquipmentServiceProvider,
  createEquipmentServiceProvider,
  updateEquipmentServiceProvider,
  deleteEquipmentServiceProvider
} from '@features/equipment-service-provider';

const useEquipmentServiceProvider = () =>
  useCrud({
    list: listEquipmentServiceProviders,
    get: getEquipmentServiceProvider,
    create: createEquipmentServiceProvider,
    update: updateEquipmentServiceProvider,
    remove: deleteEquipmentServiceProvider,
  });

export default useEquipmentServiceProvider;
