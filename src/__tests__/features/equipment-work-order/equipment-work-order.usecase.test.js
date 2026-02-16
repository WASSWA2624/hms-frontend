/**
 * Equipment Work Order Usecase Tests
 * File: equipment-work-order.usecase.test.js
 */
import {
  listEquipmentWorkOrders,
  getEquipmentWorkOrder,
  createEquipmentWorkOrder,
  updateEquipmentWorkOrder,
  deleteEquipmentWorkOrder,
} from '@features/equipment-work-order';
import { equipmentWorkOrderApi } from '@features/equipment-work-order/equipment-work-order.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-work-order/equipment-work-order.api', () => ({
  equipmentWorkOrderApi: {
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

describe('equipment-work-order.usecase', () => {
  beforeEach(() => {
    equipmentWorkOrderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentWorkOrderApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentWorkOrders,
      get: getEquipmentWorkOrder,
      create: createEquipmentWorkOrder,
      update: updateEquipmentWorkOrder,
      remove: deleteEquipmentWorkOrder,
    },
    { queueRequestIfOffline }
  );
});
