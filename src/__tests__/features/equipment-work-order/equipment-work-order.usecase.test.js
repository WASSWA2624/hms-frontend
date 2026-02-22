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
  startEquipmentWorkOrder,
  returnToServiceEquipmentWorkOrder,
} from '@features/equipment-work-order';
import { endpoints } from '@config/endpoints';
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
    start: jest.fn(),
    returnToService: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('equipment-work-order.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    equipmentWorkOrderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentWorkOrderApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.remove.mockResolvedValue({ data: { id: '1' } });
    equipmentWorkOrderApi.start.mockResolvedValue({ data: { id: '1', status: 'IN_REPAIR' } });
    equipmentWorkOrderApi.returnToService.mockResolvedValue({
      data: { id: '1', status: 'RETURNED_TO_SERVICE' },
    });
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

  it('starts equipment work order online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(startEquipmentWorkOrder('1', { notes: 'Begin repair' })).resolves.toMatchObject({
      id: '1',
      status: 'IN_REPAIR',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.START('1'),
      method: 'POST',
      body: { notes: 'Begin repair' },
    });
    expect(equipmentWorkOrderApi.start).toHaveBeenCalledWith('1', { notes: 'Begin repair' });
  });

  it('starts equipment work order online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(startEquipmentWorkOrder('1')).resolves.toMatchObject({
      id: '1',
      status: 'IN_REPAIR',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.START('1'),
      method: 'POST',
      body: {},
    });
    expect(equipmentWorkOrderApi.start).toHaveBeenCalledWith('1', {});
  });

  it('queues equipment work order start offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(startEquipmentWorkOrder('1', { notes: 'Begin repair' })).resolves.toMatchObject({
      id: '1',
      status: 'IN_REPAIR',
      notes: 'Begin repair',
    });
    expect(equipmentWorkOrderApi.start).not.toHaveBeenCalled();
  });

  it('returns equipment work order to service online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      returnToServiceEquipmentWorkOrder('1', { verification_evidence: 'Service checklist' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'RETURNED_TO_SERVICE',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE('1'),
      method: 'POST',
      body: { verification_evidence: 'Service checklist' },
    });
    expect(equipmentWorkOrderApi.returnToService).toHaveBeenCalledWith('1', {
      verification_evidence: 'Service checklist',
    });
  });

  it('returns equipment work order to service online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(returnToServiceEquipmentWorkOrder('1')).resolves.toMatchObject({
      id: '1',
      status: 'RETURNED_TO_SERVICE',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE('1'),
      method: 'POST',
      body: {},
    });
    expect(equipmentWorkOrderApi.returnToService).toHaveBeenCalledWith('1', {});
  });

  it('queues equipment work order return-to-service offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      returnToServiceEquipmentWorkOrder('1', { verification_evidence: 'Service checklist' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'RETURNED_TO_SERVICE',
      verification_evidence: 'Service checklist',
    });
    expect(equipmentWorkOrderApi.returnToService).not.toHaveBeenCalled();
  });

  it('rejects invalid id for start', async () => {
    await expect(startEquipmentWorkOrder(null, { notes: 'Begin repair' })).rejects.toBeDefined();
  });

  it('rejects invalid id for return-to-service', async () => {
    await expect(
      returnToServiceEquipmentWorkOrder(null, { verification_evidence: 'Service checklist' })
    ).rejects.toBeDefined();
  });
});
