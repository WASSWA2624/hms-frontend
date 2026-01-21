/**
 * Address Model Tests
 * File: address.model.test.js
 */
import { normalizeAddress, normalizeAddressList } from '@features/address';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('address.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAddress, normalizeAddressList);
  });
});
