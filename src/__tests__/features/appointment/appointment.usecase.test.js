/**
 * Appointment Usecase Tests
 * File: appointment.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  cancelAppointment,
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '@features/appointment';
import { appointmentApi } from '@features/appointment/appointment.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/appointment/appointment.api', () => ({
  appointmentApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    cancel: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('appointment.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    appointmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    appointmentApi.get.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.create.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.update.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.remove.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.cancel.mockResolvedValue({ data: { id: '1', status: 'CANCELLED' } });
  });

  runCrudUsecaseTests(
    {
      list: listAppointments,
      get: getAppointment,
      create: createAppointment,
      update: updateAppointment,
      remove: deleteAppointment,
    },
    { queueRequestIfOffline }
  );

  it('cancels appointment online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(cancelAppointment('1', { reason: 'Patient requested' })).resolves.toMatchObject({
      id: '1',
      status: 'CANCELLED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.APPOINTMENTS.CANCEL('1'),
      method: 'POST',
      body: { reason: 'Patient requested' },
    });
    expect(appointmentApi.cancel).toHaveBeenCalledWith('1', { reason: 'Patient requested' });
  });

  it('cancels appointment online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(cancelAppointment('1')).resolves.toMatchObject({
      id: '1',
      status: 'CANCELLED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.APPOINTMENTS.CANCEL('1'),
      method: 'POST',
      body: {},
    });
    expect(appointmentApi.cancel).toHaveBeenCalledWith('1', {});
  });

  it('queues appointment cancel offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(cancelAppointment('1', { reason: 'Patient requested' })).resolves.toMatchObject({
      id: '1',
      status: 'CANCELLED',
      reason: 'Patient requested',
    });
    expect(appointmentApi.cancel).not.toHaveBeenCalled();
  });

  it('rejects invalid id for cancel', async () => {
    await expect(cancelAppointment(null, { reason: 'Patient requested' })).rejects.toBeDefined();
  });
});
