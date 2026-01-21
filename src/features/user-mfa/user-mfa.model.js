/**
 * User MFA Model
 * File: user-mfa.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeUserMfa = (value) => normalize(value);
const normalizeUserMfaList = (value) => normalizeList(value);

export { normalizeUserMfa, normalizeUserMfaList };
