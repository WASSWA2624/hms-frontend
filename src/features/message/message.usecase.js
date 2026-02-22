/**
 * Message Use Cases
 * File: message.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { messageApi } from './message.api';
import { normalizeMessage, normalizeMessageList } from './message.model';
import {
  parseMessageId,
  parseMessageListParams,
  parseMessagePayload,
} from './message.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listMessages = async (params = {}) =>
  execute(async () => {
    const parsed = parseMessageListParams(params);
    const response = await messageApi.list(parsed);
    return normalizeMessageList(response.data);
  });

const getMessage = async (id) =>
  execute(async () => {
    const parsedId = parseMessageId(id);
    const response = await messageApi.get(parsedId);
    return normalizeMessage(response.data);
  });

const createMessage = async (payload) =>
  execute(async () => {
    const parsed = parseMessagePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MESSAGES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeMessage(parsed);
    }
    const response = await messageApi.create(parsed);
    return normalizeMessage(response.data);
  });

const updateMessage = async (id, payload) =>
  execute(async () => {
    const parsedId = parseMessageId(id);
    const parsed = parseMessagePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.MESSAGES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeMessage({ id: parsedId, ...parsed });
    }
    const response = await messageApi.update(parsedId, parsed);
    return normalizeMessage(response.data);
  });

const deleteMessage = async (id) =>
  execute(async () => {
    const parsedId = parseMessageId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.MESSAGES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeMessage({ id: parsedId });
    }
    const response = await messageApi.remove(parsedId);
    return normalizeMessage(response.data);
  });

export {
  listMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
