/**
 * Storage Services Tests
 * File: storage.test.js
 */
// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
}));

// Mock SecureStore
const mockSecureStore = {
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
};

jest.mock('expo-secure-store', () => mockSecureStore);

// Mock error handler (services must not log directly; errors are routed via @errors)
jest.mock('@errors', () => ({
  handleError: jest.fn(),
}));

const { async, secure } = require('@services/storage');
const { handleError } = require('@errors');
const originalWindow = globalThis.window;

const createMockSessionStorage = (initialValues = {}) => {
  const store = new Map(Object.entries(initialValues));
  return {
    getItem: jest.fn((key) => (store.has(key) ? store.get(key) : null)),
    setItem: jest.fn((key, value) => {
      store.set(key, String(value));
    }),
    removeItem: jest.fn((key) => {
      store.delete(key);
    }),
  };
};

describe('Storage Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.isAvailableAsync.mockResolvedValue(true);
    if (typeof originalWindow === 'undefined') {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  afterAll(() => {
    if (typeof originalWindow === 'undefined') {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  describe('AsyncStorage Service', () => {
    describe('getItem', () => {
      it('should retrieve and parse stored value', async () => {
        const testValue = { key: 'value' };
        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testValue));

        const result = await async.getItem('test-key');
        expect(result).toEqual(testValue);
        expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      });

      it('should return null when key does not exist', async () => {
        mockAsyncStorage.getItem.mockResolvedValue(null);

        const result = await async.getItem('non-existent');
        expect(result).toBeNull();
      });

      it('should return null and report error on failure', async () => {
        const error = new Error('Storage error');
        mockAsyncStorage.getItem.mockRejectedValue(error);

        const result = await async.getItem('test-key');
        expect(result).toBeNull();
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.async',
            op: 'getItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('setItem', () => {
      it('should store value as JSON string', async () => {
        const testValue = { key: 'value' };
        mockAsyncStorage.setItem.mockResolvedValue();

        const result = await async.setItem('test-key', testValue);
        expect(result).toBe(true);
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
          'test-key',
          JSON.stringify(testValue)
        );
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockAsyncStorage.setItem.mockRejectedValue(error);

        const result = await async.setItem('test-key', { data: 'value' });
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.async',
            op: 'setItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('removeItem', () => {
      it('should remove item from storage', async () => {
        mockAsyncStorage.removeItem.mockResolvedValue();

        const result = await async.removeItem('test-key');
        expect(result).toBe(true);
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockAsyncStorage.removeItem.mockRejectedValue(error);

        const result = await async.removeItem('test-key');
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.async',
            op: 'removeItem',
            key: 'test-key',
          })
        );
      });
    });
  });

  describe('SecureStore Service', () => {
    describe('getItem', () => {
      it('should retrieve stored value', async () => {
        const testValue = 'secure-value';
        mockSecureStore.getItemAsync.mockResolvedValue(testValue);

        const result = await secure.getItem('test-key');
        expect(result).toBe(testValue);
        expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      });

      it('should return null when key does not exist', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        const result = await secure.getItem('non-existent');
        expect(result).toBeNull();
      });

      it('should return null and report error on failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.getItemAsync.mockRejectedValue(error);

        const result = await secure.getItem('test-key');
        expect(result).toBeNull();
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'getItem',
            key: 'test-key',
          })
        );
      });

      it('uses web sessionStorage fallback when secure read fails', async () => {
        const error = new Error('Secure read failed');
        const sessionStorage = createMockSessionStorage({ 'test-key': 'session-value' });
        globalThis.window = { sessionStorage };
        mockSecureStore.getItemAsync.mockRejectedValue(error);

        const result = await secure.getItem('test-key');

        expect(result).toBe('session-value');
        expect(sessionStorage.getItem).toHaveBeenCalledWith('test-key');
      });

      it('uses web sessionStorage when SecureStore is unavailable', async () => {
        const sessionStorage = createMockSessionStorage({ 'test-key': 'session-value' });
        globalThis.window = { sessionStorage };
        mockSecureStore.isAvailableAsync.mockResolvedValue(false);

        const result = await secure.getItem('test-key');

        expect(result).toBe('session-value');
        expect(sessionStorage.getItem).toHaveBeenCalledWith('test-key');
        expect(mockSecureStore.getItemAsync).not.toHaveBeenCalled();
      });
    });

    describe('setItem', () => {
      it('should store value securely', async () => {
        const testValue = 'secure-value';
        mockSecureStore.setItemAsync.mockResolvedValue();

        const result = await secure.setItem('test-key', testValue);
        expect(result).toBe(true);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
          'test-key',
          testValue
        );
      });

      it('should fallback to volatile storage and report error on secure write failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.setItemAsync.mockRejectedValue(error);

        const result = await secure.setItem('test-key', 'value');
        expect(result).toBe(true);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'setItem',
            key: 'test-key',
          })
        );
      });

      it('stores values in volatile memory when SecureStore is unavailable', async () => {
        mockSecureStore.isAvailableAsync.mockResolvedValue(false);

        const setOk = await secure.setItem('volatile-key', 'volatile-value');
        const value = await secure.getItem('volatile-key');

        expect(setOk).toBe(true);
        expect(value).toBe('volatile-value');
        expect(mockSecureStore.setItemAsync).not.toHaveBeenCalled();
      });

      it('stores values in web sessionStorage when SecureStore is unavailable on web', async () => {
        const sessionStorage = createMockSessionStorage();
        globalThis.window = { sessionStorage };
        mockSecureStore.isAvailableAsync.mockResolvedValue(false);

        const setOk = await secure.setItem('web-key', 'web-value');
        const value = await secure.getItem('web-key');

        expect(setOk).toBe(true);
        expect(value).toBe('web-value');
        expect(sessionStorage.setItem).toHaveBeenCalledWith('web-key', 'web-value');
      });
    });

    describe('removeItem', () => {
      it('should remove item from secure storage', async () => {
        mockSecureStore.deleteItemAsync.mockResolvedValue();

        const result = await secure.removeItem('test-key');
        expect(result).toBe(true);
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
          'test-key'
        );
      });

      it('should fallback to volatile storage and report error on secure remove failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.deleteItemAsync.mockRejectedValue(error);

        const result = await secure.removeItem('test-key');
        expect(result).toBe(true);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'removeItem',
            key: 'test-key',
          })
        );
      });

      it('removes volatile value when SecureStore is unavailable', async () => {
        mockSecureStore.isAvailableAsync.mockResolvedValue(false);
        await secure.setItem('volatile-remove', 'value');

        const removed = await secure.removeItem('volatile-remove');
        const value = await secure.getItem('volatile-remove');

        expect(removed).toBe(true);
        expect(value).toBeNull();
        expect(mockSecureStore.deleteItemAsync).not.toHaveBeenCalled();
      });

      it('removes web sessionStorage value when SecureStore is unavailable on web', async () => {
        const sessionStorage = createMockSessionStorage();
        globalThis.window = { sessionStorage };
        mockSecureStore.isAvailableAsync.mockResolvedValue(false);
        await secure.setItem('web-remove', 'value');

        const removed = await secure.removeItem('web-remove');
        const value = await secure.getItem('web-remove');

        expect(removed).toBe(true);
        expect(value).toBeNull();
        expect(sessionStorage.removeItem).toHaveBeenCalledWith('web-remove');
      });
    });
  });
});
