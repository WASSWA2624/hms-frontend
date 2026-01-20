/**
 * Network Listener Tests
 * File: network.listener.test.js
 */
import NetInfo from '@react-native-community/netinfo';
import {
  __unsafeResetForTests,
  checkConnectivity,
  getIsOnline,
  startListening,
  stopListening,
  subscribe,
} from '@offline/network.listener';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

jest.mock('@logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Network Listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __unsafeResetForTests();
  });

  describe('checkConnectivity', () => {
    it('returns true when online', async () => {
      NetInfo.fetch.mockResolvedValue({ isConnected: true });

      const result = await checkConnectivity();

      expect(result).toBe(true);
      expect(getIsOnline()).toBe(true);
    });

    it('returns false when offline', async () => {
      NetInfo.fetch.mockResolvedValue({ isConnected: false });

      const result = await checkConnectivity();

      expect(result).toBe(false);
      expect(getIsOnline()).toBe(false);
    });

    it('treats null/undefined connectivity as offline (false)', async () => {
      NetInfo.fetch.mockResolvedValue({ isConnected: null });
      await expect(checkConnectivity()).resolves.toBe(false);

      NetInfo.fetch.mockResolvedValue({ isConnected: undefined });
      await expect(checkConnectivity()).resolves.toBe(false);
    });

    it('notifies subscribers only when status changes', async () => {
      const listener = jest.fn();
      subscribe(listener);

      NetInfo.fetch
        .mockResolvedValueOnce({ isConnected: true }) // true -> true (no change)
        .mockResolvedValueOnce({ isConnected: true }) // true -> true (no change)
        .mockResolvedValueOnce({ isConnected: false }) // true -> false (change)
        .mockResolvedValueOnce({ isConnected: false }); // false -> false (no change)

      await checkConnectivity();
      await checkConnectivity();
      await checkConnectivity();
      await checkConnectivity();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(false);
    });
  });

  describe('subscribe', () => {
    it('returns an unsubscribe function that prevents future notifications', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const unsubscribe1 = subscribe(listener1);
      subscribe(listener2);

      unsubscribe1();

      NetInfo.fetch.mockResolvedValue({ isConnected: false });
      await checkConnectivity();

      expect(listener1).toHaveBeenCalledTimes(0);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith(false);
    });
  });

  describe('startListening', () => {
    it('registers a NetInfo event listener and returns an unsubscribe function', () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);

      const result = startListening();

      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
      expect(result).toBe(unsubscribe);
    });

    it('is idempotent (does not register multiple NetInfo listeners)', () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);

      const a = startListening();
      const b = startListening();

      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
      expect(a).toBe(b);
    });

    it('notifies subscribers when NetInfo emits a change', () => {
      const unsubscribe = jest.fn();
      let handler;
      NetInfo.addEventListener.mockImplementation((h) => {
        handler = h;
        return unsubscribe;
      });

      const listener = jest.fn();
      subscribe(listener);

      startListening();
      handler({ isConnected: false });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(false);
    });

    it('stopListening calls NetInfo unsubscribe and allows re-starting', () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);

      startListening();
      stopListening();
      expect(unsubscribe).toHaveBeenCalledTimes(1);

      startListening();
      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(2);
    });
  });
});

