/**
 * Room API Tests
 * File: room.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { roomApi } from '@features/room/room.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('room.api', () => {
  it('creates crud api with room endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ROOMS);
    expect(roomApi).toBeDefined();
  });
});
