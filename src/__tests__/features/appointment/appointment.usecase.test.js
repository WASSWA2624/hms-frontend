/**
 * Appointment Usecase Tests
 * File: appointment.usecase.test.js
 */
import {
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
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('appointment.usecase', () => {
  beforeEach(() => {
    appointmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    appointmentApi.get.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.create.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.update.mockResolvedValue({ data: { id: '1' } });
    appointmentApi.remove.mockResolvedValue({ data: { id: '1' } });
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
});
