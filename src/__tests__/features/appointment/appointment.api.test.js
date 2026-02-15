/**
 * Appointment API Tests
 * File: appointment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { appointmentApi } from '@features/appointment/appointment.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
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

  it('posts appointment cancel action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'CANCELLED' } });
    await appointmentApi.cancel('1', { reason: 'Patient requested' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.APPOINTMENTS.CANCEL('1'),
      method: 'POST',
      body: { reason: 'Patient requested' },
    });
  });
});
