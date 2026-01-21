/**
 * useAppointmentReminder Hook
 * File: useAppointmentReminder.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAppointmentReminder,
  deleteAppointmentReminder,
  getAppointmentReminder,
  listAppointmentReminders,
  updateAppointmentReminder,
} from '@features/appointment-reminder';

const useAppointmentReminder = () =>
  useCrud({
    list: listAppointmentReminders,
    get: getAppointmentReminder,
    create: createAppointmentReminder,
    update: updateAppointmentReminder,
    remove: deleteAppointmentReminder,
  });

export default useAppointmentReminder;
