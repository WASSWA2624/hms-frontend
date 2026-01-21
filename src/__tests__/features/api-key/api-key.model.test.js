/**
 * API Key Model Tests
 * File: api-key.model.test.js
 */
import { normalizeApiKey, normalizeApiKeyList } from '@features/api-key';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('api-key.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeApiKey, normalizeApiKeyList);
  });
});
