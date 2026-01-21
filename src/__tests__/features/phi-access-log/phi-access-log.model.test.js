/**
 * PHI Access Log Model Tests
 * File: phi-access-log.model.test.js
 */
import { normalizePhiAccessLog, normalizePhiAccessLogList } from '@features/phi-access-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('phi-access-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizePhiAccessLog, normalizePhiAccessLogList);
  });
});
