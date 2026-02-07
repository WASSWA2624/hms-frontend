/**
 * Roster Day Off Usecase Tests
 * File: roster-day-off.usecase.test.js
 */
import {
  listRosterDayOffs,
  getRosterDayOff,
  createRosterDayOff,
  updateRosterDayOff,
  deleteRosterDayOff,
} from '@features/roster-day-off';
import { rosterDayOffApi } from '@features/roster-day-off/roster-day-off.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/roster-day-off/roster-day-off.api', () => ({
  rosterDayOffApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('roster-day-off.usecase', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    rosterDayOffApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    rosterDayOffApi.get.mockResolvedValue({ data: { id: '1' } });
    rosterDayOffApi.create.mockResolvedValue({ data: { id: '1' } });
    rosterDayOffApi.update.mockResolvedValue({ data: { id: '1' } });
    rosterDayOffApi.remove.mockResolvedValue({ data: null, status: 204 });
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore?.();
  });

  runCrudUsecaseTests(
    {
      list: listRosterDayOffs,
      get: getRosterDayOff,
      create: createRosterDayOff,
      update: updateRosterDayOff,
      remove: deleteRosterDayOff,
    },
    { queueRequestIfOffline }
  );
});

