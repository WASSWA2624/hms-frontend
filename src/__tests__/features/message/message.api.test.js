/**
 * Message API Tests
 * File: message.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { messageApi } from '@features/message/message.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('message.api', () => {
  it('creates crud api with message endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.MESSAGES);
    expect(messageApi).toBeDefined();
  });
});
