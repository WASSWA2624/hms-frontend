/**
 * Auth Model Tests
 * File: auth.model.test.js
 */
import { normalizeAuthResponse, normalizeAuthTokens, normalizeAuthUser } from '@features/auth';

describe('auth.model', () => {
  it('normalizes auth user and tokens', () => {
    expect(normalizeAuthUser(null)).toBeNull();
    expect(normalizeAuthUser({ id: '1', name: 'User' })).toEqual({ id: '1', name: 'User' });
    expect(normalizeAuthUser({ user_id: 'legacy-user', name: 'Legacy User' })).toEqual({
      id: 'legacy-user',
      name: 'Legacy User',
    });
    expect(normalizeAuthTokens(null)).toBeNull();
    expect(normalizeAuthTokens({ access_token: 'a', refresh_token: 'b' })).toEqual({
      accessToken: 'a',
      refreshToken: 'b',
    });
  });

  it('normalizes auth response', () => {
    expect(normalizeAuthResponse(null)).toEqual({ user: null, tokens: null });
    expect(normalizeAuthResponse({ user: { id: '2' }, tokens: { accessToken: 'a' } })).toEqual({
      user: { id: '2' },
      tokens: { accessToken: 'a', refreshToken: null },
    });
  });

  it('keeps full /auth/me user payload when profile is nested', () => {
    const response = normalizeAuthResponse({
      id: 'user-1',
      tenant_id: 'tenant-1',
      email: 'user@example.com',
      status: 'ACTIVE',
      profile: { id: 'profile-1', first_name: 'Ada' },
    });

    expect(response.user).toEqual({
      id: 'user-1',
      tenant_id: 'tenant-1',
      email: 'user@example.com',
      status: 'ACTIVE',
      profile: { id: 'profile-1', first_name: 'Ada' },
    });
  });

  it('does not coerce token-only payloads into user objects', () => {
    expect(
      normalizeAuthResponse({
        access_token: 'access-1',
        refresh_token: 'refresh-1',
      })
    ).toEqual({
      user: null,
      tokens: { accessToken: 'access-1', refreshToken: 'refresh-1' },
    });
  });

  it('falls back to profile payload when only profile data is present', () => {
    expect(
      normalizeAuthResponse({
        profile: { id: 'profile-1', first_name: 'Ada' },
      })
    ).toEqual({
      user: { id: 'profile-1', first_name: 'Ada' },
      tokens: null,
    });
  });
});
