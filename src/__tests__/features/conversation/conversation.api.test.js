/**
 * Conversation API Tests
 * File: conversation.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { conversationApi } from '@features/conversation/conversation.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('conversation.api', () => {
  it('creates crud api with conversation endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.CONVERSATIONS);
    expect(conversationApi).toBeDefined();
  });
});
