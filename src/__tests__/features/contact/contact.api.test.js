/**
 * Contact API Tests
 * File: contact.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { contactApi } from '@features/contact/contact.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('contact.api', () => {
  it('creates crud api with contact endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.CONTACTS);
    expect(contactApi).toBeDefined();
  });
});
