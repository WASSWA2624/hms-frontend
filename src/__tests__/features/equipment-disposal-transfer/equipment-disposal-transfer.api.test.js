/**
 * Equipment Disposal Transfer API Tests
 * File: equipment-disposal-transfer.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentDisposalTransferApi } from '@features/equipment-disposal-transfer/equipment-disposal-transfer.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-disposal-transfer.api', () => {
  it('creates crud api with Equipment Disposal Transfer endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_DISPOSAL_TRANSFERS);
    expect(equipmentDisposalTransferApi).toBeDefined();
  });
});
