/**
 * Roster Day Off API Tests
 * File: roster-day-off.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { rosterDayOffApi } from '@features/roster-day-off/roster-day-off.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('roster-day-off.api', () => {
  it('creates crud api with roster day off endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ROSTER_DAY_OFFS);
    expect(rosterDayOffApi).toBeDefined();
  });
});

