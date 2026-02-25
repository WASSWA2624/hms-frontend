/**
 * Auth Model
 * Normalizes auth responses
 * File: auth.model.js
 */

const isPlainObject = (value) =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const normalizeAuthUser = (value) => {
  if (!isPlainObject(value)) return null;
  const { id, user_id, ...rest } = value;
  return { id: id ?? user_id ?? null, ...rest };
};

const normalizeAuthTokens = (value) => {
  if (!isPlainObject(value)) return null;
  const accessToken = value.accessToken || value.access_token || null;
  const refreshToken = value.refreshToken || value.refresh_token || null;
  if (!accessToken && !refreshToken) return null;
  return { accessToken, refreshToken };
};

const isLikelyUserPayload = (value) => {
  if (!isPlainObject(value)) return false;
  return Boolean(
    value.tenant_id
      || value.tenantId
      || value.email
      || value.phone
      || value.roles
      || value.role
      || value.role_name
      || value.status
      || value.tenant
      || value.currentTenantId
  );
};

const resolveUserSource = (value) => {
  if (!isPlainObject(value)) return null;
  if (isPlainObject(value.user)) return value.user;
  if (isLikelyUserPayload(value)) return value;
  if (isPlainObject(value.profile)) return value.profile;
  return null;
};

const normalizeAuthResponse = (value) => {
  if (!isPlainObject(value)) return { user: null, tokens: null };
  const userSource = resolveUserSource(value);
  const user = normalizeAuthUser(userSource);
  const tokensSource = value.tokens || value;
  const tokens = normalizeAuthTokens(tokensSource);
  return { user, tokens };
};

export { normalizeAuthUser, normalizeAuthTokens, normalizeAuthResponse };
