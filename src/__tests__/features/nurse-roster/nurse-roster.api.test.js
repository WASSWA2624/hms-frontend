/**
 * Nurse Roster API Tests
 * File: nurse-roster.api.test.js
 */
import { apiClient } from '@services/api';
import { nurseRosterApi, publishNurseRosterApi } from '@features/nurse-roster';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn((eps) => ({
    list: jest.fn((params) =>
      Promise.resolve({
        data: [],
        ...(params && { params }),
      })
    ),
    get: jest.fn((id) => Promise.resolve({ data: { id } })),
    create: jest.fn((body) => Promise.resolve({ data: body })),
    update: jest.fn((id, body) => Promise.resolve({ data: { id, ...body } })),
    remove: jest.fn((id) => Promise.resolve({ data: { id } })),
  })),
}));

describe('nurse-roster.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes nurseRosterApi with list, get, create, update, remove', () => {
    expect(nurseRosterApi).toBeDefined();
    expect(typeof nurseRosterApi.list).toBe('function');
    expect(typeof nurseRosterApi.get).toBe('function');
    expect(typeof nurseRosterApi.create).toBe('function');
    expect(typeof nurseRosterApi.update).toBe('function');
    expect(typeof nurseRosterApi.remove).toBe('function');
  });

  it('list calls nurseRosterApi.list', async () => {
    const result = await nurseRosterApi.list({ page: 1 });
    expect(nurseRosterApi.list).toHaveBeenCalledWith({ page: 1 });
    expect(result).toBeDefined();
  });

  it('publishNurseRosterApi calls apiClient with publish URL', async () => {
    apiClient.mockResolvedValue({ data: {} });
    await publishNurseRosterApi('id-123', { notify_staff: true });
    expect(apiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/nurse-rosters/id-123/publish'),
        method: 'POST',
        body: { notify_staff: true },
      })
    );
  });
});
