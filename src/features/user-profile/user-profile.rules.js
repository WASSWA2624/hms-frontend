/**
 * User Profile Rules
 * File: user-profile.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseUserProfileId = (value) => parseId(value);
const parseUserProfilePayload = (value) => parsePayload(value);
const parseUserProfileListParams = (value) => parseListParams(value);

export { parseUserProfileId, parseUserProfilePayload, parseUserProfileListParams };
