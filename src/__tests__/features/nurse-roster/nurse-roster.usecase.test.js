/**
 * Nurse Roster Use Case Tests
 * File: nurse-roster.usecase.test.js
 */
import {
  listNurseRosters,
  getNurseRoster,
  createNurseRoster,
  publishNurseRoster,
} from '@features/nurse-roster';
import * as api from '@features/nurse-roster/nurse-roster.api';

jest.mock('@features/nurse-roster/nurse-roster.api', () => ({
  nurseRosterApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  publishNurseRosterApi: jest.fn(),
}));
jest.mock('@offline/request', () => ({ queueRequestIfOffline: jest.fn(() => null) }));

describe('nurse-roster.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listNurseRosters returns normalized list', async () => {
    api.nurseRosterApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    const result = await listNurseRosters({});
    expect(result).toEqual([{ id: '1' }]);
  });

  it('getNurseRoster returns normalized roster', async () => {
    api.nurseRosterApi.get.mockResolvedValue({ data: { id: '1', status: 'DRAFT' } });
    const result = await getNurseRoster('1');
    expect(result).toEqual({ id: '1', status: 'DRAFT' });
  });

  it('createNurseRoster returns normalized roster', async () => {
    api.nurseRosterApi.create.mockResolvedValue({ data: { id: 'new', status: 'DRAFT' } });
    const result = await createNurseRoster({
      tenant_id: 't1',
      period_start: '2026-02-01',
      period_end: '2026-02-28',
    });
    expect(result).toEqual({ id: 'new', status: 'DRAFT' });
  });

  it('publishNurseRoster calls publish api', async () => {
    api.publishNurseRosterApi.mockResolvedValue({ data: { id: '1', status: 'PUBLISHED' } });
    const result = await publishNurseRoster('1');
    expect(api.publishNurseRosterApi).toHaveBeenCalledWith('1', {});
    expect(result).toEqual({ id: '1', status: 'PUBLISHED' });
  });
});
