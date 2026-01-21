/**
 * Appointment Participant Usecase Tests
 * File: appointment-participant.usecase.test.js
 */
import {
  listAppointmentParticipants,
  getAppointmentParticipant,
  createAppointmentParticipant,
  updateAppointmentParticipant,
  deleteAppointmentParticipant,
} from '@features/appointment-participant';
import { appointmentParticipantApi } from '@features/appointment-participant/appointment-participant.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/appointment-participant/appointment-participant.api', () => ({
  appointmentParticipantApi: {
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

describe('appointment-participant.usecase', () => {
  beforeEach(() => {
    appointmentParticipantApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    appointmentParticipantApi.get.mockResolvedValue({ data: { id: '1' } });
    appointmentParticipantApi.create.mockResolvedValue({ data: { id: '1' } });
    appointmentParticipantApi.update.mockResolvedValue({ data: { id: '1' } });
    appointmentParticipantApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAppointmentParticipants,
      get: getAppointmentParticipant,
      create: createAppointmentParticipant,
      update: updateAppointmentParticipant,
      remove: deleteAppointmentParticipant,
    },
    { queueRequestIfOffline }
  );
});
