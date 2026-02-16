/**
 * Equipment Maintenance Plan Usecase Tests
 * File: equipment-maintenance-plan.usecase.test.js
 */
import {
  listEquipmentMaintenancePlans,
  getEquipmentMaintenancePlan,
  createEquipmentMaintenancePlan,
  updateEquipmentMaintenancePlan,
  deleteEquipmentMaintenancePlan,
} from '@features/equipment-maintenance-plan';
import { equipmentMaintenancePlanApi } from '@features/equipment-maintenance-plan/equipment-maintenance-plan.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-maintenance-plan/equipment-maintenance-plan.api', () => ({
  equipmentMaintenancePlanApi: {
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

describe('equipment-maintenance-plan.usecase', () => {
  beforeEach(() => {
    equipmentMaintenancePlanApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentMaintenancePlanApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentMaintenancePlanApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentMaintenancePlanApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentMaintenancePlanApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentMaintenancePlans,
      get: getEquipmentMaintenancePlan,
      create: createEquipmentMaintenancePlan,
      update: updateEquipmentMaintenancePlan,
      remove: deleteEquipmentMaintenancePlan,
    },
    { queueRequestIfOffline }
  );
});
