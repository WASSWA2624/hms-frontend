/**
 * OAuth Account Model
 * File: oauth-account.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeOauthAccount = (value) => normalize(value);
const normalizeOauthAccountList = (value) => normalizeList(value);

export { normalizeOauthAccount, normalizeOauthAccountList };
