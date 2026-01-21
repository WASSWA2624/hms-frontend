/**
 * Contact Use Cases
 * File: contact.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { contactApi } from './contact.api';
import { normalizeContact, normalizeContactList } from './contact.model';
import { parseContactId, parseContactListParams, parseContactPayload } from './contact.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listContacts = async (params = {}) =>
  execute(async () => {
    const parsed = parseContactListParams(params);
    const response = await contactApi.list(parsed);
    return normalizeContactList(response.data);
  });

const getContact = async (id) =>
  execute(async () => {
    const parsedId = parseContactId(id);
    const response = await contactApi.get(parsedId);
    return normalizeContact(response.data);
  });

const createContact = async (payload) =>
  execute(async () => {
    const parsed = parseContactPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CONTACTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeContact(parsed);
    }
    const response = await contactApi.create(parsed);
    return normalizeContact(response.data);
  });

const updateContact = async (id, payload) =>
  execute(async () => {
    const parsedId = parseContactId(id);
    const parsed = parseContactPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.CONTACTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeContact({ id: parsedId, ...parsed });
    }
    const response = await contactApi.update(parsedId, parsed);
    return normalizeContact(response.data);
  });

const deleteContact = async (id) =>
  execute(async () => {
    const parsedId = parseContactId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.CONTACTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeContact({ id: parsedId });
    }
    const response = await contactApi.remove(parsedId);
    return normalizeContact(response.data);
  });

export { listContacts, getContact, createContact, updateContact, deleteContact };
