/**
 * Equipment Recall Notice API Tests
 * File: equipment-recall-notice.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentRecallNoticeApi } from '@features/equipment-recall-notice/equipment-recall-notice.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-recall-notice.api', () => {
  it('creates crud api with Equipment Recall Notice endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_RECALL_NOTICES);
    expect(equipmentRecallNoticeApi).toBeDefined();
  });
});
