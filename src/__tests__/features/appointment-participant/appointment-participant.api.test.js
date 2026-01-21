/**
 * Appointment Participant API Tests
 * File: appointment-participant.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { appointmentParticipantApi } from '@features/appointment-participant/appointment-participant.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('appointment-participant.api', () => {
  it('creates crud api with appointment participant endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.APPOINTMENT_PARTICIPANTS);
    expect(appointmentParticipantApi).toBeDefined();
  });
});
