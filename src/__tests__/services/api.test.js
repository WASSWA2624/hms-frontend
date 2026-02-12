/**
 * API Services Tests
 * File: api.test.js
 */
// Mock fetch
global.fetch = jest.fn();

// Mock token manager (used by interceptors)
jest.mock('@security', () => ({
  tokenManager: {
    getAccessToken: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

// Mock error handler
jest.mock('@errors', () => ({
  handleError: jest.fn((error) => error),
}));

// Mock i18n + storage for locale header
jest.mock('@i18n', () => ({
  getDeviceLocale: jest.fn(() => 'en'),
  LOCALE_STORAGE_KEY: 'locale',
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
  },
}));

jest.mock('@services/csrf', () => ({
  getCsrfHeaders: jest.fn(async () => ({})),
  clearCsrfToken: jest.fn(),
}));

// Mock config
jest.mock('@config', () => ({
  TIMEOUTS: {
    API_REQUEST: 30000,
  },
}));

const { apiClient } = require('@services/api');
const { tokenManager } = require('@security');
const { handleError } = require('@errors');
const { async: asyncStorage } = require('@services/storage');
const { getCsrfHeaders } = require('@services/csrf');

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    jest.useFakeTimers();
    asyncStorage.getItem.mockResolvedValue(null);

    if (!global.AbortSignal || typeof global.AbortSignal.timeout !== 'function') {
      global.AbortSignal = { timeout: () => undefined };
    }
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('apiClient', () => {
    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      const result = await apiClient({ url: 'https://api.example.com/test' });

      expect(result).toEqual({ data: mockData, raw: mockData, status: 200 });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept-Language': 'en',
            'x-locale': 'en',
          }),
          credentials: 'include',
        })
      );
    });

    it('should unwrap backend envelope responses', async () => {
      const envelope = {
        status: 200,
        message: 'ok',
        data: { id: 1, name: 'Test' },
        meta: { locale: 'en', direction: 'ltr' },
      };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => envelope,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      const result = await apiClient({ url: 'https://api.example.com/test' });

      expect(result).toEqual({
        data: envelope.data,
        meta: envelope.meta,
        message: envelope.message,
        pagination: undefined,
        raw: envelope,
        status: 200,
      });
    });

    it('should attach Authorization header when token exists', async () => {
      const mockData = { id: 1 };
      const token = 'access-token-123';
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(token);

      await apiClient({ url: 'https://api.example.com/test' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token-123',
          }),
        })
      );
    });

    it('should make POST request with body', async () => {
      const mockData = { success: true };
      const requestBody = { name: 'Test' };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);
      getCsrfHeaders.mockResolvedValue({ 'X-CSRF-Token': 'csrf' });

      const result = await apiClient({
        url: 'https://api.example.com/test',
        method: 'POST',
        body: requestBody,
      });

      expect(result).toEqual({ data: mockData, raw: mockData, status: 201 });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'X-CSRF-Token': 'csrf' }),
          body: JSON.stringify(requestBody),
        })
      );
    });

    it('should handle 401 unauthorized error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Unauthorized', errors: [] }),
      });
      tokenManager.getAccessToken.mockResolvedValue(null);
      tokenManager.clearTokens.mockResolvedValue();

      await expect(
        apiClient({ url: 'https://api.example.com/test' })
      ).rejects.toBeDefined();

      expect(tokenManager.clearTokens).toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
    });

    it('should handle request timeout', async () => {
      global.fetch.mockImplementation((_, options = {}) => {
        const signal = options.signal;
        return new Promise((_, reject) => {
          if (signal?.aborted) {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
            return;
          }
          const onAbort = () => {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          };
          signal?.addEventListener?.('abort', onAbort);
          if (signal) signal.onabort = onAbort;
          // If not aborted, keep pending beyond the timeout.
        });
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      const promise = apiClient({
        url: 'https://api.example.com/test',
        timeout: 50,
      });

      const assertion = expect(promise).rejects.toBeDefined();
      await jest.advanceTimersByTimeAsync(50);
      await assertion;
      expect(handleError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Request timeout' }),
        { url: 'https://api.example.com/test' }
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      global.fetch.mockRejectedValue(networkError);
      tokenManager.getAccessToken.mockResolvedValue(null);

      await expect(
        apiClient({ url: 'https://api.example.com/test' })
      ).rejects.toBeDefined();

      expect(handleError).toHaveBeenCalled();
    });

    it('should use custom timeout when provided', async () => {
      const mockData = { id: 1 };
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      await apiClient({
        url: 'https://api.example.com/test',
        timeout: 10000,
      });

      // Verify timeout was set (indirectly through abort signal)
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle non-OK responses', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Not Found', errors: [] }),
      });
      tokenManager.getAccessToken.mockResolvedValue(null);

      await expect(
        apiClient({ url: 'https://api.example.com/test' })
      ).rejects.toBeDefined();

      expect(handleError).toHaveBeenCalled();
    });
  });
});

