/**
 * useEquipmentDisposalTransfer Hook
 * File: useEquipmentDisposalTransfer.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentDisposalTransfers,
  getEquipmentDisposalTransfer,
  createEquipmentDisposalTransfer,
  updateEquipmentDisposalTransfer,
  deleteEquipmentDisposalTransfer
} from '@features/equipment-disposal-transfer';

const useEquipmentDisposalTransfer = () =>
  useCrud({
    list: listEquipmentDisposalTransfers,
    get: getEquipmentDisposalTransfer,
    create: createEquipmentDisposalTransfer,
    update: updateEquipmentDisposalTransfer,
    remove: deleteEquipmentDisposalTransfer,
  });

export default useEquipmentDisposalTransfer;
