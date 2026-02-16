/**
 * Token Manager
 * Handles JWT token lifecycle
 * File: token.manager.js
 */
import { secure } from '@services/storage';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  STORAGE_MODE: 'token_storage_mode',
};

const STORAGE_MODES = {
  PERSISTENT: 'persistent',
  SESSION: 'session',
};

let inMemoryTokens = {
  accessToken: null,
  refreshToken: null,
};

let inMemoryMode = STORAGE_MODES.PERSISTENT;

const hasInMemorySession = () =>
  inMemoryMode === STORAGE_MODES.SESSION &&
  Boolean(inMemoryTokens.accessToken || inMemoryTokens.refreshToken);

const clearInMemoryTokens = () => {
  inMemoryTokens = { accessToken: null, refreshToken: null };
  inMemoryMode = STORAGE_MODES.PERSISTENT;
};

const getAccessToken = async () => {
  if (hasInMemorySession() && inMemoryTokens.accessToken) {
    return inMemoryTokens.accessToken;
  }
  return await secure.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

const getRefreshToken = async () => {
  if (hasInMemorySession() && inMemoryTokens.refreshToken) {
    return inMemoryTokens.refreshToken;
  }
  return await secure.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

const setTokens = async (accessToken, refreshToken, options = {}) => {
  const persist = options.persist !== false;

  if (!persist) {
    inMemoryMode = STORAGE_MODES.SESSION;
    inMemoryTokens = { accessToken, refreshToken };
    const results = await Promise.all([
      secure.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
      secure.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
      secure.setItem(TOKEN_KEYS.STORAGE_MODE, STORAGE_MODES.SESSION),
    ]);
    return results.every(Boolean);
  }

  inMemoryMode = STORAGE_MODES.PERSISTENT;
  inMemoryTokens = { accessToken: null, refreshToken: null };
  const results = await Promise.all([
    secure.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
    secure.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
    secure.setItem(TOKEN_KEYS.STORAGE_MODE, STORAGE_MODES.PERSISTENT),
  ]);
  return results.every(Boolean);
};

const clearTokens = async () => {
  clearInMemoryTokens();
  await Promise.all([
    secure.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
    secure.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
    secure.removeItem(TOKEN_KEYS.STORAGE_MODE),
  ]);
};

const shouldPersistTokens = async () => {
  if (hasInMemorySession()) return false;
  const storedMode = await secure.getItem(TOKEN_KEYS.STORAGE_MODE);
  return storedMode !== STORAGE_MODES.SESSION;
};

const decodeBase64 = (value) => {
  if (typeof value !== 'string') return null;

  // base64url -> base64
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  const normalized = `${base64}${padding}`;

  if (typeof globalThis?.atob === 'function') {
    try {
      return globalThis.atob(normalized);
    } catch {
      return null;
    }
  }

  // Jest/Node fallback
  const nodeBuffer = globalThis?.Buffer;
  if (nodeBuffer && typeof nodeBuffer.from === 'function') {
    return nodeBuffer.from(normalized, 'base64').toString('utf8');
  }

  return null;
};

const getJwtPayload = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  const decoded = decodeBase64(parts[1]);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;

  const payload = getJwtPayload(token);
  const expSeconds = payload?.exp;
  if (typeof expSeconds !== 'number' || !Number.isFinite(expSeconds)) return true;

  const expMs = expSeconds * 1000;
  return Date.now() >= expMs;
};

export {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  shouldPersistTokens,
  isTokenExpired,
};

