/**
 * Token Manager Tests
 * File: token.manager.test.js
 */
// Mock storage service
const mockSecureStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@services/storage', () => ({
  secure: mockSecureStorage,
}));

const { tokenManager } = require('@security');

const base64Encode = (value) => {
  if (typeof globalThis?.btoa === 'function') return globalThis.btoa(value);
  const nodeBuffer = globalThis?.Buffer;
  if (nodeBuffer && typeof nodeBuffer.from === 'function') {
    return nodeBuffer.from(value, 'utf8').toString('base64');
  }
  throw new Error('NO_BASE64_ENCODER');
};

describe('Token Manager', () => {
  const originalAtob = globalThis.atob;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    globalThis.atob = originalAtob;
  });

  describe('getAccessToken', () => {
    it('should retrieve access token from secure storage', async () => {
      const token = 'access-token-123';
      mockSecureStorage.getItem.mockResolvedValue(token);

      const result = await tokenManager.getAccessToken();
      expect(result).toBe(token);
      expect(mockSecureStorage.getItem).toHaveBeenCalledWith('access_token');
    });

    it('should return null when token does not exist', async () => {
      mockSecureStorage.getItem.mockResolvedValue(null);

      const result = await tokenManager.getAccessToken();
      expect(result).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should retrieve refresh token from secure storage', async () => {
      const token = 'refresh-token-123';
      mockSecureStorage.getItem.mockResolvedValue(token);

      const result = await tokenManager.getRefreshToken();
      expect(result).toBe(token);
      expect(mockSecureStorage.getItem).toHaveBeenCalledWith('refresh_token');
    });

    it('should return null when token does not exist', async () => {
      mockSecureStorage.getItem.mockResolvedValue(null);

      const result = await tokenManager.getRefreshToken();
      expect(result).toBeNull();
    });
  });

  describe('setTokens', () => {
    it('should store both access and refresh tokens', async () => {
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';
      mockSecureStorage.setItem.mockResolvedValue(true);

      const result = await tokenManager.setTokens(accessToken, refreshToken);
      expect(result).toBe(true);
      expect(mockSecureStorage.setItem).toHaveBeenCalledWith(
        'access_token',
        accessToken
      );
      expect(mockSecureStorage.setItem).toHaveBeenCalledWith(
        'refresh_token',
        refreshToken
      );
    });

    it('should return false if any token storage fails', async () => {
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';
      mockSecureStorage.setItem
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const result = await tokenManager.setTokens(accessToken, refreshToken);
      expect(result).toBe(false);
    });

    it('stores session mode tokens when persist=false', async () => {
      mockSecureStorage.removeItem.mockResolvedValue(true);
      mockSecureStorage.setItem.mockResolvedValue(true);

      const result = await tokenManager.setTokens(
        'session-access',
        'session-refresh',
        { persist: false }
      );

      expect(result).toBe(true);
      expect(mockSecureStorage.removeItem).toHaveBeenCalledWith(
        'access_token',
      );
      expect(mockSecureStorage.removeItem).toHaveBeenCalledWith(
        'refresh_token',
      );
      expect(mockSecureStorage.setItem).toHaveBeenCalledWith(
        'token_storage_mode',
        'session'
      );
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens from secure storage', async () => {
      mockSecureStorage.removeItem.mockResolvedValue(true);

      await tokenManager.clearTokens();
      expect(mockSecureStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockSecureStorage.removeItem).toHaveBeenCalledWith(
        'refresh_token'
      );
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for null or undefined token', () => {
      expect(tokenManager.isTokenExpired(null)).toBe(true);
      expect(tokenManager.isTokenExpired(undefined)).toBe(true);
      expect(tokenManager.isTokenExpired('')).toBe(true);
    });

    it('should return true for expired token', () => {
      const expiredTime = Math.floor((Date.now() - 1000) / 1000); // 1 second ago
      const payload = { exp: expiredTime };
      const token = `header.${base64Encode(JSON.stringify(payload))}.signature`;

      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });

    it('should return false for valid token', () => {
      const futureTime = Math.floor((Date.now() + 3600000) / 1000); // 1 hour from now
      const payload = { exp: futureTime };
      const token = `header.${base64Encode(JSON.stringify(payload))}.signature`;

      expect(tokenManager.isTokenExpired(token)).toBe(false);
    });

    it('should return true for invalid token format', () => {
      expect(tokenManager.isTokenExpired('invalid-token')).toBe(true);
      expect(tokenManager.isTokenExpired('header.payload')).toBe(true);
      expect(tokenManager.isTokenExpired('not.a.valid.jwt.token')).toBe(true);
    });

    it('should return true for token with invalid base64 payload', () => {
      const token = 'header.invalid-base64.signature';
      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });

    it('should return true when payload is not valid JSON', () => {
      const token = `header.${base64Encode('not-json')}.signature`;
      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });

    it('should return true when exp is not a number', () => {
      const payload = { exp: 'nope' };
      const token = `header.${base64Encode(JSON.stringify(payload))}.signature`;
      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });

    it('uses atob when available', () => {
      globalThis.atob = jest.fn((value) => {
        // Reverse base64url normalization for testing.
        const nodeBuffer = globalThis?.Buffer;
        return nodeBuffer.from(value, 'base64').toString('utf8');
      });
      const futureTime = Math.floor((Date.now() + 3600000) / 1000);
      const payload = { exp: futureTime };
      const token = `header.${base64Encode(JSON.stringify(payload))}.signature`;
      expect(tokenManager.isTokenExpired(token)).toBe(false);
      expect(globalThis.atob).toHaveBeenCalled();
    });

    it('returns true when atob fails', () => {
      globalThis.atob = jest.fn(() => {
        throw new Error('ATOB_FAIL');
      });
      const token = `header.${base64Encode(JSON.stringify({ exp: 1 }))}.signature`;
      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });
  });

  describe('shouldPersistTokens', () => {
    it('returns false when storage mode is session', async () => {
      mockSecureStorage.getItem.mockResolvedValue('session');

      const result = await tokenManager.shouldPersistTokens();

      expect(result).toBe(false);
      expect(mockSecureStorage.getItem).toHaveBeenCalledWith(
        'token_storage_mode'
      );
    });

    it('returns true when storage mode is not session', async () => {
      mockSecureStorage.getItem.mockResolvedValue('persistent');

      const result = await tokenManager.shouldPersistTokens();

      expect(result).toBe(true);
    });
  });
});
