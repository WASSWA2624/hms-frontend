/**
 * Equipment Category API Tests
 * File: equipment-category.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentCategoryApi } from '@features/equipment-category/equipment-category.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-category.api', () => {
  it('creates crud api with Equipment Category endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_CATEGORIES);
    expect(equipmentCategoryApi).toBeDefined();
  });
});
