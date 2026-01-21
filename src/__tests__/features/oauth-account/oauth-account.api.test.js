/**
 * OAuth Account API Tests
 * File: oauth-account.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { oauthAccountApi } from '@features/oauth-account/oauth-account.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('oauth-account.api', () => {
  it('creates crud api with oauth account endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.OAUTH_ACCOUNTS);
    expect(oauthAccountApi).toBeDefined();
  });
});
