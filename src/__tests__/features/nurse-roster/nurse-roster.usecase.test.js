/**
 * Nurse Roster Use Case Tests
 * File: nurse-roster.usecase.test.js
 */
import {
  listNurseRosters,
  getNurseRoster,
  createNurseRoster,
  updateNurseRoster,
  deleteNurseRoster,
  publishNurseRoster,
  generateNurseRoster,
} from '@features/nurse-roster';
import * as api from '@features/nurse-roster/nurse-roster.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/nurse-roster/nurse-roster.api', () => ({
  nurseRosterApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  publishNurseRosterApi: jest.fn(),
  generateNurseRosterApi: jest.fn(),
}));
jest.mock('@offline/request', () => ({ queueRequestIfOffline: jest.fn() }));

describe('nurse-roster.usecase', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    api.nurseRosterApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    api.nurseRosterApi.get.mockResolvedValue({ data: { id: '1' } });
    api.nurseRosterApi.create.mockResolvedValue({ data: { id: '1' } });
    api.nurseRosterApi.update.mockResolvedValue({ data: { id: '1' } });
    api.nurseRosterApi.remove.mockResolvedValue({ data: { id: '1' } });
    api.publishNurseRosterApi.mockResolvedValue({ data: { id: '1', status: 'PUBLISHED' } });
    api.generateNurseRosterApi.mockResolvedValue({ data: { id: '1', status: 'GENERATED' } });
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore?.();
  });

  runCrudUsecaseTests(
    {
      list: listNurseRosters,
      get: getNurseRoster,
      create: createNurseRoster,
      update: updateNurseRoster,
      remove: deleteNurseRoster,
    },
    { queueRequestIfOffline }
  );

  it('listNurseRosters unwraps nested data payloads', async () => {
    api.nurseRosterApi.list.mockResolvedValue({
      data: {
        data: [{ id: '1', status: 'DRAFT' }],
      },
    });

    const result = await listNurseRosters({});
    expect(result).toEqual([{ id: '1', status: 'DRAFT' }]);
  });

  it('listNurseRosters falls back to empty list for null payloads', async () => {
    api.nurseRosterApi.list.mockResolvedValue({ data: null });
    await expect(listNurseRosters({})).resolves.toEqual([]);
  });

  it('publishNurseRoster calls publish api', async () => {
    const result = await publishNurseRoster('1', { notify_staff: true });
    expect(api.publishNurseRosterApi).toHaveBeenCalledWith('1', { notify_staff: true });
    expect(result).toEqual({ id: '1', status: 'PUBLISHED' });
  });

  it('publishNurseRoster uses default payload when omitted', async () => {
    const result = await publishNurseRoster('1');
    expect(api.publishNurseRosterApi).toHaveBeenCalledWith('1', {});
    expect(result).toEqual({ id: '1', status: 'PUBLISHED' });
  });

  it('generateNurseRoster calls generate api', async () => {
    const result = await generateNurseRoster('1', { force: true });
    expect(api.generateNurseRosterApi).toHaveBeenCalledWith('1', { force: true });
    expect(result).toEqual({ id: '1', status: 'GENERATED' });
  });

  it('generateNurseRoster uses default payload when omitted', async () => {
    const result = await generateNurseRoster('1');
    expect(api.generateNurseRosterApi).toHaveBeenCalledWith('1', {});
    expect(result).toEqual({ id: '1', status: 'GENERATED' });
  });

  it('rejects invalid id for generate', async () => {
    await expect(generateNurseRoster(null, { force: true })).rejects.toBeDefined();
  });
});
