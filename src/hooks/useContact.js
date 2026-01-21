/**
 * useContact Hook
 * File: useContact.js
 */
import useCrud from '@hooks/useCrud';
import { createContact, deleteContact, getContact, listContacts, updateContact } from '@features/contact';

const useContact = () =>
  useCrud({
    list: listContacts,
    get: getContact,
    create: createContact,
    update: updateContact,
    remove: deleteContact,
  });

export default useContact;
