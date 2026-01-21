/**
 * API Key Permission Model Tests
 * File: api-key-permission.model.test.js
 */
import { normalizeApiKeyPermission, normalizeApiKeyPermissionList } from '@features/api-key-permission';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('api-key-permission.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeApiKeyPermission, normalizeApiKeyPermissionList);
  });
});
