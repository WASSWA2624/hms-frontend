/**
 * Shift Template API Tests
 * File: shift-template.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { shiftTemplateApi } from '@features/shift-template/shift-template.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('shift-template.api', () => {
  it('creates crud api with shift template endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SHIFT_TEMPLATES);
    expect(shiftTemplateApi).toBeDefined();
  });
});

