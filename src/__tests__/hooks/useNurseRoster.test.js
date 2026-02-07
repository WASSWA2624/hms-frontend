/**
 * useNurseRoster Hook Tests
 * File: useNurseRoster.test.js
 */
import { renderHook, act } from '@testing-library/react-native';
import useNurseRoster from '@hooks/useNurseRoster';

jest.mock('@features/nurse-roster', () => ({
  listNurseRosters: jest.fn(),
  getNurseRoster: jest.fn(),
  createNurseRoster: jest.fn(),
  updateNurseRoster: jest.fn(),
  deleteNurseRoster: jest.fn(),
  publishNurseRoster: jest.fn(),
}));

const {
  listNurseRosters,
  getNurseRoster,
  createNurseRoster,
  publishNurseRoster,
} = require('@features/nurse-roster');

describe('useNurseRoster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns list, get, create, update, remove, publish actions', () => {
    const { result } = renderHook(() => useNurseRoster());
    expect(typeof result.current.list).toBe('function');
    expect(typeof result.current.get).toBe('function');
    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
    expect(typeof result.current.remove).toBe('function');
    expect(typeof result.current.publish).toBe('function');
  });

  it('list invokes listNurseRosters', async () => {
    listNurseRosters.mockResolvedValue([]);
    const { result } = renderHook(() => useNurseRoster());
    await act(async () => {
      await result.current.list({});
    });
    expect(listNurseRosters).toHaveBeenCalledWith({});
  });

  it('publish invokes publishNurseRoster', async () => {
    publishNurseRoster.mockResolvedValue({ id: '1', status: 'PUBLISHED' });
    const { result } = renderHook(() => useNurseRoster());
    await act(async () => {
      await result.current.publish('1');
    });
    expect(publishNurseRoster).toHaveBeenCalledWith('1');
  });
});
