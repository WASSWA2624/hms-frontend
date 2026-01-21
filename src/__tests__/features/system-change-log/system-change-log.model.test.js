/**
 * System Change Log Model Tests
 * File: system-change-log.model.test.js
 */
import { normalizeSystemChangeLog, normalizeSystemChangeLogList } from '@features/system-change-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('system-change-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeSystemChangeLog, normalizeSystemChangeLogList);
  });
});
