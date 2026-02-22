/**
 * Conversation Usecase Tests
 * File: conversation.usecase.test.js
 */
import {
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  updateConversation,
} from '@features/conversation';
import { conversationApi } from '@features/conversation/conversation.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/conversation/conversation.api', () => ({
  conversationApi: {
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

describe('conversation.usecase', () => {
  beforeEach(() => {
    conversationApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    conversationApi.get.mockResolvedValue({ data: { id: '1' } });
    conversationApi.create.mockResolvedValue({ data: { id: '1' } });
    conversationApi.update.mockResolvedValue({ data: { id: '1' } });
    conversationApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listConversations,
      get: getConversation,
      create: createConversation,
      update: updateConversation,
      remove: deleteConversation,
    },
    { queueRequestIfOffline }
  );
});
