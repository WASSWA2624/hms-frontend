/**
 * Auth Rules Tests
 * File: auth.rules.test.js
 */
import { parseAuthPayload, parseCredentials } from '@features/auth';

describe('auth.rules', () => {
  it('parses credentials and payloads', () => {
    expect(parseCredentials({ email: 'user@example.com', password: 'pass' })).toEqual({
      email: 'user@example.com',
      password: 'pass',
    });
    expect(parseAuthPayload({ token: 'abc' })).toEqual({ token: 'abc' });
  });
});
