/**
 * Contact Model Tests
 * File: contact.model.test.js
 */
import { normalizeContact, normalizeContactList } from '@features/contact';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('contact.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeContact, normalizeContactList);
  });
});
