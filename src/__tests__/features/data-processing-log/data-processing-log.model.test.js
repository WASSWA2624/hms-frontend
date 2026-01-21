/**
 * Data Processing Log Model Tests
 * File: data-processing-log.model.test.js
 */
import { normalizeDataProcessingLog, normalizeDataProcessingLogList } from '@features/data-processing-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('data-processing-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeDataProcessingLog, normalizeDataProcessingLogList);
  });
});
