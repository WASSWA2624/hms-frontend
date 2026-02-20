/**
 * useAppointmentParticipant Hook
 * File: useAppointmentParticipant.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createAppointmentParticipant,
  deleteAppointmentParticipant,
  getAppointmentParticipant,
  listAppointmentParticipants,
  updateAppointmentParticipant,
} from '@features/appointment-participant';

const useAppointmentParticipant = () => {
  const actions = useMemo(
    () => ({
      list: listAppointmentParticipants,
      get: getAppointmentParticipant,
      create: createAppointmentParticipant,
      update: updateAppointmentParticipant,
      remove: deleteAppointmentParticipant,
    }),
    []
  );

  return useCrud(actions);
};

export default useAppointmentParticipant;
