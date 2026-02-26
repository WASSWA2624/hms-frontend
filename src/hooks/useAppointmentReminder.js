/**
 * useAppointmentReminder Hook
 * File: useAppointmentReminder.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createAppointmentReminder,
  deleteAppointmentReminder,
  getAppointmentReminder,
  listAppointmentReminders,
  markAppointmentReminderSent,
  updateAppointmentReminder,
} from '@features/appointment-reminder';

const useAppointmentReminder = () => {
  const actions = useMemo(
    () => ({
      list: listAppointmentReminders,
      get: getAppointmentReminder,
      create: createAppointmentReminder,
      update: updateAppointmentReminder,
      remove: deleteAppointmentReminder,
      markSent: markAppointmentReminderSent,
    }),
    []
  );

  return useCrud(actions);
};

export default useAppointmentReminder;
