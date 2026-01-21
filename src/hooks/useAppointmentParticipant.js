/**
 * useAppointmentParticipant Hook
 * File: useAppointmentParticipant.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAppointmentParticipant,
  deleteAppointmentParticipant,
  getAppointmentParticipant,
  listAppointmentParticipants,
  updateAppointmentParticipant,
} from '@features/appointment-participant';

const useAppointmentParticipant = () =>
  useCrud({
    list: listAppointmentParticipants,
    get: getAppointmentParticipant,
    create: createAppointmentParticipant,
    update: updateAppointmentParticipant,
    remove: deleteAppointmentParticipant,
  });

export default useAppointmentParticipant;
