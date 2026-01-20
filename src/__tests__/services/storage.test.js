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

describe('Storage Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    });

    describe('setItem', () => {
      it('should store value securely', async () => {
        const testValue = 'secure-value';
        mockSecureStore.setItemAsync.mockResolvedValue();

        const result = await secure.setItem('test-key', testValue);
        expect(result).toBe(true);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', testValue);
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.setItemAsync.mockRejectedValue(error);

        const result = await secure.setItem('test-key', 'value');
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'setItem',
            key: 'test-key',
          })
        );
      });
    });

    describe('removeItem', () => {
      it('should remove item from secure storage', async () => {
        mockSecureStore.deleteItemAsync.mockResolvedValue();

        const result = await secure.removeItem('test-key');
        expect(result).toBe(true);
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
      });

      it('should return false and report error on failure', async () => {
        const error = new Error('Storage error');
        mockSecureStore.deleteItemAsync.mockRejectedValue(error);

        const result = await secure.removeItem('test-key');
        expect(result).toBe(false);
        expect(handleError).toHaveBeenCalledWith(
          error,
          expect.objectContaining({
            scope: 'services.storage.secure',
            op: 'removeItem',
            key: 'test-key',
          })
        );
      });
    });
  });
});

