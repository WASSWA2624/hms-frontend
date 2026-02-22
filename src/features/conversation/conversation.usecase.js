/**
 * Conversation Use Cases
 * File: conversation.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { conversationApi } from './conversation.api';
import { normalizeConversation, normalizeConversationList } from './conversation.model';
import {
  parseConversationId,
  parseConversationListParams,
  parseConversationPayload,
} from './conversation.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listConversations = async (params = {}) =>
  execute(async () => {
    const parsed = parseConversationListParams(params);
    const response = await conversationApi.list(parsed);
    return normalizeConversationList(response.data);
  });

const getConversation = async (id) =>
  execute(async () => {
    const parsedId = parseConversationId(id);
    const response = await conversationApi.get(parsedId);
    return normalizeConversation(response.data);
  });

const createConversation = async (payload) =>
  execute(async () => {
    const parsed = parseConversationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CONVERSATIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeConversation(parsed);
    }
    const response = await conversationApi.create(parsed);
    return normalizeConversation(response.data);
  });

const updateConversation = async (id, payload) =>
  execute(async () => {
    const parsedId = parseConversationId(id);
    const parsed = parseConversationPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CONVERSATIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeConversation({ id: parsedId, ...parsed });
    }
    const response = await conversationApi.update(parsedId, parsed);
    return normalizeConversation(response.data);
  });

const deleteConversation = async (id) =>
  execute(async () => {
    const parsedId = parseConversationId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.CONVERSATIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeConversation({ id: parsedId });
    }
    const response = await conversationApi.remove(parsedId);
    return normalizeConversation(response.data);
  });

export {
  listConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
};
