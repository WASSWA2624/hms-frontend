/**
 * useAppointment Hook
 * File: useAppointment.js
 */
import useCrud from '@hooks/useCrud';
import {
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from '@features/appointment';

const useAppointment = () =>
  useCrud({
    list: listAppointments,
    get: getAppointment,
    create: createAppointment,
    update: updateAppointment,
    remove: deleteAppointment,
    cancel: cancelAppointment,
  });

export default useAppointment;
