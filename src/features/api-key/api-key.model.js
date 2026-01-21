/**
 * API Key Model
 * File: api-key.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeApiKey = (value) => normalize(value);
const normalizeApiKeyList = (value) => normalizeList(value);

export { normalizeApiKey, normalizeApiKeyList };
