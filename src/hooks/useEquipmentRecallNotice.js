/**
 * useEquipmentRecallNotice Hook
 * File: useEquipmentRecallNotice.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentRecallNotices,
  getEquipmentRecallNotice,
  createEquipmentRecallNotice,
  updateEquipmentRecallNotice,
  deleteEquipmentRecallNotice
} from '@features/equipment-recall-notice';

const useEquipmentRecallNotice = () =>
  useCrud({
    list: listEquipmentRecallNotices,
    get: getEquipmentRecallNotice,
    create: createEquipmentRecallNotice,
    update: updateEquipmentRecallNotice,
    remove: deleteEquipmentRecallNotice,
  });

export default useEquipmentRecallNotice;
