/**
 * Equipment Utilization Snapshot API Tests
 * File: equipment-utilization-snapshot.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentUtilizationSnapshotApi } from '@features/equipment-utilization-snapshot/equipment-utilization-snapshot.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-utilization-snapshot.api', () => {
  it('creates crud api with Equipment Utilization Snapshot endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_UTILIZATION_SNAPSHOTS);
    expect(equipmentUtilizationSnapshotApi).toBeDefined();
  });
});
