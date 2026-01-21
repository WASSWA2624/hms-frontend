/**
 * Contact Usecase Tests
 * File: contact.usecase.test.js
 */
import { listContacts, getContact, createContact, updateContact, deleteContact } from '@features/contact';
import { contactApi } from '@features/contact/contact.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/contact/contact.api', () => ({
  contactApi: {
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

describe('contact.usecase', () => {
  beforeEach(() => {
    contactApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    contactApi.get.mockResolvedValue({ data: { id: '1' } });
    contactApi.create.mockResolvedValue({ data: { id: '1' } });
    contactApi.update.mockResolvedValue({ data: { id: '1' } });
    contactApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listContacts,
      get: getContact,
      create: createContact,
      update: updateContact,
      remove: deleteContact,
    },
    { queueRequestIfOffline }
  );
});
