/**
 * Equipment Disposal Transfer Usecase Tests
 * File: equipment-disposal-transfer.usecase.test.js
 */
import {
  listEquipmentDisposalTransfers,
  getEquipmentDisposalTransfer,
  createEquipmentDisposalTransfer,
  updateEquipmentDisposalTransfer,
  deleteEquipmentDisposalTransfer,
} from '@features/equipment-disposal-transfer';
import { equipmentDisposalTransferApi } from '@features/equipment-disposal-transfer/equipment-disposal-transfer.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-disposal-transfer/equipment-disposal-transfer.api', () => ({
  equipmentDisposalTransferApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('equipment-disposal-transfer.usecase', () => {
  beforeEach(() => {
    equipmentDisposalTransferApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentDisposalTransferApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentDisposalTransferApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentDisposalTransferApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentDisposalTransferApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentDisposalTransfers,
      get: getEquipmentDisposalTransfer,
      create: createEquipmentDisposalTransfer,
      update: updateEquipmentDisposalTransfer,
      remove: deleteEquipmentDisposalTransfer,
    },
    { queueRequestIfOffline }
  );
});
