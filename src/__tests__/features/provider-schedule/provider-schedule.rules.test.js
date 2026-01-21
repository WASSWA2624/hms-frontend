/**
 * Provider Schedule Rules Tests
 * File: provider-schedule.rules.test.js
 */
import {
  parseProviderScheduleId,
  parseProviderScheduleListParams,
  parseProviderSchedulePayload,
} from '@features/provider-schedule';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('provider-schedule.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseProviderScheduleId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseProviderSchedulePayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseProviderScheduleListParams);
  });
});
