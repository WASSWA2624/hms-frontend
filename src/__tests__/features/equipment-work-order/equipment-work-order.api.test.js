/**
 * Equipment Work Order API Tests
 * File: equipment-work-order.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { equipmentWorkOrderApi } from '@features/equipment-work-order/equipment-work-order.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-work-order.api', () => {
  it('creates crud api with Equipment Work Order endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_WORK_ORDERS);
    expect(equipmentWorkOrderApi).toBeDefined();
  });

  it('posts equipment work order start action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'IN_REPAIR' } });
    await equipmentWorkOrderApi.start('1', { notes: 'Begin repair' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.START('1'),
      method: 'POST',
      body: { notes: 'Begin repair' },
    });
  });

  it('posts equipment work order start action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'IN_REPAIR' } });
    await equipmentWorkOrderApi.start('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.START('1'),
      method: 'POST',
      body: {},
    });
  });

  it('posts equipment work order return-to-service action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'RETURNED_TO_SERVICE' } });
    await equipmentWorkOrderApi.returnToService('1', {
      verification_evidence: 'Service checklist',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE('1'),
      method: 'POST',
      body: { verification_evidence: 'Service checklist' },
    });
  });

  it('posts equipment work order return-to-service action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'RETURNED_TO_SERVICE' } });
    await equipmentWorkOrderApi.returnToService('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.EQUIPMENT_WORK_ORDERS.RETURN_TO_SERVICE('1'),
      method: 'POST',
      body: {},
    });
  });
});
