/**
 * User Session Model
 * File: user-session.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeUserSession = (value) => normalize(value);
const normalizeUserSessionList = (value) => normalizeList(value);

export { normalizeUserSession, normalizeUserSessionList };
