/**
 * User Model
 * File: user.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeUser = (value) => normalize(value);
const normalizeUserList = (value) => normalizeList(value);

export { normalizeUser, normalizeUserList };
