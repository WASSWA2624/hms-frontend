/**
 * Contact Model
 * File: contact.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeContact = (value) => normalize(value);
const normalizeContactList = (value) => normalizeList(value);

export { normalizeContact, normalizeContactList };
