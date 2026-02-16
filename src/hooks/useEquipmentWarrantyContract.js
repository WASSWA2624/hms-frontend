/**
 * useEquipmentWarrantyContract Hook
 * File: useEquipmentWarrantyContract.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentWarrantyContracts,
  getEquipmentWarrantyContract,
  createEquipmentWarrantyContract,
  updateEquipmentWarrantyContract,
  deleteEquipmentWarrantyContract
} from '@features/equipment-warranty-contract';

const useEquipmentWarrantyContract = () =>
  useCrud({
    list: listEquipmentWarrantyContracts,
    get: getEquipmentWarrantyContract,
    create: createEquipmentWarrantyContract,
    update: updateEquipmentWarrantyContract,
    remove: deleteEquipmentWarrantyContract,
  });

export default useEquipmentWarrantyContract;
