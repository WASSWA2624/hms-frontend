/**
 * Appointment API Tests
 * File: appointment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { appointmentApi } from '@features/appointment/appointment.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('appointment.api', () => {
  it('creates crud api with appointment endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.APPOINTMENTS);
    expect(appointmentApi).toBeDefined();
  });
});
