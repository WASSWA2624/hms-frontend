/**
 * User Profile Model
 * File: user-profile.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeUserProfile = (value) => normalize(value);
const normalizeUserProfileList = (value) => normalizeList(value);

export { normalizeUserProfile, normalizeUserProfileList };
