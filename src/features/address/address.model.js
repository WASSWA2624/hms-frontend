/**
 * Address Model
 * File: address.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAddress = (value) => normalize(value);
const normalizeAddressList = (value) => normalizeList(value);

export { normalizeAddress, normalizeAddressList };
