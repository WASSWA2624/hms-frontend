/**
 * Provider Schedule Model Tests
 * File: provider-schedule.model.test.js
 */
import { normalizeProviderSchedule, normalizeProviderScheduleList } from '@features/provider-schedule';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('provider-schedule.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeProviderSchedule, normalizeProviderScheduleList);
  });
});
